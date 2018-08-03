import { QuadGeometry } from './QuadGeometry'

/**
 * Sobelフィルタなどのシェーダーによるフィルタ処理の抽象化クラス
 */
export abstract class GPUFilter {
  protected __fbo: WebGLFramebuffer
  public dstTexture: WebGLTexture
  constructor(
    public gl: WebGLRenderingContext,
    public dstWidth: number,
    public dstHeight: number,
    public srcWidth = dstWidth,
    public srcHeight = dstHeight
  ) {
    this.__fbo = gl.createFramebuffer()!
    this.dstTexture = this.gl.createTexture()!
    const { __fbo, dstTexture } = this
    // Textureの初期値設定
    gl.bindTexture(gl.TEXTURE_2D, dstTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      dstWidth,
      dstHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    )
    // Framebufferにテクスチャを結びつける
    gl.bindFramebuffer(gl.FRAMEBUFFER, __fbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      dstTexture,
      0
    )
  }

  public drawFilter(): void {
    const { gl, __fbo } = this
    const quad = QuadGeometry.get(gl)
    gl.bindFramebuffer(gl.FRAMEBUFFER, __fbo)
    gl.clearColor(1, 0, 0, 1)
    gl.viewport(0, 0, this.dstWidth, this.dstHeight)
    gl.clear(gl.COLOR_BUFFER_BIT)
    this.__setupProgram()
    quad.draw()
  }

  protected abstract __setupProgram(): void
}

export abstract class BasicGPUFilter extends GPUFilter {
  protected __program: WebGLProgram
  protected __vShader: WebGLShader
  protected __fShader: WebGLShader
  protected __uLocations: { [key: string]: WebGLUniformLocation } = {}

  private static _compileAndCheckStatus(
    gl: WebGLRenderingContext,
    shader: WebGLShader
  ): void {
    gl.compileShader(shader)
    if (gl.getShaderInfoLog(shader)) {
      throw new Error('Compilation error\n' + gl.getShaderInfoLog(shader))
    }
  }
  constructor(
    __gl: WebGLRenderingContext,
    dstWidth: number,
    dstHeight: number,
    public inputTexture: WebGLTexture,
    srcWidth = dstWidth,
    srcHeight = dstHeight
  ) {
    super(__gl, dstWidth, dstHeight, srcWidth, srcHeight)
    this.__vShader = __gl.createShader(__gl.VERTEX_SHADER)!
    __gl.shaderSource(
      this.__vShader,
      `attribute vec2 position;
      varying vec2 vPosition;
       void main(){
         vPosition=position;
         gl_Position=vec4(position,0,1);
      }`
    )
    BasicGPUFilter._compileAndCheckStatus(this.gl, this.__vShader)
    this.__fShader = __gl.createShader(__gl.FRAGMENT_SHADER)!
    __gl.shaderSource(this.__fShader, this.__getFragmentShaderSource())
    BasicGPUFilter._compileAndCheckStatus(this.gl, this.__fShader)
    this.__program = __gl.createProgram()!
    __gl.attachShader(this.__program, this.__fShader)
    __gl.attachShader(this.__program, this.__vShader)
    __gl.linkProgram(this.__program)
    if (__gl.getProgramInfoLog(this.__program)) {
      throw new Error('LINK FAILED')
    }
  }
  protected __setupProgram(): void {
    this.gl.useProgram(this.__program)
    // 各フィルタの共通の変数をセット
    const pLoc = this.gl.getAttribLocation(this.__program, 'position')
    this.gl.enableVertexAttribArray(pLoc)
    this.gl.vertexAttribPointer(pLoc, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.uniform1f(this.__getUniformLocation('dstWidth'), this.dstWidth)
    this.gl.uniform1f(this.__getUniformLocation('dstHeight'), this.dstHeight)
    this.gl.uniform1f(this.__getUniformLocation('srcWidth'), this.srcWidth)
    this.gl.uniform1f(this.__getUniformLocation('srcHeight'), this.srcHeight)
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.inputTexture)
    this.gl.uniform1i(this.__getUniformLocation('source'), 0)
    this.__applyUniformValues()
  }

  protected __getUniformLocation(valName: string): WebGLUniformLocation {
    if (!this.__uLocations[valName]) {
      this.__uLocations[valName] = this.gl.getUniformLocation(
        this.__program,
        valName
      )!
    }
    return this.__uLocations[valName]
  }

  protected abstract __getFragmentShaderSource(): string

  protected abstract __applyUniformValues(): void
}

export class SobelFilter extends BasicGPUFilter {
  protected __getFragmentShaderSource(): string {
    return `precision mediump float;
    uniform float dstWidth;
    uniform float dstHeight;
    uniform sampler2D source;
    uniform float kernel[9];
    uniform float kernel2[9];
    varying vec2 vPosition;
    float toSimpleGrayScale(vec4 c){
      return length(c.rgb)/1.732;
    }
    void main(){
      vec2 uv = (vPosition + vec2(1))/2.0;
      vec2 px = vec2(1.0/dstWidth,1.0/dstHeight);
      float c11 = toSimpleGrayScale(texture2D(source, uv - px)); // top left
      float c12 = toSimpleGrayScale(texture2D(source, vec2(uv.x, uv.y - px.y))); // top center
      float c13 = toSimpleGrayScale(texture2D(source, vec2(uv.x + px.x, uv.y - px.y))); // top right
      float c21 = toSimpleGrayScale(texture2D(source, vec2(uv.x - px.x, uv.y) )); // mid left
      float c22 = toSimpleGrayScale(texture2D(source, uv)); // mid center
      float c23 = toSimpleGrayScale(texture2D(source, vec2(uv.x + px.x, uv.y) )); // mid right
      float c31 = toSimpleGrayScale(texture2D(source, vec2(uv.x - px.x, uv.y + px.y) )); // bottom left
      float c32 = toSimpleGrayScale(texture2D(source, vec2(uv.x, uv.y + px.y) )); // bottom center
      float c33 = toSimpleGrayScale(texture2D(source, uv + px )); // bottom right
      float dx = c11 * kernel[0] + c12 * kernel[1] + c22 * kernel[2] + c21 * kernel[3] + c22 * kernel[4] + c23 * kernel[5] + c31 * kernel[6] + c32 * kernel[7] + c33 * kernel[8];
      float dy = c11 * kernel2[0] + c12 * kernel2[1] + c22 * kernel2[2] + c21 * kernel2[3] + c22 * kernel2[4] + c23 * kernel2[5] + c31 * kernel2[6] + c32 * kernel2[7] + c33 * kernel2[8];
      float dxdy = dx * dx + dy*dy;
      gl_FragColor.rgb = vec3(1. - step(dxdy,0.3));
      gl_FragColor.a = 1.0;
    }`
  }
  protected __applyUniformValues(): void {
    this.gl.uniform1fv(
      this.__getUniformLocation('kernel'),
      new Float32Array([-1, 0, 1, -2, 0, 2, -1, 0, 1])
    )
    this.gl.uniform1fv(
      this.__getUniformLocation('kernel2'),
      new Float32Array([1, 2, 1, 0, 0, 0, -1, -2, -1])
    )
    return
  }
}

export class BinaryFilter extends BasicGPUFilter {
  protected __getFragmentShaderSource(): string {
    return `precision mediump float;
    uniform float dstWidth;
    uniform float dstHeight;
    uniform sampler2D source;
    varying vec2 vPosition;
    void main(){
      vec2 uv = (vPosition + vec2(1))/2.0;
      vec4 color = texture2D(source,uv);
      bool isBlack = length(color.rgb)/1.73 < 0.5;
      gl_FragColor = isBlack ? vec4(0,0,0,1) : vec4(1,1,1,1);      
    }`
  }
  protected __applyUniformValues(): void {
    return
  }
}
