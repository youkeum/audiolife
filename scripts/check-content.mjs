import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directories = { reviews: 'content/reviews', articles: 'content/articles', columns: 'content/columns/posts' };
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const normalize = text => text.replace(/\s+/g, ' ').replace(/[.…]+$/, '').trim();
const genericTags = new Set(['기사', '리뷰', '오디오 소식', '오디오 리뷰', '컬럼']);

export function auditPost(file, type, raw, exists = fs.existsSync) {
  const issues = [];
  const add = (level, code, message) => issues.push({ file, level, code, message });
  let data, content;
  try { ({ data, content } = matter(raw)); }
  catch { add('error', 'frontmatter', 'YAML frontmatter를 읽을 수 없습니다.'); return issues; }
  for (const field of ['title', 'excerpt', 'category']) if (typeof data[field] !== 'string' || !data[field].trim()) add('error', field, `${field}를 입력하세요.`);
  if (!validDate(data.date)) add('error', 'date', 'date는 실제 YYYY-MM-DD 날짜여야 합니다.');
  if (data.updated !== undefined && (!validDate(data.updated) || data.updated < data.date)) add('error', 'updated', 'updated는 발행일 이후의 YYYY-MM-DD 날짜여야 합니다.');
  if (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string' || !tag.trim())) add('error', 'tags', 'tags는 비어 있지 않은 문자열의 배열이어야 합니다.');
  else {
    if (!data.tags.length) add('warning', 'tags-empty', '검색 주제와 브랜드를 나타내는 태그를 추가하세요.');
    if (new Set(data.tags.map(tag => tag.trim().toLowerCase())).size < data.tags.length) add('warning', 'tags-duplicate', '중복 태그가 있습니다.');
    if (data.tags.some(tag => genericTags.has(tag))) add('warning', 'tags-generic', '리뷰/기사 같은 분류명 대신 제품·브랜드·주제 태그를 권장합니다.');
  }
  if (type === 'reviews') {
    if (!['Product', 'Place'].includes(data.reviewItemType)) add('warning', 'review-type', 'reviewItemType에 Product 또는 Place를 지정하세요.');
    if (typeof data.reviewItemName !== 'string' || !data.reviewItemName.trim()) add('warning', 'review-name', 'reviewItemName에 실제 제품명 또는 공간명을 지정하세요.');
  }
  const bodyText = content.replace(/!\[[^\]]*\]\([^\n]+\)/g, '').replace(/^https?:\/\/\S+\s*$/gm, '').replace(/<[^>]+>/g, '').trim();
  if (bodyText.length > 800 && !/^##\s+\S/m.test(content)) add('warning', 'headings', '긴 본문에 H2 소제목이 없습니다.');
  if (typeof data.excerpt === 'string') {
    const summary = normalize(data.excerpt);
    if (summary && normalize(bodyText).startsWith(summary)) add('warning', 'excerpt-copy', 'excerpt가 본문 첫 부분과 동일합니다. 별도 요약을 권장합니다.');
    if (data.excerpt.length > 150) add('warning', 'excerpt-length', 'excerpt가 150자를 넘습니다. 화면용 요약을 줄일지 검토하세요(검색엔진의 고정 제한은 아님).');
  }
  const imageMatches = [...content.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)];
  const media = imageMatches.map(match => match[2]);
  if (data.coverImage) media.push(data.coverImage);
  for (const src of new Set(media)) {
    if (typeof src !== 'string') { add('error', 'image-path', '이미지 경로는 문자열이어야 합니다.'); continue; }
    if (!src.startsWith('/') || src.startsWith('//')) continue;
    try {
      const target = path.resolve(root, 'public', `.${decodeURIComponent(src.split(/[?#]/)[0])}`);
      if (!target.startsWith(path.join(root, 'public') + path.sep) || !exists(target)) add('error', 'image-missing', `이미지/영상 파일을 찾을 수 없습니다: ${src}`);
    } catch { add('error', 'image-path', `이미지 경로를 확인하세요: ${src}`); }
  }
  if (imageMatches.some(match => !match[1].trim() || ['메인', '이미지', '사진', data.title].includes(match[1].trim()))) add('warning', 'image-alt', '제목 반복/일반적인 대체 텍스트를 사진별 설명으로 개선하세요.');
  for (const match of content.matchAll(/(?<!!)\[[^\]]*\]\((\/(reviews|articles|columns)\/[^\s)]+)\)/g)) {
    const target = match[1].split(/[?#]/)[0];
    try {
      const slug = decodeURIComponent(target.split('/').slice(2).join('/'));
      const dir = path.join(root, directories[match[2]]);
      const fullPath = path.resolve(dir, `${slug}.md`);
      if (!fullPath.startsWith(dir + path.sep) || !exists(fullPath)) add('error', 'link-missing', `관련 글을 찾을 수 없습니다: ${target}`);
    } catch { add('error', 'link-path', `관련 글 경로를 확인하세요: ${target}`); }
  }
  return issues;
}

export function auditContent() {
  const files = Object.entries(directories).flatMap(([type, directory]) => fs.readdirSync(path.join(root, directory))
    .filter(file => file.endsWith('.md') && !file.startsWith('_')).map(file => ({ type, file: `${directory}/${file}` })));
  const issues = files.flatMap(({ type, file }) => auditPost(file, type, fs.readFileSync(path.join(root, file), 'utf8')));
  return { posts: files.length, errors: issues.filter(i => i.level === 'error').length, warnings: issues.filter(i => i.level === 'warning').length, issues };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = auditContent();
  if (process.argv.includes('--json')) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`${report.posts}개 원고: 오류 ${report.errors}개, 개선 권고 ${report.warnings}개`);
    for (const level of ['error', 'warning']) {
      const list = report.issues.filter(i => i.level === level);
      for (const issue of list.slice(0, 20)) console.log(`[${level}] ${issue.file}: ${issue.message}`);
      if (list.length > 20) console.log(`... ${list.length - 20}개 추가 항목: --json으로 전체 확인`);
    }
  }
  if (report.errors) process.exitCode = 1;
}
