import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import type { AuthContext } from '../auth'

interface RouterContextAuth {
  auth: AuthContext,
}

export const Route = createRootRouteWithContext<RouterContextAuth>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
})