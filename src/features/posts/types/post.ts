export interface Post {
  id: number
  username: string
  created_datetime: string
  title: string
  content: string
}

export interface PostsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Post[]
}

export interface CreatePostPayload {
  username: string
  title: string
  content: string
}

export interface UpdatePostPayload {
  id: number
  title: string
  content: string
}

export interface DeletePostPayload {
  id: number
}
