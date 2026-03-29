import type { Post } from '../types/post'
import { formatRelativeTime } from '../lib/formatRelativeTime'

interface PostCardProps {
  post: Post
  currentUsername: string
  onDelete: (post: Post) => void
  onEdit: (post: Post) => void
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 6h18M8 6V4h8v2m-8 0 1 13h6l1-13m-6 3v7m4-7v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 20h4l10.5-10.5a2.121 2.121 0 1 0-3-3L5 17v3Zm9.5-12.5 3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

export function PostCard({
  post,
  currentUsername,
  onDelete,
  onEdit,
}: PostCardProps) {
  const canManagePost = post.username === currentUsername

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <header className="flex items-start justify-between gap-4 bg-primary-500 px-6 py-6 text-white">
        <h3 className="max-w-[85%] text-[22px] font-bold leading-tight">
          {post.title}
        </h3>

        {canManagePost ? (
          <div className="flex items-center gap-4">
            <button
              aria-label="Delete post"
              className="text-white/90 transition hover:text-white"
              onClick={() => onDelete(post)}
              type="button"
            >
              <TrashIcon />
            </button>
            <button
              aria-label="Edit post"
              className="text-white/90 transition hover:text-white"
              onClick={() => onEdit(post)}
              type="button"
            >
              <EditIcon />
            </button>
          </div>
        ) : null}
      </header>

      <div className="space-y-4 px-6 py-6">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-bold text-slate-700">@{post.username}</p>
          <time className="text-slate-400" dateTime={post.created_datetime}>
            {formatRelativeTime(post.created_datetime)}
          </time>
        </div>

        <p className="whitespace-pre-wrap text-lg leading-7 text-slate-700">
          {post.content}
        </p>
      </div>
    </article>
  )
}
