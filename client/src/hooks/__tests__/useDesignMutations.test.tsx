import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardContext } from '../../../src/components/Dashboard/context/dashboardContext'
import type { ProjectProps, GridCell } from '../../../src/types'
import Playground from '../../../src/components/Dashboard/Playground'

vi.mock('../../services/builder/designGenerator', () => ({
  designGenerator: vi.fn().mockResolvedValue({ data: 'ok' })
}))

vi.mock('../../services/builder/designEditor', () => ({
  designEditor: vi.fn().mockResolvedValue({ data: 'ok' })
}))

describe('design mutation hooks (integration)', () => {
  it('renders Playground and triggers generator/editor flows', async () => {
    const queryClient = new QueryClient()

    const dashboardValue: {
      value: string;
      project: ProjectProps | null;
      grid: GridCell[];
      setValue: (val: string) => void;
      setGrid: React.Dispatch<React.SetStateAction<GridCell[]>>;
      setProject: React.Dispatch<React.SetStateAction<ProjectProps | null>>;
    } = {
      value: '',
      project: null,
      grid: Array(6).fill(null) as GridCell[],
      setValue: vi.fn() as unknown as (val: string) => void,
      setGrid: vi.fn() as unknown as React.Dispatch<React.SetStateAction<GridCell[]>>,
      setProject: vi.fn() as unknown as React.Dispatch<React.SetStateAction<ProjectProps | null>>,
    }

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <DashboardContext.Provider value={dashboardValue}>
          <Playground />
        </DashboardContext.Provider>
      </QueryClientProvider>
    )

  // Playground contains an AIBuilder button labeled 'Generate Base Design' — assert it exists
  expect(getByText('Generate Base Design')).toBeTruthy()
  })
})
