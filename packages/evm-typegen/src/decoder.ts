import path from 'path'
import glob from 'glob'
import Debug from 'debug'
import dotenv from 'dotenv'
import { EventParam } from '@dzlzv/hydra-common'

import { ABI } from './ABI'
import { DecodedEvmLog, EventArg, TSFixMe } from './types'
import { lookupGlobPattern, checkProvidedPath } from './utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abiDecoder = require('abi-decoder')

const debug = Debug(`evm-typegen:decoder`)

class Decoder {
  private readonly _decoder: TSFixMe
  private _abis: string

  constructor(abis?: string) {
    dotenv.config()

    if (!abis && !process.env.CONTRACT_ABIS) {
      throw Error(
        `Cannot contract Decoder without ABIs. You must provide "CONTRACT_ABIS" env variable or pass "abis" argument to constructor`
      )
    }
    this._abis = abis || process.env.CONTRACT_ABIS!
    this._decoder = abiDecoder
    this._loadABIs()
  }

  private _loadABIs() {
    const index = lookupGlobPattern(this._abis)

    // Check if provided path exists. If pattern is provided we check folder existance
    if (index === -1) {
      checkProvidedPath(this._abis)
      const abi = ABI.load(this._abis, this._abis)
      this._decoder.addABI(abi.data)
    } else {
      const baseDirName = this._abis.slice(0, index)
      checkProvidedPath(baseDirName)

      const pattern = this._abis.slice(index)
      const matchedGlob = new glob.GlobSync(pattern, { cwd: baseDirName })

      for (const entry of matchedGlob.found) {
        const abi = ABI.load(entry, path.join(baseDirName, entry))
        this._decoder.addABI(abi.data)
      }
    }
  }

  decodeLogs(evmLogs: EventParam[]): DecodedEvmLog[] {
    debug(`Emv Logs: ${JSON.stringify(evmLogs)}`)

    const logs = this._decoder.decodeLogs(evmLogs) as Array<TSFixMe>
    // Filter events those decoding failed for
    const decodingFailed = logs.filter((log) => log === undefined)
    if (decodingFailed.length) {
      throw Error(
        `Could not decode EvmLogs: ${JSON.stringify(logs)}. Maybe contract ABI is not registered to the decoder.
        Make sure all the ABIs for the corresponding events are available at the location that "CONTRACT_ABIS" env variable points to.`
      )
    }
    return logs
  }

  eventName(log: DecodedEvmLog): string {
    return log.name
  }

  eventArgs(log: DecodedEvmLog): EventArg[] {
    return log.events
  }

  getABIs() {
    return this._decoder.getABIs()
  }
}

export default new Decoder()
