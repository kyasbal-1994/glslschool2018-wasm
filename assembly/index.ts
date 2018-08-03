import { console } from './console'
import { Texture4CH, U8_4 } from './Texture'
import { Queue } from './QueueU32'
import { debug } from './debug'

let lineDetectionTarget: Texture4CH = new Texture4CH(1, 1)
let lineDetectionWorkingMemory: Texture4CH = new Texture4CH(1, 1)
let lineDetectionResult: Texture4CH = new Texture4CH(1, 1)
// Queue for BFS
let xQueue: Queue = new Queue(256)
let yQueue: Queue = new Queue(256)
// Queue for checking size
let xPassedQueue: Queue = new Queue(256)
let yPassedQueue: Queue = new Queue(256)

let threshold: u32 = 100
let lineCount: u32 = 0

function mix(a: f32, b: f32, v: f32): f32 {
  return (1 - v) * a + v * b
}

function setHSV(i: u32, j: u32, H: f32, S: f32, V: f32): void {
  let V2: f32 = V * (1 - S)
  var r: f32 =
    (H >= 0 && H <= 60) || (H >= 300 && H <= 360)
      ? V
      : H >= 120 && H <= 240
        ? V2
        : H >= 60 && H <= 120
          ? mix(V, V2, (H - 60) / 60)
          : H >= 240 && H <= 300
            ? mix(V2, V, (H - 240) / 60)
            : 0
  var g: f32 =
    H >= 60 && H <= 180
      ? V
      : H >= 240 && H <= 360
        ? V2
        : H >= 0 && H <= 60
          ? mix(V2, V, H / 60)
          : H >= 180 && H <= 240
            ? mix(V, V2, (H - 180) / 60)
            : 0
  var b: f32 =
    H >= 0 && H <= 120
      ? V2
      : H >= 180 && H <= 300
        ? V
        : H >= 120 && H <= 180
          ? mix(V2, V, (H - 120) / 60)
          : H >= 300 && H <= 360
            ? mix(V, V2, (H - 300) / 60)
            : 0
  lineDetectionResult.setAtRawCH(i, j, 0, <u8>(255 * r))
  lineDetectionResult.setAtRawCH(i, j, 1, <u8>(255 * g))
  lineDetectionResult.setAtRawCH(i, j, 2, <u8>(255 * b))
}

/**
 * 指定したピクセルが線として認識されているか
 * @param i
 * @param j
 */
function isTarget(i: u32, j: u32): bool {
  return lineDetectionTarget.getAtRaw(i, j, 0) > 0
}
/**
 * 指定されたピクセルが探索されたかどうか
 * @param i
 * @param j
 */
function isProcessed(i: u32, j: u32): boolean {
  return lineDetectionWorkingMemory.getAtRaw(i, j, 0) > 0
}
/**
 * 指定したピクセルを探索したとする
 * @param i
 * @param j
 */
function setProceed(i: u32, j: u32): void {
  lineDetectionWorkingMemory.setAtRawCH(i, j, 0, 255)
}

//テクスチャの範囲か
function inTextureRange(i: u32, j: u32): bool {
  return (
    i >= 0 &&
    i < lineDetectionTarget.width &&
    j >= 0 &&
    j < lineDetectionTarget.height
  )
}

function enqueue(i: u32, j: u32): void {
  xQueue.add(i)
  yQueue.add(j)
}

function solveBFS(): void {
  // ある白い点を起点に、隣接する白のピクセルを全て辿って、lineDetectionWorkingMemoryテクスチャに赤をセットする(作業済みとマーク)
  do {
    let x: u32 = xQueue.current()
    let y: u32 = yQueue.current()
    if (inTextureRange(x, y) && isTarget(x, y) && !isProcessed(x, y)) {
      //x,yがテクスチャの範囲で、作業済みでなく、白いならば
      enqueue(x + 1, y)
      enqueue(x - 1, y)
      enqueue(x, y + 1)
      enqueue(x, y - 1)
      enqueue(x + 1, y + 1)
      enqueue(x - 1, y + 1)
      enqueue(x + 1, y - 1)
      enqueue(x - 1, y - 1)
      setProceed(x, y)
      xPassedQueue.add(x)
      yPassedQueue.add(y)
    }
  } while (xQueue.next() && yQueue.next())
  xQueue.clear()
  yQueue.clear()
  if (xPassedQueue.size() > threshold) {
    //thresholdピクセル以上からなる線ならば
    do {
      let x: u32 = xPassedQueue.current()
      let y: u32 = yPassedQueue.current()
      if (inTextureRange(x, y)) {
        lineDetectionWorkingMemory.setAtRawCH(x, y, 1, 255)
        setHSV(x, y, <f32>((lineCount * 37) % 360), 1, 1)
      }
    } while (xPassedQueue.next() && yPassedQueue.next())
    lineCount++
  }
  xPassedQueue.clear()
  yPassedQueue.clear()
}

function clearWorkingMemoryAndResult(): void {
  for (let i: u32 = 0; i < lineDetectionTarget.width; i++) {
    for (let j: u32 = 0; j < lineDetectionTarget.height; j++) {
      lineDetectionWorkingMemory.setAtRaw(i, j, 0, 0, 0, 0)
      lineDetectionResult.setAtRaw(i, j, 0, 0, 0, 0)
    }
  }
}
//デバッグ用に見えるようにAチャンネルを255にする
function set4thElementTo255(): void {
  for (let i: u32 = 0; i < lineDetectionTarget.width; i++) {
    for (let j: u32 = 0; j < lineDetectionTarget.height; j++) {
      lineDetectionWorkingMemory.setAtRawCH(i, j, 3, 255)
      lineDetectionResult.setAtRawCH(i, j, 3, 255)
    }
  }
}

export function detectlines(): void {
  lineCount = 0
  for (let i: u32 = 0; i < lineDetectionTarget.width; i++) {
    for (let j: u32 = 0; j < lineDetectionTarget.height; j++) {
      if (isTarget(i, j) && !isProcessed(i, j)) {
        enqueue(i, j)
        solveBFS()
      }
    }
  }
  set4thElementTo255()
  debug.logTexture(
    100,
    lineDetectionWorkingMemory.width,
    lineDetectionWorkingMemory.height,
    lineDetectionWorkingMemory.baseAddress
  )
  debug.logTexture(
    200,
    lineDetectionResult.width,
    lineDetectionResult.height,
    lineDetectionResult.baseAddress
  )
  clearWorkingMemoryAndResult()
}

export function prepareDetectLine(width: u16, height: u16): u32 {
  if (
    lineDetectionTarget.width !== width ||
    lineDetectionTarget.height !== height
  ) {
    lineDetectionTarget.release()
    lineDetectionTarget = new Texture4CH(width, height)
    lineDetectionWorkingMemory.release()
    lineDetectionWorkingMemory = new Texture4CH(width, height)
    lineDetectionResult.release()
    lineDetectionResult = new Texture4CH(width, height)
  }
  return lineDetectionTarget.baseAddress
}
