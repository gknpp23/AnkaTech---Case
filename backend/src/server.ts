import Fastify from 'fastify';
import clientRoutes from './routes/client.routes'; // Importa nossas rotas de cliente
import assetRoutes from './routes/asset.routes';

const server = Fastify({
  logger: true, // Mantém o logger habilitado
});

// Rota de exemplo 
server.get('/', async (request, reply) => {
  return { hello: 'world from AnkaTech Case API' };
});

// Registra as rotas de cliente com um prefixo
server.register(clientRoutes, { prefix: '/api/v1/clients' }); // Todas as rotas em client.routes.ts terão /api/v1/clients na frente


// Registra as rotas de ativos
server.register(assetRoutes, { prefix: '/api/v1/assets' });

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
    await server.listen({ port: port, host: '0.0.0.0' });
    // A mensagem de log já é feita pelo Fastify quando logger: true
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();