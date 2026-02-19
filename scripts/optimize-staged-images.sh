#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

MAX_DIMENSION="${MAX_DIMENSION:-2400}"
JPEG_QUALITY="${JPEG_QUALITY:-78}"
PNG_QUALITY_MIN="${PNG_QUALITY_MIN:-65}"
PNG_QUALITY_MAX="${PNG_QUALITY_MAX:-85}"

STAGED_IMAGES=()
while IFS= read -r file; do
  [[ -n "$file" ]] || continue
  STAGED_IMAGES+=("$file")
done < <(
  git diff --cached --name-only --diff-filter=ACM \
    | rg '^public/posts/.*\.(jpg|jpeg|png|webp)$' || true
)

if [[ ${#STAGED_IMAGES[@]} -eq 0 ]]; then
  exit 0
fi

for file in "${STAGED_IMAGES[@]}"; do
  [[ -f "$file" ]] || continue

  ext="$(printf '%s' "${file##*.}" | tr '[:upper:]' '[:lower:]')"

  width="$(sips -g pixelWidth "$file" 2>/dev/null | awk '/pixelWidth/ {print $2}')"
  height="$(sips -g pixelHeight "$file" 2>/dev/null | awk '/pixelHeight/ {print $2}')"

  if [[ -n "${width:-}" && -n "${height:-}" ]]; then
    if (( width > MAX_DIMENSION || height > MAX_DIMENSION )); then
      sips -Z "$MAX_DIMENSION" "$file" >/dev/null
    fi
  fi

  if [[ "$ext" == "jpg" || "$ext" == "jpeg" ]]; then
    tmp_file="$(mktemp "/tmp/audiolife-img-XXXXXX.jpg")"
    sips -s format jpeg -s formatOptions "$JPEG_QUALITY" "$file" --out "$tmp_file" >/dev/null
    mv "$tmp_file" "$file"
  fi

  if [[ "$ext" == "png" ]]; then
    if command -v pngquant >/dev/null 2>&1; then
      tmp_file="$(mktemp "/tmp/audiolife-img-XXXXXX.png")"
      if pngquant --quality="${PNG_QUALITY_MIN}-${PNG_QUALITY_MAX}" --speed 1 --force --output "$tmp_file" -- "$file"; then
        mv "$tmp_file" "$file"
      else
        rm -f "$tmp_file"
      fi
    else
      # Fallback: keep PNG format and attempt lossless-ish rewrite for smaller output.
      tmp_file="$(mktemp "/tmp/audiolife-img-XXXXXX.png")"
      sips -s format png "$file" --out "$tmp_file" >/dev/null
      mv "$tmp_file" "$file"
    fi
  fi

  git add "$file"
done
