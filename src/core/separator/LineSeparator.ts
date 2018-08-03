///<reference path="../../../node_modules/@types/webassembly-js-api/index.d.ts"/>
import IMediaSource from './IMediaSource'
import { GPUFilter, BinaryFilter, SobelFilter } from './GPUFilter'
import { WasmProcess } from './WasmProcess'
import DebugUtility from '../../view/debugger/debug/DebugUtility'

export class LineSeparator {
  public canvas: HTMLCanvasElement
  public gl: WebGLRenderingContext
  protected sourceTexture: WebGLTexture
  public wasm: WasmProcess
  sobel: SobelFilter
  /**
   * GLコンテキストを作る
   * ユニットテスト時にこれを置き換える(?)
   * @param canvas
   */
  public static getGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = canvas.getContext('webgl')
    if (!gl) {
      gl = canvas.getContext('experimental-webgl')
    }
    if (!gl) {
      throw new Error('Failed to initialize WebGL context. Unsupported')
    }
    return gl
  }
  constructor(public source: IMediaSource, private _dv?: DebugUtility) {
    //キャンバス作ってコンテキスト取得
    this.canvas = document.createElement('canvas')
    this.gl = LineSeparator.getGLContext(this.canvas)
    this.wasm = new WasmProcess(this.gl, _dv)
    // 入力のテクスチャを作る
    this.sourceTexture = this._initializeSourceTexture()
    this.sobel = new SobelFilter(this.gl, 512, 512, this.sourceTexture)
  }

  public onUpdate(): void {
    if (this.source.next() && this.wasm.ready) {
      // 更新がある場合のみdetect処理をする
      this._updateSourceTexture()
      this.sobel.drawFilter()
      this.wasm.detectlines(
        this.sobel.dstTexture,
        this.sobel.dstWidth,
        this.sobel.dstHeight
      )
    }
  }

  private _initializeSourceTexture(): WebGLTexture {
    const sourceTexture = this.gl.createTexture()!
    this.gl.bindTexture(this.gl.TEXTURE_2D, sourceTexture)
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    )
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      1,
      1,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null
    )
    return sourceTexture
  }

  private _updateSourceTexture(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.sourceTexture)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.source.current
    )
  }
}
