import BN from 'bn.js'
import Debug from 'debug'
import { EvmType, parseEvmType } from 'typechain'
import { SubstrateEvent } from '@dzlzv/hydra-common'

import decoder from './decoder'
import { TSFixMe, TypedEvent } from './types'

const debug = Debug(`evm-typegen:conversion`)

export function valueConversion(evmType: EvmType, value: TSFixMe): string | BN {
  return evmType.type === 'uinteger' || evmType.type === 'integer' ? new BN(value) : value
}

export function generateTypedEvent<T>(event: SubstrateEvent): T {
  debug(`Substrate event params: ${event.params}`)

  const data = decoder.decodeLogs(event.params)
  const decodedEvmLog = data[0]

  const typedEvent: TypedEvent = { name: decodedEvmLog.name, args: {} }

  decodedEvmLog.events.map(({ name, type, value }, index) => {
    const v = valueConversion(parseEvmType(type), value)
    typedEvent.args[name] = v
    typedEvent.args[index] = v
  })

  return (event as unknown) as T
}
