'use client';

import { useEffect } from 'react';

const WELCOME_THEME = '#5A1010';
/** Matches .app-cream-shell — true `transparent` meta is ignored on many builds; cream matches the page so chrome doesn’t look like a separate strip */
const POST_WELCOME_THEME = '#FFFAF0';

/**
 * iOS Safari (especially 26+): toolbar tint often ignores `theme-color` and samples
 * `position:fixed` elements near the top/bottom edge instead. We render thin strips + update meta.
 * @see https://jahir.dev/blog/safari-toolbar
 */
export default function SafariThemeColor({ stage }: { stage: number }) {
  const stripBg = stage === 0 ? WELCOME_THEME : POST_WELCOME_THEME;

  useEffect(() => {
    const value = stage >= 1 ? POST_WELCOME_THEME : WELCOME_THEME;
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
      el.setAttribute('content', value);
    });
  }, [stage]);

  return (
    <>
      {/* Safari 26+ samples these for status / URL bar tint — must stay in DOM with solid bg (not opacity:0) */}
      <div aria-hidden className="safari-ios-tint-strip safari-ios-tint-strip--top" style={{ backgroundColor: stripBg }} />
      <div aria-hidden className="safari-ios-tint-strip safari-ios-tint-strip--bottom" style={{ backgroundColor: stripBg }} />
    </>
  );
}
