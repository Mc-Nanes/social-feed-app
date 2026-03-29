import type { SyntheticEvent } from 'react'

interface EditPostModalProps {
  content: string
  errorMessage: string | null
  isSaving: boolean
  title: string
  onCancel: () => void
  onContentChange: (value: string) => void
  onSave: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void
  onTitleChange: (value: string) => void
}

export function EditPostModal({
  content,
  errorMessage,
  isSaving,
  title,
  onCancel,
  onContentChange,
  onSave,
  onTitleChange,
}: EditPostModalProps) {
  const isDisabled =
    title.trim().length === 0 || content.trim().length === 0 || isSaving

  return (
    <div className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 sm:px-6">
      <div className="animate-modal-in w-full max-w-[660px] rounded-2xl border border-black bg-white p-5 sm:p-8">
        <form className="space-y-6" onSubmit={onSave}>
          <h2 className="font-display text-xl font-bold text-ink-950 sm:text-2xl">
            Edit item
          </h2>

          <label className="block space-y-2">
            <span className="text-base font-normal text-ink-950">Title</span>
            <input
              className="h-[44px] w-full rounded-lg border border-slate-300 px-4 text-sm text-ink-950 outline-none transition-colors duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
              onChange={(event) => onTitleChange(event.target.value)}
              value={title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-base font-normal text-ink-950">Content</span>
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-ink-950 outline-none transition-colors duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
              onChange={(event) => onContentChange(event.target.value)}
              value={content}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-4">
            <button
              className="h-8 min-w-[120px] rounded-lg border border-slate-900 bg-white px-6 text-sm font-bold text-slate-900 transition-colors duration-200 hover:bg-slate-50"
              disabled={isSaving}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className={`h-8 min-w-[120px] rounded-lg px-6 text-sm font-bold text-white transition-all duration-200 ${
                isDisabled
                  ? 'bg-slate-300 text-slate-600'
                  : 'bg-success-500 hover:brightness-95'
              }`}
              disabled={isDisabled}
              type="submit"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
