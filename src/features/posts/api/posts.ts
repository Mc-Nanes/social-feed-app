import { api } from '../../../shared/lib/api/api'
import type {
  CreatePostPayload,
  DeletePostPayload,
  Post,
  PostsResponse,
  UpdatePostPayload,
} from '../types/post'

export async function fetchPostsPage(
  pageUrl?: string | null,
): Promise<PostsResponse> {
  const { data } = await api.get<PostsResponse>(pageUrl ?? '')

  return data
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const { data } = await api.post<Post>('', payload)

  return data
}

export async function updatePost(payload: UpdatePostPayload): Promise<Post> {
  const { id, ...body } = payload
  const { data } = await api.patch<Post>(`${id}/`, body)

  return data
}

export async function deletePost({
  id,
}: DeletePostPayload): Promise<void> {
  await api.delete(`${id}/`)
}
