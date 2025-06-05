// backend/src/server.ts
import Fastify from 'fastify';

const server = Fastify({
  logger: true // Habilita logs, útil para debugging
});

// Rota de exemplo
server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    // A porta aqui deve ser a mesma exposta no Dockerfile e mapeada no docker-compose
    // E idealmente lida de uma variável de ambiente
    await server.listen({ port: 3333, host: '0.0.0.0' }); // '0.0.0.0' é importante para Docker
    server.log.info(`Servidor escutando na porta ${ (server.server.address() as any).port }`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();