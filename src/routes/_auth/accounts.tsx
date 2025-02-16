import AccountsPage from '@/src/pages/AccountsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/accounts')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AccountsPage />
}
