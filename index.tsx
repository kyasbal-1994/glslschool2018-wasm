import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { configure } from 'mobx'

import Root from './src/view/root'
import Data from './src/store/data'

configure({ enforceActions: 'strict' })

const data = new Data()

ReactDOM.render(<Root data={data} />, document.querySelector('#app'))
