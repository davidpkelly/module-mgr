import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/module-profiles')({
  component: ModuleProfiles,
})

function ModuleProfiles() {
  return <div>Hello "/_auth/module-profiles"!</div>
}
