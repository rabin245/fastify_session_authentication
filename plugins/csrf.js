import fastifyPlugin from "fastify-plugin";
import fastifyCsrfProtection from "@fastify/csrf-protection";

async function csrf(fastify, opts) {
  fastify.register(fastifyCsrfProtection, {
    // getToken: (req) => {
    //   return req.headers["csrf-token"];
    // },
    getToken: (req) => {
      return req.session.csrfToken;
    },
  });
}

export default fastifyPlugin(csrf);
