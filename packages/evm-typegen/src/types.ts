// A type to keep track of the 'any'
export type TSFixMe = any

export interface EvmLog {
  address: string
  topics: string[]
  data: string
}

export interface EventArg {
  name: string
  type: string
  value: TSFixMe
}

export interface DecodedEvmLog {
  name: string
  address: string
  events: EventArg[]
}

export interface TypedEvent {
  name: string
  args: { [key: string]: TSFixMe }
}
