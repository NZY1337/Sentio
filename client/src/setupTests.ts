import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Provide lightweight mocks for @toolpad/core used in hooks
vi.mock('@toolpad/core', () => ({
	useNotifications: () => ({ show: vi.fn() })
}))

// Partially mock @tanstack/react-query: export real QueryClient/Provider while faking hooks by default
vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual<object>('@tanstack/react-query');
	return {
		...actual,
		useQueryClient: () => ({
			setQueryData: vi.fn(),
			getQueryData: vi.fn(),
			cancelQueries: vi.fn()
		}),
		useQuery: () => ({ isPending: false, data: [] }),
		useMutation: () => ({ isPending: false, mutate: vi.fn() })
	}
})

// Polyfill matchMedia for libraries (like react-slick/enquire.js) that depend on it
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(window as any).matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {}, // deprecated
		removeListener: () => {}, // deprecated
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	})
}
