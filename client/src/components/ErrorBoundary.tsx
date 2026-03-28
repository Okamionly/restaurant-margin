import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Une erreur est survenue</h2>
            <p className="text-slate-400 mb-6 text-sm">
              {this.state.error?.message || 'Erreur inattendue. Veuillez rafraîchir la page.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
