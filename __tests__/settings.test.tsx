import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Settings from '../pages/settings'

describe('Settings', () => {
  it('renders a preloader', () => {
    render(<Settings />)

    const heading = screen.getByRole('heading', {
      name: "Loading..",
    })

    expect(heading).toBeInTheDocument()
  })
})