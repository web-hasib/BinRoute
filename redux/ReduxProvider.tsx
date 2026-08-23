"use client";

import { Component, ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

import { AlertTriangle, RotateCcw, Home, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, showDetails: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Redux Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] font-sans text-slate-900">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm text-center">
            {/* Alert Badge */}
            <div className="size-14 mx-auto rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0060AF] mb-5">
              <AlertTriangle className="size-7 text-[#0060AF]" />
            </div>

            {/* Header */}
            <span className="inline-block text-xs font-bold uppercase text-[#0060AF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 mb-2">
              System Notice
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
              Application Error
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              We encountered an unexpected issue while rendering this view. You can reload the application or return to the main dashboard.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-6 text-xs sm:text-sm font-bold gap-2 rounded-lg shadow-sm"
              >
                <RotateCcw className="size-4" />
                <span>Reload Application</span>
              </Button>

              <a href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-xs sm:text-sm font-bold gap-2 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Home className="size-4" />
                  <span>Back to Home</span>
                </Button>
              </a>
            </div>

            {/* Quick Dispatch Contact Banner */}
            <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-[#0060AF]" />
                <span className="font-semibold text-slate-800">Dispatch Support:</span>
              </div>
              <a
                href="tel:7746221884"
                className="font-bold text-[#0060AF] hover:underline"
              >
                (774) 622-1884
              </a>
            </div>

            {/* Expandable Technical Details for Developers/Debugging */}
            {this.state.error && (
              <div className="pt-2 border-t border-slate-100 text-left">
                <button
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  type="button"
                  className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 font-semibold py-1 cursor-pointer"
                >
                  <span>Technical details</span>
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                      this.state.showDetails ? "rotate-180 text-[#0060AF]" : ""
                    }`}
                  />
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto max-h-36 border border-slate-800 space-y-1">
                    <p className="text-rose-400 font-bold">
                      {this.state.error.message || "An unexpected error occurred."}
                    </p>
                    {this.state.error.stack && (
                      <p className="text-slate-500 text-[10px] whitespace-pre-wrap line-clamp-4">
                        {this.state.error.stack}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate
          //   loading={
          //     <div className="flex items-center justify-center min-h-screen">
          //       Loading...
          //     </div>
          //   }
          persistor={persistor}
        >
          {children}
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default ReduxProvider;
