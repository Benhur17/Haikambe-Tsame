import React from "react";
import { HiExclamationTriangle, HiArrowPath } from "react-icons/hi2";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
          <div className="card p-10 max-w-lg w-full text-center space-y-6 scale-in">
            <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
              <HiExclamationTriangle className="w-10 h-10 text-[var(--color-error)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Something went wrong
              </h2>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-red-50 rounded-xl p-4 text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                <HiArrowPath className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="btn btn-outline"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
