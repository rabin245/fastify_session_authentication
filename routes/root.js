export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const token = request.session.token;
    console.log(token);
    return { root: true, token: token };
  });
}
