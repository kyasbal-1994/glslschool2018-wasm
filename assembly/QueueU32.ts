import { console } from './console'

/**
 * Queueの実装(幅優先探索用)
 */
export class Queue {
  /**
   * 要素の配列
   */
  public elements: u32[]
  /**
   * Queue内の最も要素が若いindex
   */
  public head: i32 = 0
  /**
   * Queueないのもっとも古いindex
   */
  public tail: i32 = -1

  constructor(initialSize: u32) {
    this.elements = new Array<u32>(initialSize)
  }

  /**
   * 新しい値の追加
   * @param val
   */
  public add(val: u32): void {
    this.tail++
    this.elements[this.tail] = val
  }

  public size(): u32 {
    return this.tail - this.head + 1
  }
  /**
   * 次があるかどうか
   */
  public next(): bool {
    let hasNext = this.tail - 1 >= this.head
    if (hasNext) {
      this.tail--
      return true
    }
    return false
  }

  public current(): u32 {
    if (this.tail < 0) {
      return 0 // TODO: We might need to introduce exception handling here
    }
    return this.elements[this.tail]
  }

  public clear(): void {
    this.tail = -1
  }
}
