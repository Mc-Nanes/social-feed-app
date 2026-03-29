import { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function FeedShell() {
  const { logout, session } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!session) {
    return null
  }

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const sessionLabel =
    session.mode === 'google' ? 'Google session active' : 'Username session'

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="overflow-hidden rounded-[30px] border border-white/70 bg-white/82 px-5 py-5 shadow-soft backdrop-blur-xl sm:px-8 sm:py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-brand-700">
                  Phase 1 ready
                </span>
                <span className="text-sm text-slate-500">{sessionLabel}</span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-2xl font-display text-4xl leading-none text-ink-950 sm:text-5xl">
                  Your timeline shell is ready for the CodeLeap CRUD flow.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  You are inside the authenticated area with a persistent
                  session, React Query bootstrapped, and the post workspace
                  prepared for the next phase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-[26px] border border-slate-200 bg-slate-50/80 px-3 py-3">
              {session.photoUrl ? (
                <img
                  alt={session.username}
                  className="h-12 w-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  src={session.photoUrl}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-950 text-sm font-bold text-white">
                  {getInitials(session.username)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">
                  {session.displayName ?? session.username}
                </p>
                <p className="truncate text-xs text-slate-500">
                  @{session.username}
                </p>
              </div>

              <button
                className="ml-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink-900 transition hover:border-slate-300 hover:bg-slate-100"
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
                type="button"
              >
                {isLoggingOut ? 'Leaving...' : 'Logout'}
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.9fr)]">
          <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-400">
                  Composer
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink-950">
                  Create a new post
                </h2>
              </div>
              <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                Next phase
              </span>
            </div>

            <form className="mt-8 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-ink-900">Title</span>
                <input
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-ink-950 outline-none"
                  disabled
                  placeholder="Post title will be activated in the CRUD phase"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-ink-900">
                  Content
                </span>
                <textarea
                  className="min-h-40 w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-ink-950 outline-none"
                  disabled
                  placeholder="The content composer is staged and ready for the next step."
                />
              </label>

              <div className="flex justify-end">
                <button
                  className="h-12 rounded-2xl bg-slate-200 px-6 text-sm font-bold uppercase tracking-[0.16em] text-slate-500"
                  disabled
                  type="button"
                >
                  Create
                </button>
              </div>
            </form>
          </div>

          <aside className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-400">
              Session
            </p>
            <div className="mt-4 space-y-5">
              <div>
                <h2 className="font-display text-3xl text-ink-950">
                  Logged in and persistent
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reload the page and this gate stays open thanks to the saved
                  session in local storage.
                </p>
              </div>

              <dl className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt>Mode</dt>
                  <dd className="font-semibold text-ink-950">{session.mode}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <dt>Username</dt>
                  <dd className="font-semibold text-ink-950">
                    {session.username}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>Google ready</dt>
                  <dd className="font-semibold text-ink-950">
                    {session.mode === 'google' ? 'Connected' : 'Optional'}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-400">
                Feed
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink-950">
                Timeline preview
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              The authenticated shell is in place. The next iteration can plug
              the real post composer and the API-backed feed into this layout.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {[1, 2].map((item) => (
              <article
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
                key={item}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="h-4 w-24 rounded-full bg-slate-200" />
                    <div className="mt-3 h-3 w-40 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-9 w-24 rounded-full bg-slate-200" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-3 w-full rounded-full bg-slate-200" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-200" />
                  <div className="h-3 w-8/12 rounded-full bg-slate-200" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
