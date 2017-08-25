import * as React from 'react'
import { Link } from 'react-router-dom'

import * as css from './Page.css'

interface PageProps {
  children?: React.ReactNode
}

export default function Page({ children }: PageProps) {
  return (
    <div className={css.page}>
      {children}
    </div>
  )
}
