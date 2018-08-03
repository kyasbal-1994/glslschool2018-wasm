import IMediaSource from '../../../core/separator/IMediaSource'
import DebugUtility from './DebugUtility'
import { LineSeparator } from '../../../core/separator/LineSeparator'

export class WebcamRenderer {
  public resizer: HTMLCanvasElement
  private resizerCtx: CanvasRenderingContext2D
  debugUtil: DebugUtility
  separator: LineSeparator
  constructor(public video: HTMLVideoElement, dv: IDebugVisualizer) {
    navigator.getUserMedia(
      {
        audio: false,
        video: { facingMode: 'environment' }
      },
      stream => {
        video.srcObject = stream
        video.onloadedmetadata = function(e) {
          video.play()
        }
      },
      err => {
        console.error(err)
      }
    )
    this.resizer = document.createElement('canvas')
    this.resizer.width = 512
    this.resizer.height = 512
    this.resizerCtx = this.resizer.getContext('2d')!
    this.debugUtil = new DebugUtility(dv)
    this.separator = new LineSeparator(this.getSource(), this.debugUtil)
  }

  public getSource(): IMediaSource {
    return new WebcamSource(this)
  }

  public draw = () => {
    this.resizerCtx.clearRect(0, 0, 512, 512)
    this.resizerCtx.drawImage(this.video, 0, 0, 512, 512)
    this.separator.onUpdate()
    this.debugUtil.logFilterResult('sobel', this.separator.sobel)
    requestAnimationFrame(this.draw)
  }

  public begin() {
    this.draw()
  }
}

export class WebcamSource implements IMediaSource {
  constructor(public renderer: WebcamRenderer) {
    this.current = renderer.resizer
    this.width = renderer.resizer.width
    this.height = renderer.resizer.height
  }
  current: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  width: number
  height: number
  public next(): boolean {
    return true
  }
}
