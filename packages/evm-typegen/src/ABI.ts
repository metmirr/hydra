import fs from 'fs'
import path from 'path'

import { TSFixMe } from './types'

export class ABI {
  public readonly name: string
  public readonly file: string
  public readonly data: Array<TSFixMe>

  constructor(name: string, file: string, data: Array<TSFixMe>) {
    this.name = name
    this.file = file
    this.data = data
  }

  static normalized(json: TSFixMe): undefined | Array<TSFixMe> {
    if (Array.isArray(json)) {
      return json
    } else if (json.abi !== undefined) {
      return json.abi
    } else if (json.compilerOutput !== undefined && json.compilerOutput.abi !== undefined) {
      return json.compilerOutput.abi
    } else {
      return undefined
    }
  }

  static load(name: string, file: string): ABI {
    let data: TSFixMe
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    } catch (error) {
      throw Error(`JSON parsing failed for: ${file}`)
    }

    const abi = ABI.normalized(data)

    if (abi === null || abi === undefined) {
      throw Error(`No valid ABI in file: ${path.relative(process.cwd(), file)}`)
    }
    return new ABI(name, file, abi)
  }
}
