// backend/src/routes/client.routes.ts

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, ClientStatus, Prisma } from '@prisma/client';
import {
  createClientSchema,
  CreateClientInput,
  updateClientSchema,
  clientParamsSchema,
} from '../schemas/client.schema';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

async function clientRoutes(fastify: FastifyInstance) {

  // Rota para CRIAR um novo cliente (POST /)
  fastify.post('/', async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const validatedBody = createClientSchema.parse(request.body) as CreateClientInput;
      const { name, email, status } = validatedBody;

      const existingClient = await prisma.client.findUnique({
        where: { email },
      });

      if (existingClient) {
        return reply.status(409).send({ message: 'Email já cadastrado.' });
      }

      const newClient = await prisma.client.create({
        data: {
          name,
          email,
          status: status as ClientStatus,
        },
      });
      return reply.status(201).send(newClient);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos.', errors: error.format() });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao criar cliente.' });
    }
  });

  // Rota para LISTAR todos os clientes (GET /)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const clients = await prisma.client.findMany();
      return reply.status(200).send(clients);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao listar clientes.' });
    }
  });

  // Rota para BUSCAR um único cliente por ID (GET /:id)
  fastify.get('/:id', async (request: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
    try {
      const { id } = clientParamsSchema.parse(request.params);
      const client = await prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }

      return reply.status(200).send(client);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'ID inválido.', errors: error.format() });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao buscar cliente.' });
    }
  });

  // Rota para EDITAR um cliente (PUT /:id)
  fastify.put('/:id', async (request: FastifyRequest<{ Body: any, Params: any }>, reply: FastifyReply) => {
    try {
      const { id } = clientParamsSchema.parse(request.params);
      const dataToUpdate = updateClientSchema.parse(request.body);

      if (Object.keys(dataToUpdate).length === 0) {
        return reply.status(400).send({ message: 'Nenhum dado fornecido para atualização.' });
      }

      const client = await prisma.client.update({
        where: { id },
        data: dataToUpdate,
      });

      return reply.status(200).send(client);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'Dados inválidos.', errors: error.format() });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao atualizar cliente.' });
    }
  });

  // Rota para DELETAR um cliente (DELETE /:id)
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: any }>, reply: FastifyReply) => {
    try {
      const { id } = clientParamsSchema.parse(request.params);

      await prisma.client.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(400).send({ message: 'ID inválido.', errors: error.format() });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return reply.status(404).send({ message: 'Cliente não encontrado.' });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno ao deletar cliente.' });
    }
  });
}

export default clientRoutes;