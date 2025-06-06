import Fastify from 'fastify';
import cors from '@fastify/cors'; // 1. IMPORTE O PLUGIN CORS
import clientRoutes from './routes/client.routes';
import assetRoutes from './routes/asset.routes';

const server = Fastify({
  logger: true,
});


// Configuração de CORS.
server.register(cors, {
  origin: "http://localhost:3000", // Permite requisições vindas desta origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define os métodos HTTP permitidos
});

// Rota de exemplo
server.get('/', async (request, reply) => {
  return { hello: 'world from AnkaTech Case API' };
});

// Registra as rotas de cliente com um prefixo
server.register(clientRoutes, { prefix: '/api/v1/clients' });

// Registra as rotas de ativos
server.register(assetRoutes, { prefix: '/api/v1/assets' });

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
    await server.listen({ port: port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();