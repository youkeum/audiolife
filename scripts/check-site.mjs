import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://localhost:3010');
const decode = text => text.replaceAll('&amp;', '&');
async function read(path, expected = 200) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, expected, `${path}: HTTP ${response.status}`);
  return response.text();
}
function canonical(html) {
  return decode(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '');
}
const staticWebp = /^\/_post-images\/[a-f0-9]{24}-\d+\.webp$/;
function responsiveWebp(html, label) {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
    const srcset = tag.match(/\ssrcset="([^"]+)"/i)?.[1];
    if (!src || !srcset || !tag.includes('loading="lazy"')) continue;
    const variants = srcset.split(',').map(entry => entry.trim().split(/\s+/)[0]);
    const webp = variants.filter(url => staticWebp.test(url));
    if (!webp.length) continue;
    assert.ok(variants.includes(src) && variants.every(url => staticWebp.test(url) || url === src),
      `${label}: unexpected srcset paths`);
    return webp;
  }
  assert.fail(`${label}: lazy responsive static WebP missing`);
}
const home = await read('/');
assert.ok(!home.includes('href="/calendar"'), 'Calendar link remains');
const thumbnails = responsiveWebp(home, 'Home thumbnail');
await read('/calendar', 404);
assert.equal(canonical(await read('/about')), 'https://audiolife.kr/about');
const articles = await read('/articles');
assert.equal((articles.match(/<article\b/g) || []).length, 12);
const page2 = await read('/articles?page=2');
assert.equal(canonical(page2), 'https://audiolife.kr/articles?page=2');
assert.equal((page2.match(/<article\b/g) || []).length, 12);
const filtered = await read('/articles?category=DAP');
assert.ok(filtered.includes('content="noindex, follow"'));
const empty = await read('/articles?q=__no_such_article__');
assert.equal((empty.match(/<article\b/g) || []).length, 0);
assert.ok(empty.includes('일치하는 글이 없습니다'));
await read('/articles?page=999', 404);
await read('/tags/__missing_tag__', 404);
assert.ok((await read('/search?q=DAP')).includes('content="noindex, follow"'));

const xml = await read('/sitemap.xml');
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(decode(match[1])).pathname);
for (const path of paths) {
  const html = await read(path);
  assert.equal(canonical(html), `https://audiolife.kr${path === '/' ? '' : path}`, `${path}: canonical`);
  for (const schema of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(schema[1]);
}
const reviewPath = paths.find(path => path.startsWith('/reviews/'));
const review = await read(reviewPath);
assert.ok(review.includes('리뷰어 YK'));
assert.ok(review.includes('함께 읽으면 좋은 글'));
const body = review.match(/<div class="prose [^"]+">([\s\S]*?)<nav [^>]*aria-label="관련 태그"/)?.[1] || '';
const bodyImages = responsiveWebp(body, 'Review body');
const imagePaths = new Set([...thumbnails, ...bodyImages]);
await Promise.all([...imagePaths].map(async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  assert.match(response.headers.get('content-type') || '', /^image\/webp\b/, path);
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', path);
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', path);
}));
console.log(`PASS: ${paths.length} sitemap pages, pagination, search/filter, metadata, calendar removal, ${imagePaths.size} static WebP variants`);
