const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Test the actual TypeScript helpers without introducing a second runtime dependency.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  });
  module._compile(outputText, filename);
};
const { archiveState, archiveHref, archiveMetadata } = require('../lib/archive.ts');
const { SITE_NAVIGATION, ARCHIVE_PAGE_SIZE } = require('../lib/site.ts');
const { optimizeContentImages } = require('../lib/images.ts');
const { decodeRouteSegment } = require('../lib/route-params.ts');
const { canonicalCategory, categoryPath, categoryRedirectHref } = require('../lib/category-route.ts');
const posts = Array.from({ length: 27 }, (_, i) => ({ slug: String(i), title: `Product ${i}`, excerpt: 'Audio review', tags: ['Brand'], category: i % 2 ? 'DAC' : 'DAP' }));

test('category routes use the stored spelling and preserve redirect query values', () => {
  const categories = ['SPEAKER', 'LISTENING SPACE', 'MixedCase', '청음실'];
  for (const spelling of ['speaker', 'Speaker', 'SPEAKER']) {
    assert.equal(canonicalCategory(spelling, categories), 'SPEAKER');
  }
  assert.equal(canonicalCategory('mixedcase', categories), 'MixedCase');
  assert.equal(canonicalCategory('not-a-category', categories), undefined);
  assert.equal(categoryPath('LISTENING SPACE'), '/categories/LISTENING%20SPACE');
  assert.equal(categoryPath('청음실'), '/categories/%EC%B2%AD%EC%9D%8C%EC%8B%A4');
  assert.equal(categoryRedirectHref('SPEAKER', {}), '/categories/SPEAKER');
  const href = categoryRedirectHref('SPEAKER', { page: '2', q: 'DAC & AMP', category: 'SPEAKER', extra: ['one', 'two'], empty: '', absent: undefined });
  const url = new URL(href, 'https://audiolife.kr');
  assert.equal(url.pathname, '/categories/SPEAKER');
  assert.deepEqual([...url.searchParams], [['page', '2'], ['q', 'DAC & AMP'], ['category', 'SPEAKER'], ['extra', 'one'], ['extra', 'two'], ['empty', '']]);
});

test('category page redirects variants with 308, keeps canonical pages and rejects unknown categories', () => {
  const vm = require('node:vm');
  const entries = Array.from({ length: 27 }, (_, i) => ({ ...posts[i], category: 'SPEAKER', date: '2026-10-28' }));
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('app/categories/[category]/page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => {
    if (name === '@/lib/content') return { getAllCategories: () => ['SPEAKER', 'LISTENING SPACE'], getPostsByCategory: category => category === 'SPEAKER' ? entries : [] };
    if (name === '@/components/PostArchive') return { __esModule: true, default: function Archive() {} };
    if (name.startsWith('@/lib/')) return require(`../${name.slice(2)}.ts`);
    return require(name);
  }});
  const route = module.exports;
  const query = { page: '2', q: ['Product', 'ignored'], category: 'SPEAKER', extra: ['a', 'b'] };
  for (const spelling of ['speaker', 'Speaker']) {
    assert.throws(() => route.default({ params: { category: spelling }, searchParams: query }), error => {
      assert.equal(error.digest, 'NEXT_REDIRECT;replace;/categories/SPEAKER?page=2&q=Product&q=ignored&category=SPEAKER&extra=a&extra=b;308;');
      return true;
    });
  }
  const page = route.default({ params: { category: 'SPEAKER' }, searchParams: { page: '2' } });
  assert.equal(page.props.collection.path, '/categories/SPEAKER');
  assert.equal(archiveState(page.props.collection.posts, page.props.query).posts.length, 12);
  const metadata = route.generateMetadata({ params: { category: 'speaker' }, searchParams: { page: '2' } });
  assert.equal(metadata.alternates.canonical, 'https://audiolife.kr/categories/SPEAKER?page=2');
  for (const method of [route.default, route.generateMetadata]) {
    assert.throws(() => method({ params: { category: 'not-a-category' }, searchParams: {} }), error => error.digest === 'NEXT_NOT_FOUND');
  }
  assert.throws(() => route.default({ params: { category: 'listening%20space' }, searchParams: {} }), error => error.digest === 'NEXT_REDIRECT;replace;/categories/LISTENING%20SPACE;308;');
});

test('taxonomy route segments decode Korean, spaces and special characters once', () => {
  for (const label of ['포터블오디오', '아스텔앤컨', 'LISTENING SPACE', 'A/B & C+', '100%', 'DAP']) {
    assert.equal(decodeRouteSegment(encodeURIComponent(label)), label);
    assert.equal(decodeRouteSegment(label), label);
  }
  assert.equal(decodeRouteSegment(encodeURIComponent('청음실'.normalize('NFD'))), '청음실');
  assert.equal(decodeRouteSegment('%ED%broken'), '%ED%broken');
  assert.equal(decodeRouteSegment('%2520'), '%20');
});

test('pagination is bounded and preserves all records exactly once', () => {
  const pages = [1, 2, 3].flatMap(page => archiveState(posts, { page: String(page) }).posts);
  assert.equal(archiveState(posts, {}).posts.length, ARCHIVE_PAGE_SIZE);
  assert.deepEqual(pages, posts);
  assert.equal(archiveState(posts, { page: '-4' }).page, 1);
  assert.equal(archiveState(posts, { page: '1e5' }).page, 1);
  assert.equal(archiveState(posts, { page: '999' }).posts.length, 0);
});
test('category and text filters compose, including empty and array queries', () => {
  const state = archiveState(posts, { q: ['BRAND', 'ignored'], category: 'DAC' });
  assert.equal(state.total, 13);
  assert.ok(state.posts.every(post => post.category === 'DAC'));
  assert.equal(archiveState(posts, { q: 'does-not-exist' }).total, 0);
  assert.equal(archiveState(posts, { q: 'does-not-exist' }).pages, 1);
});
test('page links preserve filters; canonical and indexing policy are explicit', () => {
  assert.equal(archiveHref('/articles', { q: '', category: '', page: 1 }), '/articles');
  assert.equal(archiveHref('/articles', { q: 'DAC & AMP', category: 'DAC', page: 2 }), '/articles?q=DAC+%26+AMP&category=DAC&page=2');
  assert.equal(archiveMetadata('articles', { page: '2' }).alternates.canonical, 'https://audiolife.kr/articles?page=2');
  assert.deepEqual(archiveMetadata('articles', { q: 'amp' }).robots, { index: false, follow: true });
});
test('retired calendar is absent from navigation', () => {
  assert.equal(SITE_NAVIGATION.some(item => item.href === '/calendar'), false);
  assert.equal(fs.existsSync('app/calendar/page.tsx'), false);
});
test('body image optimization preserves alt and fallback images', async () => {
  const html = '<p><img src="/posts/reviews/HC5/1.jpg" alt="HC5 &amp; audio"></p><img src="https://example.com/a.jpg" alt="Remote"><img src="/missing.jpg" alt="Missing">';
  const result = await optimizeContentImages(html);
  assert.match(result, /alt="HC5 &amp; audio"/);
  assert.match(result, /srcset="/);
  assert.match(result, /width="\d+" height="\d+"/);
  assert.match(result, /src="https:\/\/example.com\/a.jpg"/);
  assert.match(result, /src="\/missing.jpg"/);
  assert.equal((result.match(/loading="lazy"/g) || []).length, 3);
});

test('imported excerpts are not repeated above the same body opening', () => {
  const { hasDistinctExcerpt } = require('../lib/presentation.ts');
  assert.equal(hasDistinctExcerpt({ excerpt: '첫 문단입니다...', bodyPreview: '첫 문단입니다. 그 다음 내용입니다.' }), false);
  assert.equal(hasDistinctExcerpt({ excerpt: '별도로 작성한 부제', bodyPreview: '첫 문단입니다.' }), true);
  assert.equal(hasDistinctExcerpt({ excerpt: '', bodyPreview: '내용' }), false);
});
