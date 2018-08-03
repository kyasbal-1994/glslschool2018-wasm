/**
 * フィルター用の正方形ジオメトリ
 */
export class QuadGeometry {
  private static _instance: QuadGeometry
  /**
   * シングルトン
   * @param gl
   */
  public static get(gl: WebGLRenderingContext): QuadGeometry {
    if (!QuadGeometry._instance) {
      QuadGeometry._instance = new QuadGeometry(gl)
    }
    return QuadGeometry._instance
  }

  private vBuffer: WebGLBuffer

  private iBuffer: WebGLBuffer
  constructor(private _gl: WebGLRenderingContext) {
    this.vBuffer = _gl.createBuffer()!
    this.iBuffer = _gl.createBuffer()!
    const { vBuffer, iBuffer } = this
    _gl.bindBuffer(_gl.ARRAY_BUFFER, vBuffer)
    _gl.bufferData(
      _gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, 1, 1, 1, -1, -1, -1]),
      _gl.STATIC_DRAW
    )
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, iBuffer)
    _gl.bufferData(
      _gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array([0, 2, 3, 0, 1, 2]),
      _gl.STATIC_DRAW
    )
  }

  public draw(): void {
    const { _gl, vBuffer, iBuffer } = this
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, iBuffer)
    _gl.bindBuffer(_gl.ARRAY_BUFFER, vBuffer)
    _gl.drawElements(_gl.TRIANGLES, 6, _gl.UNSIGNED_BYTE, 0)
  }
}
