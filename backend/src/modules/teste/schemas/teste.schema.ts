import { z } from "zod"

export const inserirMensagemSchema = 
  z
  .string()
  .toLowerCase()
  .regex(/^[a-zA-Z]+$/, "Só é aceito letras de A-Z")