import { Component } from 'react';

/**
 * CricketErrorBoundary
 *
 * Wraps cricket-themed components for fault isolation. If any child
 * component throws during rendering, the boundary renders its fallback
 * (defaults to null / invisible) so that the rest of the page — including
 * the Navbar and personal info — remains intact.
 *
 * @validates Requirements 9.4, 7.5
 */
class CricketErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.warn('[CricketErrorBoundary] Component failed:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback prop or null (invisible)
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default CricketErrorBoundary;
