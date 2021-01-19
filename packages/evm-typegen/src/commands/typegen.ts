import path from 'path'
import dotenv from 'dotenv'
import { tsGenerator } from 'ts-generator'
import { Command, flags } from '@oclif/command'
import { TypeChain } from 'typechain/dist/TypeChain'

import { lookupGlobPattern, checkProvidedPath } from '../utils'

const TYPECHAIN_TARGET = 'truffle-v5'

export default class Typegen extends Command {
  static description = 'Generate types from solidity contract ABIs'

  static flags = {
    help: flags.help({ char: 'h' }),
    abi: flags.string({
      char: 'a',
      description:
        'Path to a contract abi file or pattern that will be used to find ABIs. (Remember about adding quotes for pattern, example: "./abis/**/*.json")',
    }),
    outdir: flags.string({
      char: 'o',
      description: 'Path for generated types',
      default: 'generated/evm/types',
    }),
  }

  async run() {
    dotenv.config()
    const { abi, outdir } = this.parse(Typegen).flags
    const abis = path.resolve(process.cwd(), abi || process.env.CONTRACT_ABIS!)

    const index = lookupGlobPattern(abis)
    // Check if provided path exists. If pattern is provided we check folder existance
    index === -1 ? checkProvidedPath(abis) : checkProvidedPath(abis.slice(0, index))

    const cwd = process.cwd()
    await tsGenerator(
      { cwd },
      new TypeChain({
        cwd,
        rawConfig: {
          files: abis,
          outDir: process.env.OUTPUT_DIR || outdir,
          target: TYPECHAIN_TARGET,
        },
      })
    )
  }
}
