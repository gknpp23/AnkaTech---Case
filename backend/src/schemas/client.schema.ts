import { z } from 'zod';

// Reutilizando o enum ClientStatus que você deve ter no seu schema.prisma
// Se você exportá-lo do @prisma/client, melhor ainda.
// Por agora, vamos definir aqui para o Zod.
export const clientStatusEnum = z.enum(['ATIVO', 'INATIVO']);

export const createClientSchema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório.',
    invalid_type_error: 'Nome deve ser uma string.',
  }).min(3, { message: 'Nome deve ter no mínimo 3 caracteres.' }),
  email: z.string({
    required_error: 'Email é obrigatório.',
  }).email({ message: 'Email inválido.' }),
  status: clientStatusEnum.optional().default('ATIVO'), // Opcional no payload, padrão ATIVO
});

// Tipo inferido a partir do schema para usar no TypeScript
export type CreateClientInput = z.infer<typeof createClientSchema>;

// Adicionar schemas para update, params (ID), etc. aqui depois
// export const updateClientSchema = createClientSchema.partial(); // Exemplo: todos os campos opcionais
// export const clientIdSchema = z.object({
//   id: z.string().refine((val) => !isNaN(parseInt(val, 10)), { message: "ID deve ser um número" })
// });

// ... (no final do arquivo)

// Schema para os dados que podem ser atualizados no corpo da requisição
export const updateClientSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  status: clientStatusEnum.optional(),
});

// Schema para validar o parâmetro 'id' da URL
export const clientParamsSchema = z.object({
  id: z.string().transform((val) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      throw new Error("ID deve ser um número.");
    }
    return parsed;
  }),
});