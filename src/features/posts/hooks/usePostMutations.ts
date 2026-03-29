import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../../../shared/lib/api/get-error-message'
import { createPost, deletePost, updatePost } from '../api/posts'
import type {
  CreatePostPayload,
  DeletePostPayload,
  UpdatePostPayload,
} from '../types/post'
import { postsQueryKey } from './usePosts'

export function useCreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.isError
      ? getErrorMessage(mutation.error, 'Unable to create the post.')
      : null,
  }
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: UpdatePostPayload) => updatePost(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.isError
      ? getErrorMessage(mutation.error, 'Unable to update the post.')
      : null,
  }
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: DeletePostPayload) => deletePost(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKey })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    errorMessage: mutation.isError
      ? getErrorMessage(mutation.error, 'Unable to delete the post.')
      : null,
  }
}
