/* eslint-disable @typescript-eslint/naming-convention */
import { SubstrateEvent } from '@dzlzv/hydra-common'

/**
 * Query for fetching events
 *  - strictly after event with IDs > afterID (if present)
 *  - with name in names
 *  - block between fromBlock and toBlock (inclusive)
 */
export interface EventQuery {
  id_gt?: string
  names: string[]
  block_gte: number
  block_lte: number
}

export interface IProcessorSource {
  nextBatch(query: EventQuery, limit: number): Promise<SubstrateEvent[]>

  indexerHead(): Promise<number>

  subscribe(events: string[]): Promise<void>
}
