import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

export function SignupModal() {
  const [username, setUsername] = useState('')
  const {
    clearError,
    errorMessage,
    isAuthenticating,
    isGoogleAvailable,
    loginWithGoogle,
    loginWithUsername,
  } = useAuth()

  const normalizedUsername = username.trim()
  const isSubmitDisabled = normalizedUsername.length === 0 || isAuthenticating

  function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    loginWithUsername(normalizedUsername)
  }

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value)

    if (errorMessage) {
      clearError()
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_28%)]" />
      <div className="absolute left-[8%] top-24 h-32 w-32 rounded-full bg-brand-100 blur-3xl" />
      <div className="absolute bottom-20 right-[10%] h-36 w-36 rounded-full bg-sky-100 blur-3xl" />

      <section
        aria-labelledby="signup-title"
        aria-modal="true"
        className="relative w-full max-w-[560px] rounded-[32px] border border-white/70 bg-white/88 p-7 shadow-soft backdrop-blur-xl sm:p-10"
        role="dialog"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.42em] text-brand-500">
              CodeLeap Social
            </p>
            <div className="space-y-3">
              <h1
                className="max-w-md font-display text-4xl leading-none text-ink-950 sm:text-5xl"
                id="signup-title"
              >
                Start your post stream with one name.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                Pick a username to enter the feed. If Firebase credentials are
                configured, Google sign-in appears automatically as an optional
                shortcut.
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-ink-900">
                Username
              </span>
              <input
                autoComplete="nickname"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-ink-950 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                onChange={handleUsernameChange}
                placeholder="Type your username"
                value={username}
              />
            </label>

            {errorMessage ? (
              <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                className={`h-14 min-w-[168px] rounded-2xl px-6 text-sm font-bold uppercase tracking-[0.2em] transition ${
                  isSubmitDisabled
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-ink-950 text-white hover:-translate-y-0.5 hover:bg-ink-900'
                }`}
                disabled={isSubmitDisabled}
                type="submit"
              >
                {isAuthenticating ? 'PLEASE WAIT' : 'ENTER'}
              </button>

              {isGoogleAvailable ? (
                <button
                  className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  disabled={isAuthenticating}
                  onClick={() => void loginWithGoogle()}
                  type="button"
                >
                  Continue with Google
                </button>
              ) : (
                <p className="max-w-xs text-xs leading-5 text-slate-500">
                  Google sign-in stays hidden until the Firebase environment
                  variables are filled in.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
