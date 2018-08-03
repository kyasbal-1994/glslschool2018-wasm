import * as React from 'react'
import { Link } from 'react-router-dom'

import * as style from './index.scss'

interface Props {}

const Header: React.SFC<Props> = () => {
  return (
    <header className={style.root}>
      <ul>
        <li>
          <Link to="/">Index</Link>
        </li>
      </ul>
    </header>
  )
}

export default Header
