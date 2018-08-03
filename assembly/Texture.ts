import 'allocator/tlsf'
import { console } from './console'
import { debug } from './debug'

export class U8_4 {
  public static defaultCache: U8_4 = new U8_4(0, 0, 0, 0)
  /**
   * 無駄にnewしないでいいものは共有キャッシュを使うべき
   * @param x
   * @param y
   * @param z
   * @param w
   */
  public static useCache(x: u8, y: u8, z: u8, w: u8): U8_4 {
    U8_4.defaultCache.x = x
    U8_4.defaultCache.y = y
    U8_4.defaultCache.z = z
    U8_4.defaultCache.w = w
    return U8_4.defaultCache
  }
  constructor(public x: u8, public y: u8, public z: u8, public w: u8) {}
}

/**
 * テクスチャを表現するためのクラス
 */
export class Texture4CH {
  public baseAddress: u32 = 0

  public width: u32 = 0

  public height: u32 = 0

  public maxAddress: u32 = 0

  constructor(width: u32, height: u32) {
    let size: u32 = width * height * 4
    this.baseAddress = memory.allocate(size)
    this.maxAddress = this.baseAddress + size
    this.width = width
    this.height = height
  }

  public getAddressAt(i: u32, j: u32): u32 {
    return (i * this.width + j) * 4 + this.baseAddress
  }

  public release(): void {
    memory.free(this.baseAddress)
  }

  public getAt(i: u32, j: u32): U8_4 {
    let ba: u32 = this.getAddressAt(i, j)
    let dc: U8_4 = U8_4.defaultCache
    dc.x = load<u8>(ba, 0)
    dc.y = load<u8>(ba, 1)
    dc.z = load<u8>(ba, 2)
    dc.w = load<u8>(ba, 3)
    return dc
  }

  public getAtRaw(i: u32, j: u32, c: u32): u8 {
    let ba: u32 = this.getAddressAt(i, j)
    return <u8>load<u8>(ba + c)
  }

  public setAt(i: u32, j: u32, col: U8_4): void {
    let ba: u32 = this.getAddressAt(i, j)
    store<u8>(ba, col.x, 0)
    store<u8>(ba, col.y, 1)
    store<u8>(ba, col.z, 2)
    store<u8>(ba, col.w, 3)
  }

  public setAtRaw(i: u32, j: u32, c0: u8, c1: u8, c2: u8, c3: u8): void {
    let ba: u32 = this.getAddressAt(i, j)
    store<u8>(ba, c0, 0)
    store<u8>(ba, c1, 1)
    store<u8>(ba, c2, 2)
    store<u8>(ba, c3, 3)
  }

  public setAtRawCH(i: u32, j: u32, c: u32, v: u8): void {
    let ba: u32 = this.getAddressAt(i, j)
    store<u8>(ba + c, v)
  }

  public logTexture(key: u32): void {
    debug.logTexture(key, this.width, this.height, this.baseAddress)
  }
}
