/* eslint-disable @typescript-eslint/naming-convention */

export interface ScalarType {
  [name: string]: string
}

// Supported built-in scalar types and corressponding warthog type
export const availableTypes: ScalarType = {
  ID: 'string',
  String: 'string',
  Int: 'int',
  Boolean: 'bool',
  DateTime: 'date',
  Float: 'float',
  BigInt: 'numeric',
  BigDecimal: 'decimal',
  Bytes: 'bytes',
}
