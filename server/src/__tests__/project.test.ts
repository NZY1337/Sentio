import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as projectController from '../controllers/project'
import { prismaClient } from '../services/prismaClient'

// create simple mocks for req/res
const mockRes = () => {
  const res: any = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

describe('project controller', () => {
  it('exports designGenerator and designEditor and getProjects', () => {
    expect(typeof projectController.designGenerator).toBe('function')
    expect(typeof projectController.designEditor).toBe('function')
    expect(typeof projectController.getProjects).toBe('function')
  })

  it('getProjects calls prisma findMany and returns projects', async () => {
    // stub prismaClient in services/prismaClient
    const fakeProjects = [{ id: '1' }]

    const req: any = { auth: { userId: 'user_1' } }
    const res = mockRes()

    const findManySpy = vi.spyOn((prismaClient as any).project, 'findMany').mockResolvedValue(fakeProjects as any)

    await projectController.getProjects(req, res)

    findManySpy.mockRestore()

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ projects: fakeProjects })
  })
})
