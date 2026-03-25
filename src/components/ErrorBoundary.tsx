import * as React from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
  componentStack?: string;
};

/**
 * Captures runtime crashes and logs a React component stack to the console.
 * This is intended for debugging persistent blank-screen errors.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // This will show up in Lovable's console logs snapshot.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Caught error:", error);
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Component stack:", info.componentStack);

    this.setState({ componentStack: info.componentStack });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md bg-muted p-2">
              <AlertTriangle className="h-5 w-5 text-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-base font-semibold">Something crashed while rendering</h1>
              <p className="text-sm text-muted-foreground">
                Open the browser console to see a detailed component stack trace.
              </p>
              <p className="text-xs text-muted-foreground">
                If you share the <code>[ErrorBoundary] Component stack</code> line, I can pinpoint the exact component.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
