import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorPage } from "@/components/ErrorPage";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[GlobalErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorPage
          errorCode="VP-500"
          title="Application Error"
          message="The application encountered an unexpected error. Please reload to continue."
          error={this.state.error}
          recoverable
          recommendedAction="retry"
          onRetry={this.handleRetry}
          showHistory={false}
        />
      );
    }
    return <>{this.props.children}</>;
  }
}
