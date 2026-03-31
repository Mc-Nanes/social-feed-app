import {
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react'
import { FaSearch } from 'react-icons/fa'
import { useAuth } from '../../auth/hooks/useAuth'
import { useFakeInteractions } from '../hooks/useFakeInteractions'
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
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()
  const { removePostData, setAttachmentForPost } = useFakeInteractions()
  const {
    errorMessage,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    posts,
  } = usePosts()
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const currentUsername = session?.username ?? ''
  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase()
  const filteredPosts =
    normalizedSearchQuery.length === 0
      ? posts
      : posts.filter((post) => {
          const normalizedTitle = post.title.toLowerCase()
          const normalizedUsername = post.username.toLowerCase()

          return (
            normalizedTitle.includes(normalizedSearchQuery) ||
            normalizedUsername.includes(normalizedSearchQuery)
          )
        })

  useEffect(() => {
    const triggerElement = loadMoreTriggerRef.current

    if (!triggerElement || !hasNextPage) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      {
        rootMargin: '280px 0px',
      },
    )

    observer.observe(triggerElement)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, filteredPosts.length])

  if (!session) {
    return null
  }

  async function handleCreatePost(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault()

    if (title.trim().length === 0 || content.trim().length === 0) {
      return
    }

    try {
      const createdPost = await createPostMutation.mutateAsync({
        username: currentUsername,
        title: title.trim(),
        content: content.trim(),
      })

      if (selectedAttachment) {
        setAttachmentForPost(createdPost.id, selectedAttachment)
      }

      setTitle('')
      setContent('')
      setSelectedAttachment(null)
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
      removePostData(postBeingDeleted.id)
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

  return (
    <>
      <main className="min-h-screen bg-[#dddddd] px-0 py-0">
        <div className="mx-auto min-h-screen w-full max-w-[800px] bg-white">
          <header className="bg-primary-500 px-4 py-6 sm:px-8">
            <div className="flex items-center justify-between gap-3">
              <h1 className="min-w-0 font-display text-[22px] font-bold leading-tight text-white">
                CodeLeap Network
              </h1>

              <div className="ml-3 flex shrink-0 items-center gap-2">
                  {session.photoUrl ? (
                    <img
                      alt={session.username}
                      className="h-9 w-9 shrink-0 rounded-full border border-white/40 object-cover"
                      referrerPolicy="no-referrer"
                      src={session.photoUrl}
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/15 text-sm font-bold text-white">
                      {getInitials(session.username)}
                    </div>
                  )}

                  <button
                    className="h-9 shrink-0 rounded-lg border border-white bg-white px-4 text-sm font-bold text-primary-500 transition-colors duration-200 hover:bg-slate-100"
                    disabled={isLoggingOut}
                    onClick={() => void handleLogout()}
                    type="button"
                  >
                    {isLoggingOut ? 'Leaving...' : 'Logout'}
                  </button>
              </div>
            </div>
          </header>

          <div className="space-y-5 bg-white p-3 sm:space-y-6 sm:p-5">
            <PostComposer
              attachmentPreview={selectedAttachment}
              content={content}
              errorMessage={createPostMutation.errorMessage}
              isSubmitting={createPostMutation.isLoading}
              onAttachmentChange={setSelectedAttachment}
              onContentChange={setContent}
              onSubmit={handleCreatePost}
              onTitleChange={setTitle}
              title={title}
            />

            <section className="space-y-5">
              <div className="flex justify-start">
                <label className="relative block w-full sm:max-w-[320px]">
                  <span className="sr-only">Search posts</span>
                  <FaSearch className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-10 w-full rounded-lg border border-[#999999] bg-white pl-3 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 transition-colors duration-200 focus:border-primary-500"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by title or author"
                    value={searchQuery}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2 px-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {filteredPosts.length} of {posts.length} posts visible
                </span>
                {normalizedSearchQuery ? (
                  <span className="break-words sm:text-right">{`Filtering by "${deferredSearchQuery}"`}</span>
                ) : null}
              </div>

              {isLoading ? (
                <div className="rounded-2xl border border-[#999999] bg-white px-6 py-5 text-sm text-slate-600">
                  Loading posts...
                </div>
              ) : null}

              {isError ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              {!isLoading && !isError && posts.length === 0 ? (
                <div className="rounded-2xl border border-[#999999] bg-white px-6 py-5 text-sm text-slate-600">
                  No posts yet. Publish the first one from the composer above.
                </div>
              ) : null}

              {!isLoading &&
              !isError &&
              posts.length > 0 &&
              filteredPosts.length === 0 ? (
                <div className="rounded-2xl border border-[#999999] bg-white px-6 py-5 text-sm text-slate-600">
                  No posts match your search right now.
                </div>
              ) : null}

              {!isLoading && !isError && filteredPosts.length > 0 ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
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

              {hasNextPage ? (
                <div
                  className="flex min-h-12 items-center justify-center rounded-2xl border border-dashed border-[#999999] bg-white px-4 py-3 text-sm text-slate-500"
                  ref={loadMoreTriggerRef}
                >
                  {isFetchingNextPage
                    ? 'Loading more posts...'
                    : 'Scroll to keep loading posts'}
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
