import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.6 12.227c0-.818-.073-1.604-.209-2.364H12v4.473h5.382a4.6 4.6 0 0 1-1.996 3.018v2.504h3.236c1.893-1.744 2.978-4.318 2.978-7.63Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.618-2.142l-3.236-2.504c-.895.6-2.04.955-3.382.955-2.6 0-4.8-1.756-5.59-4.118H3.065v2.582A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.41 14.19A5.99 5.99 0 0 1 6.095 12c0-.76.132-1.495.314-2.19V7.227H3.065A10 10 0 0 0 2 12c0 1.61.386 3.136 1.065 4.773L6.41 14.19Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.69c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.96 2.708 14.695 2 12 2A9.997 9.997 0 0 0 3.065 7.227L6.41 9.81C7.2 7.446 9.4 5.69 12 5.69Z"
        fill="#EA4335"
      />
    </svg>
  )
}

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
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-surface-gray)] px-4 py-8">
      <section
        aria-labelledby="signup-title"
        aria-modal="true"
        className="w-full max-w-[500px] rounded-2xl bg-white px-4 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.08)] sm:px-5"
        role="dialog"
      >
        <div className="space-y-4">
          <h1
            className="font-display text-[22px] font-bold leading-tight text-black"
            id="signup-title"
          >
            Welcome to CodeLeap network!
          </h1>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-xs font-normal text-black">
                Please enter your username
              </span>
              <input
                autoComplete="nickname"
                className="h-8 w-full rounded border border-[#777777] bg-white px-3 text-xs text-black outline-none transition-colors duration-200 placeholder:text-[#cccccc] focus:border-primary-500"
                onChange={handleUsernameChange}
                placeholder="John doe"
                value={username}
              />
            </label>

            {errorMessage ? (
              <p className="rounded border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {errorMessage}
              </p>
            ) : null}

            {isGoogleAvailable ? (
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-normal text-black">Login with</p>
                  <button
                    className="inline-flex h-[42px] items-center gap-3 rounded-xl border border-primary-500 bg-white px-4 text-[15px] font-medium text-[#202124] transition-colors duration-200 hover:border-primary-600 hover:bg-[#fafafa]"
                    disabled={isAuthenticating}
                    onClick={() => void loginWithGoogle()}
                    type="button"
                  >
                    <GoogleIcon />
                    <span>Google</span>
                  </button>
                </div>

                <button
                  className={`h-8 min-w-[111px] shrink-0 rounded-lg px-4 text-sm font-bold transition-all duration-200 ${
                    isSubmitDisabled
                      ? 'bg-[var(--page-surface-gray)] text-white'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  {isAuthenticating ? 'LOADING' : 'ENTER'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end">
                <button
                  className={`h-8 min-w-[111px] rounded-lg px-4 text-sm font-bold transition-all duration-200 ${
                    isSubmitDisabled
                      ? 'bg-[var(--page-surface-gray)] text-white'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                  disabled={isSubmitDisabled}
                  type="submit"
                >
                  {isAuthenticating ? 'LOADING' : 'ENTER'}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
