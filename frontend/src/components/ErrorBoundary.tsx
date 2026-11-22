import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FCFDFD] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#D1B89A] rounded-3xl p-8 shadow-lg text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-[#3B2A20] font-heading mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#7B5E4A] mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#7B5E4A] hover:bg-[#3B2A20] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
