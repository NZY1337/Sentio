import { render } from '@testing-library/react'
import { vi } from 'vitest'

// Make getProjects synchronous for this unit test so we can exercise the hook without react-query provider
vi.mock('../../services/builder', () => ({
  getProjects: vi.fn().mockReturnValue([{ id: 'p1', prompt: 'hello' }])
}))

// Locally mock useQuery to call the provided queryFn synchronously and return its result
vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryFn }: { queryFn: () => unknown }) => ({ data: queryFn(), isPending: false, error: null }),
}))

import useProjects from '../useProjects'

const Dummy = () => {
  const { data, isPending } = useProjects()
  return (
    <div>
      <span data-testid="pending">{String(isPending)}</span>
      <span data-testid="len">{data ? data.length : 0}</span>
    </div>
  )
}

describe('useProjects', () => {
  it('calls getProjects and returns data', () => {
    const { getByTestId } = render(<Dummy />)
    expect(getByTestId('len').textContent).toBe('1')
  })
})
