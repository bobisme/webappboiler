import * as React from 'react'
import { Link } from 'react-router-dom'

import * as css from './Page.css'

interface PageProps {
  children?: React.ReactNode
}

export default function Page({ children }: PageProps) {
  return (
    <div className={css.page}>
      <div className={css.header}>
        <Link to="/">Home</Link>
        <Link to="/another-page">Another Page</Link>
      </div>
      <div className={css.content}>
        {children}
      </div>
    </div>
  )
}

//
// export default Page
//

// export default class Page extends React.Component {
//   render() {
//     return <div>fuck</div>
//   }
// }
