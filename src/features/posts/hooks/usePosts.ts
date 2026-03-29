import { useInfiniteQuery } from '@tanstack/react-query'
import { getErrorMessage } from '../../../shared/lib/api/get-error-message'
import { fetchPostsPage } from '../api/posts'
import type { Post } from '../types/post'

export const postsQueryKey = ['posts'] as const

function sortPostsByDate(posts: Post[]) {
  return [...posts].sort(
    (firstPost, secondPost) =>
      new Date(secondPost.created_datetime).getTime() -
      new Date(firstPost.created_datetime).getTime(),
  )
}

export function usePosts() {
  const query = useInfiniteQuery({
    queryKey: postsQueryKey,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => fetchPostsPage(pageParam),
    getNextPageParam: (lastPage) => lastPage.next,
  })

  const posts = sortPostsByDate(
    query.data?.pages.flatMap((page) => page.results) ?? [],
  )

  return {
    ...query,
    posts,
    totalPosts: query.data?.pages[0]?.count ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.isError
      ? getErrorMessage(query.error, 'Unable to load posts.')
      : null,
  }
}
