export default interface IMediaSource {
  next(): boolean
  current: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  width: number
  height: number
}
