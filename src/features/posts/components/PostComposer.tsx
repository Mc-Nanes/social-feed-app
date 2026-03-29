import type { SyntheticEvent } from 'react'

interface PostComposerProps {
  title: string
  content: string
  isSubmitting: boolean
  errorMessage: string | null
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void
}

export function PostComposer({
  title,
  content,
  isSubmitting,
  errorMessage,
  onTitleChange,
  onContentChange,
  onSubmit,
}: PostComposerProps) {
  const isDisabled =
    title.trim().length === 0 || content.trim().length === 0 || isSubmitting

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="font-display text-[22px] font-semibold text-ink-950">
        What&apos;s on your mind?
      </h2>

      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-base font-normal text-ink-950">Title</span>
          <input
            className="h-[44px] w-full rounded-lg border border-slate-300 px-4 text-sm text-ink-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Hello world"
            value={title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-normal text-ink-950">Content</span>
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-ink-950 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
            onChange={(event) => onContentChange(event.target.value)}
            placeholder="Content here"
            value={content}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex justify-end">
          <button
            className={`h-8 min-w-[120px] rounded-lg px-6 text-sm font-bold text-white transition ${
              isDisabled
                ? 'bg-slate-300 text-slate-600'
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
            disabled={isDisabled}
            type="submit"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </section>
  )
}
