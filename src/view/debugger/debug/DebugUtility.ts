import { GPUFilter } from '../../../core/separator/GPUFilter'

/**
 * IDebugVisualizerを便利に扱うためのクラス
 * テクスチャのログを取るのが大変なのでこれを使う
 */
export default class DebugUtility {
  private canvases: { [key: string]: HTMLCanvasElement } = {}
  private contexts: { [key: string]: CanvasRenderingContext2D } = {}
  private fbos: { [key: string]: WebGLFramebuffer } = {}
  private imageCache: { [key: string]: ImageData } = {}
  constructor(private dv: IDebugVisualizer) {}

  public logFilterResult(key: string, filter: GPUFilter): void {
    this.logTexture(
      filter.gl,
      key,
      filter.dstTexture,
      filter.dstWidth,
      filter.dstHeight
    )
  }

  /**
   * テクスチャをブラウザの画面に出力する
   * @param gl
   * @param key
   * @param texture
   * @param texWidth
   * @param texHeight
   */
  public logTexture(
    gl: WebGLRenderingContext,
    key: string,
    texture: WebGLTexture,
    texWidth: number,
    texHeight: number
  ): void {
    const width = texWidth
    const height = texHeight
    // Create a framebuffer backed by the texture

    if (!this.fbos[key]) {
      this.fbos[key] = gl.createFramebuffer()!
    }
    const framebuffer = this.fbos[key]
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    )
    // TODO: support non RGBA texture
    // Read the contents of the framebuffer
    const data = new Uint8Array(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data)
    const { imageData } = this._ensureContextImageDataAndCanvas(
      key,
      width,
      height
    )
    // Copy the pixels to a 2D canvas
    imageData.data.set(data)
    this._showImageData(key, imageData)
  }

  /**
   * ArrayBufferからテクスチャにして描画する
   * @param key
   * @param width
   * @param height
   * @param baseAddress
   * @param data
   */
  public logTextureFromArrayBuffer(
    key: string,
    width: number,
    height: number,
    baseAddress: number,
    data: ArrayBuffer
  ): void {
    const { imageData } = this._ensureContextImageDataAndCanvas(
      key,
      width,
      height
    )
    imageData.data.set(new Uint8Array(data, baseAddress, width * height * 4))
    this._showImageData(key, imageData)
  }

  private _ensureContextImageDataAndCanvas(
    key: string,
    width: number,
    height: number
  ): {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    imageData: ImageData
  } {
    if (!this.canvases[key]) {
      // Create a 2D canvas to store the result
      this.canvases[key] = document.createElement('canvas')
      this.contexts[key] = this.canvases[key].getContext('2d')!
    }
    const canvas = this.canvases[key]
    const context = this.contexts[key]
    canvas.width = width
    canvas.height = height
    if (
      !this.imageCache[key] ||
      this.imageCache[key].width !== width ||
      this.imageCache[key].height !== height
    ) {
      this.imageCache[key] = context.createImageData(width, height)
    }
    const imageData = this.imageCache[key]
    return { canvas, context, imageData }
  }

  private _showImageData(key: string, imageData: ImageData) {
    const context = this.contexts[key]
    context.putImageData(
      imageData,
      0,
      0,
      0,
      0,
      imageData.width,
      imageData.height
    )
    this.dv.setVisualizer(key, context.canvas)
  }
}
