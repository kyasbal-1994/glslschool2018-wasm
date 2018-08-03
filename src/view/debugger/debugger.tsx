import * as React from 'react'
import Data from '../../store/data'
import Visualizer from './visualizer/visualizer'
import { WebcamRenderer } from './debug/WebCamRenderer'
interface Props {
  data: Data
}

export class Debugger extends React.Component<Props> {
  private canvas!: HTMLCanvasElement
  private video!: HTMLVideoElement
  private appendexDiv!: HTMLDivElement
  private webcamRenderer!: WebcamRenderer
  public render() {
    return (
      <div>
        <video ref={e => (this.video = e!)} />
        <canvas width={512} height={512} ref={e => (this.canvas = e!)} />
        <div ref={e => (this.appendexDiv = e!)} />
        <Visualizer data={this.props.data} />
      </div>
    )
  }

  public componentDidMount() {
    this.webcamRenderer = new WebcamRenderer(this.video, this.props.data)
    this.webcamRenderer.begin()
    this.appendexDiv.appendChild(this.webcamRenderer.resizer)
  }
}
