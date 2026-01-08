export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'

export interface NormalizedOperation {
  method: HttpMethod
  path: string
  operationId?: string
}

export interface NormalizedSpec {
  operations: NormalizedOperation[]
}
