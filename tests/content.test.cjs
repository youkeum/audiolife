const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const valid = `---
title: "제품 리뷰"
date: "2026-10-14"
updated: "2026-10-19"
excerpt: "디자인과 청음 인상을 정리했습니다."
category: "DAP"
tags: ["브랜드", "제품"]
reviewItemType: "Product"
reviewItemName: "브랜드 제품"
---
## 사용기
직접 들은 내용을 적습니다.
![제품 전면](/posts/reviews/test/1.jpg)
[관련 리뷰](/reviews/pd20)
`;
test('content validation accepts a complete draft', async () => {
  const { auditPost } = await import('../scripts/check-content.mjs');
  assert.deepEqual(auditPost('test.md', 'reviews', valid, () => true), []);
});
test('invalid dates, missing media and missing internal links are errors', async () => {
  const { auditPost } = await import('../scripts/check-content.mjs');
  const issues = auditPost('test.md', 'reviews', valid.replace('2026-10-14', '2026-02-30'), () => false);
  for (const code of ['date', 'image-missing', 'link-missing']) assert.ok(issues.some(i => i.code === code && i.level === 'error'));
});
test('malformed metadata produces diagnostics rather than a crash', async () => {
  const { auditPost } = await import('../scripts/check-content.mjs');
  const bad = valid.replace('"브랜드 제품"', '42').replace('["브랜드", "제품"]', '42').replace('2026-10-19', '2025-01-01');
  const codes = auditPost('test.md', 'reviews', bad, () => true).map(i => i.code);
  for (const code of ['tags', 'updated', 'review-name']) assert.ok(codes.includes(code));
  assert.equal(auditPost('bad.md', 'articles', '---\ntitle: [\n---\n')[0].code, 'frontmatter');
});
test('representative manuscripts satisfy the new authoring checks', async () => {
  const { auditPost } = await import('../scripts/check-content.mjs');
  for (const file of ['content/reviews/naver-224441108934.md', 'content/reviews/naver-224437065078.md', 'content/articles/naver-224443570659.md']) {
    const raw = fs.readFileSync(file, 'utf8');
    assert.deepEqual(auditPost(file, file.includes('/reviews/') ? 'reviews' : 'articles', raw), []);
  }
});
