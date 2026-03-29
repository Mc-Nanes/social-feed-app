import { useContext } from 'react'
import { FakeInteractionsContext } from '../context/fake-interactions-context'

export function useFakeInteractions() {
  const context = useContext(FakeInteractionsContext)

  if (!context) {
    throw new Error(
      'useFakeInteractions must be used within a FakeInteractionsProvider.',
    )
  }

  return context
}
