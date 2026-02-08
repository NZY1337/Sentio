import { describe, it, expect, vi } from 'vitest'

const mockRes = () => {
  const res: any = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

describe('users controller', () => {
  it('exports expected functions', () => {
    return import('../controllers/users').then((controller) => {
      expect(typeof controller.updateUserRole).toBe('function')
      expect(typeof controller.getUsers).toBe('function')
      expect(typeof controller.deleteUser).toBe('function')
      expect(typeof controller.getUserCredits).toBe('function')
    })
  })

  it('getUserCredits returns user credits when found', async () => {
    const fakeUser = { credits: { toNumber: () => 1000 } }
    vi.resetModules()
    vi.doMock('../services/prismaClient', () => ({
      prismaClient: { user: { findUnique: vi.fn().mockResolvedValue(fakeUser) } },
    }))

    const req: any = { query: { userId: 'user_1' } }
    const res = mockRes()

    const controller = await import('../controllers/users')
    await controller.getUserCredits(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalled()
  })
})
