import * as React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Data from '../../store/data'
import { observer } from 'mobx-react'
import Header from './header'

import 'normalize.css/normalize.css'
import './index.scss'
import { Debugger } from '../debugger/debugger'

interface Props {
  data: Data
}

const Root: React.SFC<Props> = ({ data }) => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Route path="/" exact component={() => <Debugger data={data} />} />
      </>
    </BrowserRouter>
  )
}

export default observer(Root)
