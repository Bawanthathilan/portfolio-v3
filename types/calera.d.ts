import type React from 'react';

// <calera-widget> is a custom element defined by https://www.calera.app/widget.js
// (used in the hero), so JSX needs to know it exists.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'calera-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { 'data-id': string };
    }
  }
}
