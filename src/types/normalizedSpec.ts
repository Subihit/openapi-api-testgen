export interface NormalizedOperation {
  method: string
  path: string
  operationId?: string
}

export interface NormalizedSpec {
  operations: NormalizedOperation[]
}
