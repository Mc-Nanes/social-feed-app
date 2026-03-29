import { createContext } from 'react'
import type { FakeInteractionsContextValue } from '../types/fakeInteractions'

export const FakeInteractionsContext = createContext<
  FakeInteractionsContextValue | undefined
>(undefined)
