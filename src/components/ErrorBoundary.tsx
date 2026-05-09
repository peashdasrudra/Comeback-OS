import { Component } from "react";

class ErrorBoundary extends Component {
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020408] text-white flex items-center justify-center p-4">
          <div className="max-w-[430px] bg-red-900/20 border border-red-500/40 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-red-400 mb-2">Runtime Error</h2>
            <pre className="text-xs text-red-300 overflow-auto">{this.state.error?.toString()}</pre>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
