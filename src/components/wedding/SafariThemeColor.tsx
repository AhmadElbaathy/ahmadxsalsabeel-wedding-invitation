'use client';

import { useEffect } from 'react';

const WELCOME_THEME = '#5A1010';
/** After “tap to open” Safari should stop tinting URL/toolbars — must be set in JS (static meta can’t follow stage). */
const POST_WELCOME_THEME = 'transparent';

/**
 * Updates all theme-color meta tags (Next may emit several with media queries).
 * Welcome: maroon matches the envelope screen. After tap: transparent for Safari chrome on iOS.
 */
export default function SafariThemeColor({ stage }: { stage: number }) {
  useEffect(() => {
    const value = stage >= 1 ? POST_WELCOME_THEME : WELCOME_THEME;
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => {
      el.setAttribute('content', value);
    });
  }, [stage]);

  return null;
}
