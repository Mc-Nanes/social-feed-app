import { SignupModal } from '../features/auth/components/SignupModal'
import { useAuth } from '../features/auth/hooks/useAuth'
import { FeedShell } from '../features/posts/components/FeedShell'

export function App() {
  const { session } = useAuth()

  if (!session) {
    return <SignupModal />
  }

  return <FeedShell />
}
