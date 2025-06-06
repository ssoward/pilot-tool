/**
 * Utility to handle scrollbar width calculations to prevent layout shifts
 */

/**
 * Calculates and sets the scrollbar width as a CSS variable
 * This prevents layout shifts when navigating between pages with and without scrollbars
 */
export function calculateScrollbarWidth(): void {
  // Create a div with a scrollbar
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.msOverflowStyle = 'scrollbar'; // needed for IE and Edge
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  // Create an inner div
  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  // Calculate the width difference
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Clean up
  outer.parentNode?.removeChild(outer);

  // Set the scrollbar width as a CSS variable
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}
