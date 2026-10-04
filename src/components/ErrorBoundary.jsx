import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-paper p-6">
          <div className="bg-panel border border-border rounded-lg p-8 max-w-md text-center">
            <h1 className="font-display font-semibold text-lg text-ink2 mb-2">Something went wrong</h1>
            <p className="text-sm text-muted mb-4">An unexpected error occurred. Your saved data is safe in this browser.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-4 py-2 text-sm rounded-md bg-violet hover:bg-violet-dark text-white font-medium"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
