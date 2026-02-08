import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css'

import App from './App.tsx'

// contexts
import AppThemeProvider from './context/AppTheme.tsx';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './context/TanstackQuery.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { SkeletonTheme } from 'react-loading-skeleton';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <QueryClientProvider client={queryClient}>
                <AppThemeProvider>
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <App />
                    </SkeletonTheme>
                </AppThemeProvider>
            </QueryClientProvider>
        </ClerkProvider>
    </StrictMode >,
)
