// Jest-only stand-in for @dicebear/core and @dicebear/collection.
// @dicebear v9 ships ESM-only code which Node 22 can require() at runtime,
// but jest's CommonJS module registry cannot. Avatar generation is not the
// subject of any test, so a static SVG is returned instead.
export const createAvatar = (
  _style: unknown,
  _options: Record<string, unknown>
): { toString: () => string, toDataUri: () => string } => ({
  toString: () => '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  toDataUri: () =>
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"></svg>'
});

export const thumbs = {};
