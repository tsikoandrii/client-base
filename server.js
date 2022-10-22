const fs = require('fs');
const path = require('path')
const fastify = require('fastify')({ logger: true });

// Plugins
fastify.register(require('@fastify/cors'), {})
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '/client'),
  prefix: '',
})

// html
fastify.get('/', async (request, reply) => {
  return reply.sendFile('index.html')
});

// Api endpoint
fastify.get('/api/', (request, reply) => {
  fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) {
      console.log('File read failed:', err);
      return;
    }

    if(request.query.term) {
      const result = JSON.parse(data).filter((elem)=> elem.name.toLowerCase().search(request.query.term.toLowerCase()) !== -1);
      reply.send(JSON.stringify(result));
    }
    else {
      reply.send(data);
    }

  })
});

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
