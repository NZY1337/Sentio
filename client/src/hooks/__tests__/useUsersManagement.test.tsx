import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { useUsersManagement } from '../useUserManagement'

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    cancelQueries: vi.fn()
  }),
  useQuery: () => ({ isPending: false, data: [] }),
  useMutation: () => ({ isPending: false, mutate: vi.fn() })
}))

vi.mock('../../services/users', () => ({
  getUsers: vi.fn(),
  updateUserRole: vi.fn().mockResolvedValue({}),
  deleteUser: vi.fn().mockResolvedValue({})
}))

describe('useUsersManagement', () => {
  it('exposes mutations that can be called', () => {
    const Dummy = () => {
      const { updateUserRoleMutation, deleteUserMutation } = useUsersManagement()
      return (
        <div>
          <button onClick={() => (updateUserRoleMutation).mutate({ userId: '1', role: 'ADMIN' })}>c</button>
          <button onClick={() => (deleteUserMutation).mutate('1')}>d</button>
        </div>
      )
    }

    const { getByText } = render(<Dummy />)
    getByText('c').click()
    getByText('d').click()
  })
})
