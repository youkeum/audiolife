#!/usr/bin/env python3
"""
AudioLife Column QA Script

컬럼 마크다운 품질을 자동 점검하는 경량 스크립트.
외부 패키지 없이 동작하며, 100일 프로젝트 컬럼 포맷을 우선 지원한다.

Usage:
  python3 content/columns/content_qa.py
  python3 content/columns/content_qa.py content/columns/posts/hifi-headfi-100days-day10.md
  python3 content/columns/content_qa.py content/columns/posts
"""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple

RE_FRONTMATTER = re.compile(r"\A---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
RE_MD_IMAGE = re.compile(r"!\[(.*?)\]\(([^)]+)\)")
RE_MD_LINK = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
RE_HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
RE_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

REQUIRED_KEYS = ["title", "date", "excerpt", "category", "tags"]
DAY_REQUIRED_SECTIONS = [
    "오늘의 질문",
    "핵심 개념 3개",
    "공학적으로 이해하기",
    "청취 경험/인문학적 관점",
    "실전 예시",
    "앞으로의 학습 흐름",
    "마무리",
]
ASSET_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".pdf", ".md"}


def find_repo_root(start: Path) -> Path:
    for parent in [start.resolve(), *start.resolve().parents]:
        if (parent / ".git").exists():
            return parent
    return Path.cwd()


def strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and ((value[0] == '"' and value[-1] == '"') or (value[0] == "'" and value[-1] == "'")):
        return value[1:-1]
    return value


def parse_inline_list(value: str) -> List[str]:
    inner = value.strip()[1:-1].strip()
    if not inner:
        return []
    parts = []
    current = []
    quote: str | None = None
    for ch in inner:
        if ch in {'"', "'"}:
            if quote is None:
                quote = ch
            elif quote == ch:
                quote = None
            current.append(ch)
            continue
        if ch == "," and quote is None:
            parts.append("".join(current).strip())
            current = []
            continue
        current.append(ch)
    if current:
        parts.append("".join(current).strip())
    return [strip_quotes(p) for p in parts if p]


def parse_simple_frontmatter(text: str) -> Dict[str, object]:
    data: Dict[str, object] = {}
    current_key: str | None = None

    for raw in text.splitlines():
        line = raw.rstrip()
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        if stripped.startswith("- ") and current_key:
            value = strip_quotes(stripped[2:].strip())
            existing = data.get(current_key)
            if not isinstance(existing, list):
                existing = []
                data[current_key] = existing
            existing.append(value)
            continue

        current_key = None
        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()

        if value == "":
            data[key] = []
            current_key = key
            continue

        if value.startswith("[") and value.endswith("]"):
            data[key] = parse_inline_list(value)
        else:
            data[key] = strip_quotes(value)

    return data


def parse_frontmatter(content: str) -> Tuple[Dict[str, object] | None, str | None, str]:
    match = RE_FRONTMATTER.match(content)
    if not match:
        return None, "Missing front matter block", content

    fm_text = match.group(1)
    body = content[match.end() :]
    try:
        data = parse_simple_frontmatter(fm_text)
    except Exception as exc:
        return None, f"Front matter parse error: {exc}", body

    return data, None, body


def is_day_column(path: Path) -> bool:
    return bool(re.match(r"hifi-headfi-100days-day\d+\.md$", path.name))


def check_frontmatter(data: Dict[str, object] | None, path: Path) -> List[str]:
    issues: List[str] = []
    if data is None:
        return issues

    missing = [key for key in REQUIRED_KEYS if key not in data]
    if missing:
        issues.append(f"Missing required front matter keys: {', '.join(missing)}")

    date_value = str(data.get("date", "")).strip()
    if date_value:
        if not RE_DATE.match(date_value):
            issues.append(f"Invalid date format: '{date_value}' (expected YYYY-MM-DD)")
        else:
            try:
                datetime.strptime(date_value, "%Y-%m-%d")
            except ValueError:
                issues.append(f"Invalid date value: '{date_value}'")

    tags = data.get("tags")
    if tags is not None and not isinstance(tags, list):
        issues.append("Front matter 'tags' should be a YAML list")

    if path.name != path.name.strip() or " " in path.name:
        issues.append("Filename should not contain leading/trailing spaces or blanks")

    return issues


def iter_headings(content: str) -> List[Tuple[int, str, int]]:
    headings: List[Tuple[int, str, int]] = []
    in_code = False

    for idx, raw in enumerate(content.splitlines(), start=1):
        line = raw.rstrip("\n")
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        match = RE_HEADING.match(line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            headings.append((level, title, idx))

    return headings


def check_headings(content: str, path: Path) -> List[str]:
    issues: List[str] = []
    headings = iter_headings(content)

    for i in range(1, len(headings)):
        prev_level, _, _ = headings[i - 1]
        level, title, line = headings[i]
        if level > prev_level + 1:
            issues.append(f"Heading level jump near line {line}: H{prev_level} -> H{level} ({title})")

    if is_day_column(path):
        h2_titles = [title for level, title, _ in headings if level == 2]
        missing_sections = [section for section in DAY_REQUIRED_SECTIONS if section not in h2_titles]
        if missing_sections:
            issues.append(f"Missing required Day sections: {', '.join(missing_sections)}")

        present_order = [section for section in DAY_REQUIRED_SECTIONS if section in h2_titles]
        actual_order = [title for title in h2_titles if title in DAY_REQUIRED_SECTIONS]
        if present_order != actual_order:
            issues.append("Day section order differs from project standard")

    return issues


def check_images(content: str, repo_root: Path, path: Path) -> List[str]:
    issues: List[str] = []
    images = RE_MD_IMAGE.findall(content)

    if is_day_column(path) and len(images) < 4:
        issues.append("Day column should include at least 4 images (cover 1 + insert 3)")

    for alt, url in images:
        if not alt.strip():
            issues.append(f"Image missing alt text: {url}")

        if url.startswith("/"):
            candidate = repo_root / "public" / url.lstrip("/")
            if not candidate.exists():
                issues.append(f"Image file not found in public/: {url}")
        elif not (path.parent / url).resolve().exists():
            issues.append(f"Relative image file not found: {url}")

    return issues


def check_links(content: str, repo_root: Path, path: Path) -> List[str]:
    issues: List[str] = []

    for url in RE_MD_LINK.findall(content):
        link = url.strip()
        if not link:
            continue
        if link.startswith(("http://", "https://", "mailto:", "tel:", "#")):
            continue

        if link.startswith("/"):
            ext = Path(link).suffix.lower()
            if ext in ASSET_EXTENSIONS:
                candidate = repo_root / "public" / link.lstrip("/")
                if not candidate.exists():
                    issues.append(f"Broken root asset link: {link}")
            continue

        rel = link.split("#")[0].split("?")[0]
        if not rel:
            continue
        candidate = (path.parent / rel).resolve()
        if not candidate.exists():
            issues.append(f"Broken relative link: {link}")

    return issues


def check_paragraphs(content: str) -> List[str]:
    issues: List[str] = []
    paragraphs = content.split("\n\n")
    in_code = False

    for para in paragraphs:
        stripped = para.strip()
        if not stripped:
            continue

        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue

        if stripped.startswith(("#", "- ", "* ", "1.", "2.", "3.", "4.", "5.")):
            continue

        words = stripped.split()
        if len(words) > 140 or len(stripped) > 900:
            issues.append("Long paragraph detected; consider splitting for readability")

    return issues


def analyze_file(path: Path, repo_root: Path) -> List[str]:
    try:
        content = path.read_text(encoding="utf-8")
    except Exception as exc:
        return [f"Read error: {exc}"]

    data, fm_error, body = parse_frontmatter(content)
    issues: List[str] = []

    if fm_error:
        issues.append(fm_error)

    issues.extend(check_frontmatter(data, path))
    issues.extend(check_headings(body, path))
    issues.extend(check_images(body, repo_root, path))
    issues.extend(check_links(body, repo_root, path))
    issues.extend(check_paragraphs(body))

    return issues


def collect_markdown_files(targets: List[Path]) -> List[Path]:
    files: List[Path] = []
    for target in targets:
        if target.is_file() and target.suffix.lower() == ".md":
            files.append(target)
        elif target.is_dir():
            files.extend(sorted(target.rglob("*.md")))
    return files


def parse_args(argv: List[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AudioLife column markdown QA")
    parser.add_argument(
        "targets",
        nargs="*",
        default=["content/columns/posts"],
        help="검사할 md 파일/폴더 경로 (기본: content/columns/posts)",
    )
    return parser.parse_args(argv)


def main(argv: List[str]) -> int:
    args = parse_args(argv)
    targets = [Path(t) for t in args.targets]
    repo_root = find_repo_root(Path(__file__))

    files = collect_markdown_files(targets)
    if not files:
        print("No markdown files found.")
        return 1

    fail_count = 0
    checked = 0

    for md_file in files:
        checked += 1
        issues = analyze_file(md_file, repo_root)
        if issues:
            fail_count += 1
            print(f"\n[FAIL] {md_file}")
            for issue in issues:
                print(f"  - {issue}")
        else:
            print(f"[PASS] {md_file}")

    print(f"\nChecked: {checked} file(s), Failed: {fail_count}")
    return 1 if fail_count else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
