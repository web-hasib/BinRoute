"use client";

import { Component, ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Redux Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white shadow-lg border border-red-100 p-8 text-center rounded-none">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
              Application Error
            
            </h2>

<div>
  {JSON.stringify(this.state)}
</div>
            <p className="text-sm text-gray-500 mb-6 font-medium whitespace-normal break-words">
              {this.state.error?.message || "An unexpected error occurred in the application."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 bg-[#0062FF] text-white font-bold hover:bg-blue-700 transition-colors"
            >
              Reload Application
            </button>
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
