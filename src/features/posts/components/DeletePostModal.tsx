interface DeletePostModalProps {
  errorMessage: string | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeletePostModal({
  errorMessage,
  isDeleting,
  onCancel,
  onConfirm,
}: DeletePostModalProps) {
  return (
    <div className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 sm:px-6">
      <div className="animate-modal-in w-full max-w-[660px] rounded-2xl border border-[#999999] bg-white p-5 sm:p-8">
        <div className="space-y-8">
          <h2 className="font-display text-xl font-bold text-ink-950 sm:text-2xl">
            Are you sure you want to delete this item?
          </h2>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-4">
            <button
              className="h-8 min-w-[120px] rounded-lg border border-[#777777] bg-white px-6 text-sm font-bold text-slate-900 transition-colors duration-200 hover:bg-slate-50"
              disabled={isDeleting}
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-8 min-w-[120px] rounded-lg bg-danger-500 px-6 text-sm font-bold text-white transition-all duration-200 hover:brightness-95"
              disabled={isDeleting}
              onClick={onConfirm}
              type="button"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
