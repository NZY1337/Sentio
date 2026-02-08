import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from './Footer'

describe('Footer', () => {
  it('renders company text', () => {
    render(<Footer />)
    expect(screen.getByText(/Your Company Name/i)).toBeInTheDocument()
  })
})
