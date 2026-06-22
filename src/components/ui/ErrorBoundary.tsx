import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside dashboard:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-rose-500/10 bg-rose-500/[0.02] p-8 text-center backdrop-blur-sm">
          <div className="mb-4 rounded-full bg-rose-500/10 p-3 text-rose-500 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
            Something went wrong
          </h3>
          <p className="mb-6 max-w-md text-xs font-medium text-slate-500 dark:text-slate-400">
            {this.state.error?.message || "An unexpected error occurred while loading this section."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white dark:text-slate-100 transition shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
