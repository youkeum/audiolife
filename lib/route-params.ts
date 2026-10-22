// Dynamic route parameters can arrive percent-encoded; decode only at the route boundary.
export function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value).normalize("NFC");
  } catch {
    return value.normalize("NFC");
  }
}
