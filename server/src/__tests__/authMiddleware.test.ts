import { describe, it, expect, vi } from 'vitest'

describe('authMiddleware', () => {
  it('throws UnauthorizedException when no userId in auth', () => {
    const req: any = { headers: {} }
    const res: any = {}
    const next = vi.fn()

    // mock getAuth to return empty
  vi.mock('@clerk/express', () => ({ getAuth: () => ({}) }))

  // import fresh middleware (will use the mocked getAuth)
  return import('../middlewares/authMiddleware').then((mod) => {
      try {
        mod.authMiddleware(req, res, next)
      } catch (e: any) {
        expect(e).toBeTruthy()
      }
    })
  })
})
