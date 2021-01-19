import fs from 'fs'
import { assert } from 'chai'

export function hexByteStringToString(data: string): string {
  assert(data.startsWith(`0x`), `Data is not hex string. It should start with '0x'`)
  return Buffer.from(data.replace('0x', ''), 'hex').toString()
}

export function lookupGlobPattern(abiPath: string): number {
  // Look for glob pattern
  let index = abiPath.indexOf(`**/*.`)
  // Try again: look for path/to/*. pattern
  index = index === -1 ? abiPath.indexOf(`*.`) : index
  return index
}

export function checkProvidedPath(p: string): void {
  if (!fs.existsSync(p)) throw Error(`Provided path does not exists: ${p}.`)
}
