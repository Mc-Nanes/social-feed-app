import { useEffect, useState, type ReactNode } from 'react'
import type {
  FakeInteractionsState,
  FakeComment,
} from '../types/fakeInteractions'
import { FakeInteractionsContext } from './fake-interactions-context'

const STORAGE_KEY = 'codeleap_fake_interactions'

const initialState: FakeInteractionsState = {
  commentsByPostId: {},
  likedPostIdsByUser: {},
  attachmentsByPostId: {},
}

function loadFakeInteractionsState(): FakeInteractionsState {
  if (typeof window === 'undefined') {
    return initialState
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY)

  if (!rawValue) {
    return initialState
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<FakeInteractionsState>

    return {
      commentsByPostId: parsedValue.commentsByPostId ?? {},
      likedPostIdsByUser: parsedValue.likedPostIdsByUser ?? {},
      attachmentsByPostId: parsedValue.attachmentsByPostId ?? {},
    }
  } catch {
    return initialState
  }
}

function createCommentId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `comment-${Date.now()}-${Math.round(Math.random() * 10_000)}`
}

interface FakeInteractionsProviderProps {
  children: ReactNode
}

export function FakeInteractionsProvider({
  children,
}: FakeInteractionsProviderProps) {
  const [state, setState] = useState<FakeInteractionsState>(() =>
    loadFakeInteractionsState(),
  )

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function toggleLike(postId: number, username: string) {
    setState((previousState) => {
      const likedPosts = previousState.likedPostIdsByUser[username] ?? []
      const hasLikedPost = likedPosts.includes(postId)

      return {
        ...previousState,
        likedPostIdsByUser: {
          ...previousState.likedPostIdsByUser,
          [username]: hasLikedPost
            ? likedPosts.filter((likedPostId) => likedPostId !== postId)
            : [...likedPosts, postId],
        },
      }
    })
  }

  function addComment(postId: number, username: string, content: string) {
    const normalizedContent = content.trim()

    if (!normalizedContent) {
      return
    }

    const nextComment: FakeComment = {
      id: createCommentId(),
      postId,
      username,
      content: normalizedContent,
    }

    setState((previousState) => {
      const postKey = String(postId)

      return {
        ...previousState,
        commentsByPostId: {
          ...previousState.commentsByPostId,
          [postKey]: [
            ...(previousState.commentsByPostId[postKey] ?? []),
            nextComment,
          ],
        },
      }
    })
  }

  function setAttachmentForPost(postId: number, attachmentBase64: string) {
    setState((previousState) => ({
      ...previousState,
      attachmentsByPostId: {
        ...previousState.attachmentsByPostId,
        [String(postId)]: attachmentBase64,
      },
    }))
  }

  function removePostData(postId: number) {
    setState((previousState) => {
      const postKey = String(postId)
      const nextCommentsByPostId = { ...previousState.commentsByPostId }
      const nextAttachmentsByPostId = { ...previousState.attachmentsByPostId }
      const nextLikedPostIdsByUser = Object.fromEntries(
        Object.entries(previousState.likedPostIdsByUser).map(
          ([username, likedPosts]) => [
            username,
            likedPosts.filter((likedPostId) => likedPostId !== postId),
          ],
        ),
      )

      delete nextCommentsByPostId[postKey]
      delete nextAttachmentsByPostId[postKey]

      return {
        commentsByPostId: nextCommentsByPostId,
        likedPostIdsByUser: nextLikedPostIdsByUser,
        attachmentsByPostId: nextAttachmentsByPostId,
      }
    })
  }

  function isPostLiked(postId: number, username: string) {
    return (state.likedPostIdsByUser[username] ?? []).includes(postId)
  }

  function getLikeCount(postId: number) {
    return Object.values(state.likedPostIdsByUser).reduce(
      (totalLikes, likedPosts) =>
        likedPosts.includes(postId) ? totalLikes + 1 : totalLikes,
      0,
    )
  }

  function getCommentsForPost(postId: number) {
    return state.commentsByPostId[String(postId)] ?? []
  }

  function getAttachmentForPost(postId: number) {
    return state.attachmentsByPostId[String(postId)] ?? null
  }

  return (
    <FakeInteractionsContext.Provider
      value={{
        addComment,
        getAttachmentForPost,
        getCommentsForPost,
        getLikeCount,
        isPostLiked,
        removePostData,
        setAttachmentForPost,
        toggleLike,
      }}
    >
      {children}
    </FakeInteractionsContext.Provider>
  )
}
