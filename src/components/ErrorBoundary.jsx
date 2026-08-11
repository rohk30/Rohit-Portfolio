import React from 'react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';

/**
 * ErrorBoundary Component
 * 
 * A React Error Boundary that catches JavaScript errors anywhere in the child
 * component tree, logs them to the console, and displays a friendly fallback UI.
 * 
 * Uses class component syntax as Error Boundaries require lifecycle methods
 * (componentDidCatch, getDerivedStateFromError) not available in function components.
 * 
 * @validates Requirements 10.1
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Update state so the next render shows the fallback UI.
   * Called during the "render" phase, so side-effects are not permitted here.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log error information for debugging purposes.
   * Called during the "commit" phase, so side-effects are permitted.
   */
  componentDidCatch(error, errorInfo) {
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo?.componentStack);
    
    // Store error info in state for potential display
    this.setState({ errorInfo });
  }

  /**
   * Handle refresh button click - reload the page
   */
  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
          <GlassCard className="max-w-md w-full p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-semibold text-white mb-3">
              Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            {/* Refresh Button */}
            <Button
              variant="primary"
              size="md"
              onClick={this.handleRefresh}
              aria-label="Refresh the page"
            >
              Refresh Page
            </Button>
          </GlassCard>
        </div>
      );
    }

    // Render children normally when no error
    return this.props.children;
  }
}

export default ErrorBoundary;
