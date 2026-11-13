import { parseSiteUrl } from './env';

describe('parseSiteUrl', () => {
  it('strips trailing slashes', () => {
    expect(parseSiteUrl('https://hallway.example/', true)).toBe('https://hallway.example');
    expect(parseSiteUrl('https://hallway.example/sub//', true)).toBe('https://hallway.example/sub');
  });

  it('falls back to localhost when unset', () => {
    expect(parseSiteUrl(undefined, false)).toBe('http://localhost:5173');
    expect(parseSiteUrl('   ', false)).toBe('http://localhost:5173');
  });

  it('warns but does not throw when unset in production', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(parseSiteUrl(undefined, true)).toBe('http://localhost:5173');
    expect(warn).toHaveBeenCalledOnce();
  });

  it('rejects relative and non-http URLs', () => {
    expect(() => parseSiteUrl('hallway.example', true)).toThrow(/absolute URL/);
    expect(() => parseSiteUrl('ftp://hallway.example', true)).toThrow(/http or https/);
  });
});
