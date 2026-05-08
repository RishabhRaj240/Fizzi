import React from 'react';

/**
 * Error boundary that catches silent Three.js / WebGL failures that would
 * otherwise produce a blank render on Vercel.  Falls back to nothing (the
 * section still shows its text content) and logs details for debugging.
 */
export default class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Visible in Vercel function logs — helps diagnose production issues
    console.error('[CanvasErrorBoundary] 3D render failed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — the section's HTML content still shows
      return null;
    }
    return this.props.children;
  }
}
