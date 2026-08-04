import { Component, type ReactNode } from "react";
import { logger } from "@/lib/logger";
import { ErrorPage } from "@/components/ErrorPage";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    logger.error(error.message, { stack: error.stack, componentStack: info.componentStack });
  }
  reset = () => this.setState({ error: null });
  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <ErrorPage
          errorCode="VP-500"
          title="Something Went Wrong"
          message="A component encountered an error. You can try again."
          error={this.state.error}
          recoverable
          recommendedAction="retry"
          onRetry={this.reset}
          showHistory={false}
        />
      );
    }
    return this.props.children;
  }
}
