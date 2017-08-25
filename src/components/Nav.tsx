import * as React from 'react'
import { Link as RLink } from 'react-router-dom'

interface LinkProps {
  to: string
  isInternal?: (x: string) => boolean
  children?: React.ReactNode
}

const Link: React.SFC<LinkProps> = ({ to, isInternal, children }) => {
  if (isInternal == null || !isInternal(to)) {
    return <a href={to}>{children}</a>
  }
  return <RLink to={to}>{children}</RLink>
}

interface NavProps {
  isInternal: (x: string) => boolean
  children?: React.ReactNode
}

export const Nav: React.SFC<NavProps> = ({ isInternal, children }) => (
  <nav>
    <ul>
      <li><Link isInternal={isInternal} to="/">Home</Link></li>
      <li><Link isInternal={isInternal} to="/another-page/">Another Page</Link></li>
      <li><Link isInternal={isInternal} to="/another-page/2">2</Link></li>
      <li><Link isInternal={isInternal} to="/another-page/3">3</Link></li>
    </ul>
  </nav>
)
