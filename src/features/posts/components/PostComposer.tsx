import {
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react'
import { MOCK_MENTION_USERS } from '../types/fakeInteractions'

interface PostComposerProps {
  attachmentPreview: string | null
  title: string
  content: string
  isSubmitting: boolean
  errorMessage: string | null
  onAttachmentChange: (value: string | null) => void
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void
}

function AttachmentIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.44 11.05 12.25 20.24a6 6 0 1 1-8.49-8.48l9.2-9.2a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.83l8.49-8.48"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function PostComposer({
  attachmentPreview,
  title,
  content,
  isSubmitting,
  errorMessage,
  onAttachmentChange,
  onTitleChange,
  onContentChange,
  onSubmit,
}: PostComposerProps) {
  const [caretPosition, setCaretPosition] = useState(content.length)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isDisabled =
    title.trim().length === 0 || content.trim().length === 0 || isSubmitting
  const textBeforeCaret = content.slice(0, caretPosition)
  const mentionMatch = textBeforeCaret.match(/(?:^|\s)@([^\s@]*)$/)
  const mentionQuery = mentionMatch?.[1]?.toLowerCase() ?? ''
  const mentionSuggestions = mentionMatch
    ? MOCK_MENTION_USERS.filter((username) =>
        username.toLowerCase().startsWith(mentionQuery),
      )
    : []

  async function handleAttachmentInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const nextAttachment = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
          return
        }

        reject(new Error('Unable to read the selected file.'))
      }

      reader.onerror = () => {
        reject(new Error('Unable to read the selected file.'))
      }

      reader.readAsDataURL(file)
    })

    onAttachmentChange(nextAttachment)
    event.target.value = ''
  }

  function handleMentionSelect(username: string) {
    if (!mentionMatch) {
      return
    }

    const mentionStartIndex = textBeforeCaret.lastIndexOf('@')
    const beforeMention = content.slice(0, mentionStartIndex)
    const afterMention = content.slice(caretPosition)
    const nextValue = `${beforeMention}@${username} ${afterMention}`

    onContentChange(nextValue)
    setCaretPosition(mentionStartIndex + username.length + 2)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="font-display text-[22px] font-semibold text-ink-950">
        What&apos;s on your mind?
      </h2>

      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        <label className="block space-y-2">
          <span className="text-base font-normal text-ink-950">Title</span>
          <input
            className="h-[44px] w-full rounded-lg border border-slate-300 px-4 text-sm text-ink-950 outline-none transition-colors duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Hello world"
            value={title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-base font-normal text-ink-950">Content</span>
          <div className="relative">
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 text-ink-950 outline-none transition-colors duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
              onChange={(event) => {
                onContentChange(event.target.value)
                setCaretPosition(event.target.selectionStart ?? event.target.value.length)
              }}
              onClick={(event) =>
                setCaretPosition(event.currentTarget.selectionStart ?? content.length)
              }
              onKeyUp={(event) =>
                setCaretPosition(event.currentTarget.selectionStart ?? content.length)
              }
              placeholder="Content here"
              value={content}
            />

            {mentionSuggestions.length > 0 ? (
              <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-full max-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-soft">
                {mentionSuggestions.map((username) => (
                  <button
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-100"
                    key={username}
                    onClick={() => handleMentionSelect(username)}
                    type="button"
                  >
                    @{username}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </label>

        {attachmentPreview ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">Attachment preview</p>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img
                alt="Selected attachment preview"
                className="max-h-[260px] w-full object-cover"
                src={attachmentPreview}
              />
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <input
              accept="image/*"
              className="hidden"
              onChange={handleAttachmentInputChange}
              ref={fileInputRef}
              type="file"
            />
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <AttachmentIcon />
              Attach image
            </button>

            {attachmentPreview ? (
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100"
                onClick={() => onAttachmentChange(null)}
                type="button"
              >
                Remove
              </button>
            ) : null}
          </div>

          <button
            className={`h-8 min-w-[120px] rounded-lg px-6 text-sm font-bold text-white transition-all duration-200 ${
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
