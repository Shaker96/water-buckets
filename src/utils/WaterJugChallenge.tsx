// Based on https://github.com/foqc/WaterJugRiddleJS 
// adapted to typescript, fixed a bug in smallToLarge fn and added isFeasible fn

import gcd from './gratestCommonDivisor'

let maxLarge = 1
let maxSmall = 1

export type Buckets = {
  large: number,
  small: number,
  expl?: string
}

const fillBucket = (buckets: Buckets, key = 'large', max = maxLarge) => ({ ...buckets, [key]: max, expl: `Fill bucket ${key}` })

const emptyBucket = (buckets: Buckets, key = 'large') => ({ ...buckets, [key]: 0, expl: `Dump bucket ${key}` })

const largeToSmall = ({ large, small }: Buckets) => {
  const quantityNeededToFillSmall = maxSmall - small

  return {
    large: large > quantityNeededToFillSmall
      ? large - quantityNeededToFillSmall : 0,
    small: large > quantityNeededToFillSmall
      ? small + quantityNeededToFillSmall : small + large,
    expl: `Transfer bucket large to bucket small`
  }
}

const smallToLarge = ({ large, small }: Buckets) => {
  const quantityNeededToFillLarge = maxLarge - large

  return {
    large: small > quantityNeededToFillLarge
      ? large + quantityNeededToFillLarge : small + large,
    small: small > quantityNeededToFillLarge
      ? small - quantityNeededToFillLarge : 0,
    expl: `Transfer bucket small to bucket large`
  }
}

const isRepeated = (path: Buckets[], { large, small }: Buckets) =>
  !!path.find(x => x.small === small && x.large === large)

const isFeasable = (buckets: Buckets, target: number) => {
  if (buckets.large < target && buckets.small < target) {
    return false
  }

  // check if target is divisible by the greatest common divisor of the buckets
  let gcd_res = gcd(buckets.large, buckets.small)
  if (target % gcd_res !== 0) {
    return false
  }

  return true
}

export default function getShortestPath(buckets: Buckets, target: number) {
  maxLarge = buckets.large
  maxSmall = buckets.small

  if (!isFeasable(buckets, target)) {
    return 'No Solution'
  }

  const queue: Buckets[][] = []
  const path: Buckets[] = []

  path.push({ large: 0, small: 0 })
  queue.push(path)

  while (queue.length) {
    const lastPath = queue.shift()

    if (!lastPath || !lastPath.length) return null

    const lastState = lastPath[lastPath.length - 1]

    if (target === lastState.large || target === lastState.small)
      return lastPath

    const states = new Set([fillBucket(lastState), fillBucket(lastState, 'small', maxSmall),
    largeToSmall(lastState), smallToLarge(lastState), emptyBucket(lastState), emptyBucket(lastState, 'small')])

    for (let item of states) {
      if (!isRepeated(lastPath, item)) {
        const newPath = [...lastPath]
        newPath.push(item)
        queue.push(newPath)
      }
    }
  }

  return null
}
