import fastifyPlugin from "fastify-plugin";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import ConnectSessionSequelize from "connect-session-sequelize";

async function session(fastify, opts) {
  fastify.register(fastifyCookie);

  const SequelizeStore = ConnectSessionSequelize(fastifySession.Store);

  fastify.register(fastifySession, {
    cookieName: "sessionId",
    secret: "a secret with minimum length of 32 characters",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 1000,
      expires: Date.now() + 60 * 1000,
    },
    expires: Date.now() + 60 * 1000,
    saveUninitialized: false, // don't create session until something stored
    store: new SequelizeStore({
      db: fastify.sequelize,
      table: "Sessions",
      checkExpirationInterval: 5 * 60 * 1000, // check for expired sessions every 5 minutes and delete them
    }),
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      if (!request.session.userId) {
        throw new Error("No user logged in");
      }
      const User = request.server.User;
      const user = await User.findByPk(request.session.userId);
      console.log(request.session.userId);

      if (!user) throw new Error("No user logged in");

      request.user = user;

      return;
    } catch (error) {
      console.log(error.message);

      if (error.message === "No user logged in")
        reply.code(401).send({ error: "Unauthorized" });
      else
        reply.code(500).send({
          error: "Internal Server Error",
          msg: error.message,
        });
    }
  });

  fastify.decorate("authorize", async function (request, reply) {
    try {
      if (request.user.id != request.body.userId)
        throw new Error("Unauthorized");

      return;
    } catch (error) {
      console.log(error.message);
      if (error.message === "Unauthorized")
        reply
          .code(401)
          .send({ error: "Unauthorized", msg: "This is not your post" });
      else
        reply.code(500).send({
          error: "Internal Server Error",
          msg: error.message,
        });
    }
  });
}

export default fastifyPlugin(session);
