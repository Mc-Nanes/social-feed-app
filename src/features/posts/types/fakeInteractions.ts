export interface FakeComment {
  id: string
  postId: number
  username: string
  content: string
}

export interface FakeInteractionsState {
  commentsByPostId: Record<string, FakeComment[]>
  likedPostIdsByUser: Record<string, number[]>
  attachmentsByPostId: Record<string, string>
}

export interface FakeInteractionsContextValue {
  addComment: (postId: number, username: string, content: string) => void
  getAttachmentForPost: (postId: number) => string | null
  getCommentsForPost: (postId: number) => FakeComment[]
  getLikeCount: (postId: number) => number
  isPostLiked: (postId: number, username: string) => boolean
  removePostData: (postId: number) => void
  setAttachmentForPost: (postId: number, attachmentBase64: string) => void
  toggleLike: (postId: number, username: string) => void
}

export const MOCK_MENTION_USERS = ['Victor', 'Vini', 'Leo'] as const
