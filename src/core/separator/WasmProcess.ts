import { wConsole } from './wasm/WasmBridges'
import DebugUtility from '../../view/debugger/debug/DebugUtility'

export class WasmProcess {
  private exports: any
  private memory!: WebAssembly.Memory
  public ready: boolean = false
  private fbo!: WebGLFramebuffer
  constructor(private gl: WebGLRenderingContext, private _dv?: DebugUtility) {
    this._instanciateWASM()
  }

  public detectlines(
    texture: WebGLTexture,
    width: number,
    height: number
  ): void {
    // get base address for copy
    const ba = this.exports.prepareDetectLine(width, height)
    this._copyToTextureBuffer(texture, width, height, ba, this.memory.buffer)
    this.exports.detectlines()
  }

  private async _instanciateWASM(): Promise<void> {
    const response = await fetch('untouched.wasm')
    const bytes = await response.arrayBuffer()
    const wasm = await WebAssembly.instantiate(bytes, {
      env: {
        abort: (a: any, b: any, c: any, d: any) => {
          console.error(a, b, c, d)
        }
      },
      console: wConsole,
      debug: {
        logTexture: (key: number, w: number, h: number, ba: number) => {
          if (this._dv) {
            const keyStr = `wasm-${key}`
            this._dv.logTextureFromArrayBuffer(
              keyStr,
              w,
              h,
              ba,
              this.memory.buffer
            )
          }
        }
      }
    })
    this.exports = wasm.instance.exports
    this.memory = this.exports.memory
    this.ready = true
  }

  private _copyToTextureBuffer(
    texture: WebGLTexture,
    width: number,
    height: number,
    ba: number,
    data: ArrayBuffer
  ): void {
    if (!this.fbo) {
      this.fbo = this.gl.createFramebuffer()!
    }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      texture,
      0
    )
    const view = new Uint8Array(data, ba, width * height * 4)
    this.gl.readPixels(
      0,
      0,
      width,
      height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      view
    )
  }
}
