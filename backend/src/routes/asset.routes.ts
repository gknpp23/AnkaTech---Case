import { FastifyInstance } from 'fastify';

// Lista fixa de ativos financeiros com valores estáticos, conforme solicitado no case 
const fixedAssets = [
  { name: "Ação XYZ", value: 150.75 },
  { name: "Fundo ABC", value: 320.50 },
  { name: "Tesouro Direto 2045", value: 130.22 },
  { name: "Cripto Moeda X", value: 54321.00 },
];

async function assetRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    // Apenas retorna a lista de ativos com um status 200 OK
    return reply.status(200).send(fixedAssets);
  });
}

export default assetRoutes;