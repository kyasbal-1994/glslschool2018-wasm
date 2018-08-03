import * as React from 'react'
import { observer } from 'mobx-react'
import Data from '../../../store/data'
import { SFC } from 'react'
import { observable, runInAction } from 'mobx'
interface Props {
  data: Data
}
interface SingleVisualizerProps {
  vKey: string
  vCanvas: HTMLCanvasElement
}

class SingleVisualizer extends React.Component<SingleVisualizerProps> {
  canvasWrap!: HTMLDivElement
  render() {
    return (
      <div>
        <p>{this.props.vKey}</p>
        <div ref={e => (this.canvasWrap = e!)} />
      </div>
    )
  }

  componentDidMount() {
    this.canvasWrap.appendChild(this.props.vCanvas)
  }
}
const Visualizer: React.SFC<Props> = (data: Props) => {
  const vData = data.data.visualizers
  const visualizers: any[] = []
  Object.entries(vData).forEach(v => {
    runInAction(() => {
      visualizers.push(
        <SingleVisualizer key={v[0]} vKey={v[0]} vCanvas={v[1]} />
      )
    })
  })
  return <div>{visualizers}</div>
}

export default observer(Visualizer)
