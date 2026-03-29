import { useState, type SyntheticEvent } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import type { Post } from '../types/post'
import {
  useCreatePost,
  useDeletePost,
  useUpdatePost,
} from '../hooks/usePostMutations'
import { usePosts } from '../hooks/usePosts'
import { DeletePostModal } from './DeletePostModal'
import { EditPostModal } from './EditPostModal'
import { PostCard } from './PostCard'
import { PostComposer } from './PostComposer'

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
  const [content, setContent] = useState('')
  const [postBeingDeleted, setPostBeingDeleted] = useState<Post | null>(null)
  const [postBeingEdited, setPostBeingEdited] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const {
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    posts,
  } = usePosts()

  if (!session) {
    return null
  }

  const currentUsername = session.username

  async function handleCreatePost(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()

    if (title.trim().length === 0 || content.trim().length === 0) {
      return
    }

    try {
      await createPostMutation.mutateAsync({
        username: currentUsername,
        title: title.trim(),
        content: content.trim(),
      })

      setTitle('')
      setContent('')
    } catch {
      return
    }
  }

  function handleDeleteModalOpen(post: Post) {
    setPostBeingDeleted(post)
  }

  function handleEditModalOpen(post: Post) {
    setPostBeingEdited(post)
    setEditingTitle(post.title)
    setEditingContent(post.content)
  }

  function handleCloseDeleteModal() {
    setPostBeingDeleted(null)
  }

  function handleCloseEditModal() {
    setPostBeingEdited(null)
    setEditingTitle('')
    setEditingContent('')
  }

  async function handleConfirmDelete() {
    if (!postBeingDeleted) {
      return
    }

    try {
      await deletePostMutation.mutateAsync({ id: postBeingDeleted.id })
      handleCloseDeleteModal()
    } catch {
      return
    }
  }

  async function handleSaveEdit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()

    if (
      !postBeingEdited ||
      editingTitle.trim().length === 0 ||
      editingContent.trim().length === 0
    ) {
      return
    }

    try {
      await updatePostMutation.mutateAsync({
        id: postBeingEdited.id,
        title: editingTitle.trim(),
        content: editingContent.trim(),
      })

      handleCloseEditModal()
    } catch {
      return
    }
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
    <>
      <main className="min-h-screen bg-[#dddddd] px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <header className="bg-primary-500 px-6 py-7 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">
                  {sessionLabel}
                </p>
                <h1 className="font-display text-[22px] font-bold text-white">
                  CodeLeap Network
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {session.photoUrl ? (
                  <img
                    alt={session.username}
                    className="hidden h-10 w-10 rounded-full border border-white/40 object-cover sm:block"
                    referrerPolicy="no-referrer"
                    src={session.photoUrl}
                  />
                ) : (
                  <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/15 text-sm font-bold text-white sm:flex">
                    {getInitials(session.username)}
                  </div>
                )}

                <button
                  className="rounded-lg border border-white/45 bg-white px-4 py-2 text-sm font-bold text-primary-500 transition hover:bg-slate-100"
                  disabled={isLoggingOut}
                  onClick={() => void handleLogout()}
                  type="button"
                >
                  {isLoggingOut ? 'Leaving...' : 'Logout'}
                </button>
              </div>
            </div>
          </header>

          <div className="space-y-6 bg-[#dddddd] p-6 sm:p-8">
            <PostComposer
              content={content}
              errorMessage={createPostMutation.errorMessage}
              isSubmitting={createPostMutation.isLoading}
              onContentChange={setContent}
              onSubmit={handleCreatePost}
              onTitleChange={setTitle}
              title={title}
            />

            <section className="space-y-5">
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600">
                  Loading posts...
                </div>
              ) : null}

              {isError ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {!isLoading && !isError && posts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600">
                  No posts yet. Publish the first one from the composer above.
                </div>
              ) : null}

              {!isLoading && !isError && posts.length > 0 ? (
                <div className="space-y-6">
                      {posts.map((post) => (
                    <PostCard
                      currentUsername={currentUsername}
                      key={post.id}
                      onDelete={handleDeleteModalOpen}
                      onEdit={handleEditModalOpen}
                      post={post}
                    />
                  ))}
                </div>
              ) : null}

              {hasNextPage && !isLoading ? (
                <div className="flex justify-end">
                  <button
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-ink-950 transition hover:bg-slate-50"
                    disabled={isFetchingNextPage}
                    onClick={() => void fetchNextPage()}
                    type="button"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </main>

      {postBeingDeleted ? (
        <DeletePostModal
          errorMessage={deletePostMutation.errorMessage}
          isDeleting={deletePostMutation.isLoading}
          onCancel={handleCloseDeleteModal}
          onConfirm={() => void handleConfirmDelete()}
        />
      ) : null}

      {postBeingEdited ? (
        <EditPostModal
          content={editingContent}
          errorMessage={updatePostMutation.errorMessage}
          isSaving={updatePostMutation.isLoading}
          onCancel={handleCloseEditModal}
          onContentChange={setEditingContent}
          onSave={handleSaveEdit}
          onTitleChange={setEditingTitle}
          title={editingTitle}
        />
      ) : null}
    </>
  )
}
