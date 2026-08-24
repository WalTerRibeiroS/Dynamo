export type DomainCode =
  | 'INVALID_TYPE'
  | 'MIN_LENGTH'
  | 'MAX_LENGTH'
  | 'CUSTOM_VALIDATION'
  | 'INVALID_ELEMENT'
  | 'INVALID_FORMAT'
  | 'INVALID_KEY'
  | 'INVALID_UNION'
  | 'INVALID_VALUE'
  | 'NOT_MULTIPLE_OF'
  | 'UNRECOGNIZED_KEYS'
  | 'RATE_LIMITED'

export type Issue = {
  field?: string
  message: string
  code?: DomainCode
}

//code, posso mandar um INVALID_VALUE com o campo, e ja realcar em vermelho junto com a message

/*testes ficam mais faceis
expect(response.body.issues[0].message).toBe("Senha deve ter no mínimo 8 caracteres")

com:

expect(response.body.issues[0].code).toBe("MIN_LENGTH")
*/
