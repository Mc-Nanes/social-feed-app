import { useState, type SyntheticEvent } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteForever } from 'react-icons/md'
import { useFakeInteractions } from '../hooks/useFakeInteractions'
import type { Post } from '../types/post'
import { formatRelativeTime } from '../lib/formatRelativeTime'

interface PostCardProps {
  post: Post
  currentUsername: string
  onDelete: (post: Post) => void
  onEdit: (post: Post) => void
}

function HeartIcon({ isLiked }: { isLiked: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill={isLiked ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
    >
      <path
        d="m12 21-1.45-1.32C5.4 15.03 2 11.95 2 8.17 2 5.1 4.42 3 7.3 3c1.63 0 3.2.81 4.2 2.09C12.5 3.81 14.07 3 15.7 3 18.58 3 21 5.1 21 8.17c0 3.78-3.4 6.86-8.55 11.52L12 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.42 0-2.76-.35-3.93-.97L3 20.5l1.47-5.15A8.47 8.47 0 0 1 4 11.5 8.5 8.5 0 1 1 21 11.5Z"
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
  const [commentDraft, setCommentDraft] = useState('')
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const {
    addComment,
    getAttachmentForPost,
    getCommentsForPost,
    getLikeCount,
    isPostLiked,
    toggleLike,
  } = useFakeInteractions()
  const canManagePost = post.username === currentUsername
  const comments = getCommentsForPost(post.id)
  const attachment = getAttachmentForPost(post.id)
  const isLiked = isPostLiked(post.id, currentUsername)
  const likeCount = getLikeCount(post.id)

  function handleCommentSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()

    if (commentDraft.trim().length === 0) {
      return
    }

    addComment(post.id, currentUsername, commentDraft)
    setCommentDraft('')
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#999999] bg-white">
      <header className="flex items-start justify-between gap-4 bg-primary-500 px-5 py-5 text-white sm:px-6 sm:py-5">
        <h3 className="max-w-[82%] break-words text-[20px] font-bold leading-tight sm:max-w-[85%] sm:text-[22px]">
          {post.title}
        </h3>

        {canManagePost ? (
          <div className="flex items-center gap-3">
            <button
              aria-label="Delete post"
              className="flex h-7 w-7 items-center justify-center text-white transition-colors duration-200 hover:text-slate-100"
              onClick={() => onDelete(post)}
              type="button"
            >
              <MdDeleteForever className="h-[22px] w-[22px]" />
            </button>
            <button
              aria-label="Edit post"
              className="flex h-7 w-7 items-center justify-center text-white transition-colors duration-200 hover:text-slate-100"
              onClick={() => onEdit(post)}
              type="button"
            >
              <FaRegEdit className="h-[22px] w-[22px]" />
            </button>
          </div>
        ) : null}
      </header>

      <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="font-bold text-slate-500">@{post.username}</p>
          <time className="text-slate-400" dateTime={post.created_datetime}>
            {formatRelativeTime(post.created_datetime)}
          </time>
        </div>

        {attachment ? (
          <div className="overflow-hidden rounded-2xl border border-[#999999]">
            <img
              alt={`Attachment for ${post.title}`}
              className="max-h-[360px] w-full object-cover"
              src={attachment}
            />
          </div>
        ) : null}

        <p className="whitespace-pre-wrap break-words text-base leading-7 text-slate-800 sm:text-[18px] sm:leading-8">
          {post.content}
        </p>
      </div>

      <footer className="border-t border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-0 py-1 text-sm font-semibold transition-colors duration-200 ${
              isLiked
                ? 'text-rose-600 hover:text-rose-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => toggleLike(post.id, currentUsername)}
            type="button"
          >
            <HeartIcon isLiked={isLiked} />
            <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
          </button>

          <button
            className={`inline-flex items-center gap-2 rounded-lg px-0 py-1 text-sm font-semibold transition-colors duration-200 ${
              isCommentsOpen
                ? 'text-primary-600 hover:text-primary-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setIsCommentsOpen((previousState) => !previousState)}
            type="button"
          >
            <CommentIcon />
            <span>{comments.length} comment{comments.length === 1 ? '' : 's'}</span>
          </button>
        </div>

        {isCommentsOpen ? (
          <div className="mt-4 space-y-4 rounded-2xl border border-[#999999] bg-white p-4">
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No comments yet. Start the conversation.
                </p>
              ) : (
                comments.map((comment) => (
                  <article
                    className="rounded-xl border border-black bg-white px-4 py-3"
                    key={comment.id}
                  >
                    <p className="text-sm font-semibold text-slate-700">
                      @{comment.username}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {comment.content}
                    </p>
                  </article>
                ))
              )}
            </div>

            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              onSubmit={handleCommentSubmit}
            >
              <input
                className="h-11 flex-1 rounded-lg border border-black bg-white px-4 text-sm text-ink-950 outline-none transition-colors duration-200 focus:border-primary-500"
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="Write a comment"
                value={commentDraft}
              />
              <button
                className={`h-11 rounded-lg px-4 text-sm font-bold transition-all duration-200 sm:min-w-[110px] ${
                  commentDraft.trim().length === 0
                    ? 'bg-[#dddddd] text-white'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
                disabled={commentDraft.trim().length === 0}
                type="submit"
              >
                Comment
              </button>
            </form>
          </div>
        ) : null}
      </footer>
    </article>
  )
}
