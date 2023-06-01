import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export default async function (fastify, optns) {
  fastify.get("/auth/login/github/callback", async (request, reply) => {
    try {
      const token =
        await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );
      console.log("testing \n\n\n", token);
      request.session.token = token;
      reply.redirect("/auth/login/github/verifyAccessToken");
    } catch (err) {
      console.log(err);
    }
  });

  fastify.get(
    "/auth/login/github/verifyAccessToken",
    async function (request, reply) {
      const accessToken = request.session.token.access_token;
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      try {
        const response = await axios.post(
          `https://api.github.com/applications/${clientId}/token`,
          { access_token: accessToken },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                clientId + ":" + clientSecret
              ).toString("base64")}`,
            },
          }
        );

        const { login, id } = response.data.user;
        const username = `${login}:${id}`;

        const user = await fastify.User.findOrCreate({
          where: { username: username },
          defaults: { username: username, password: id },
        });

        console.log("helols ljklsdf \n\n", user[0].id);
        request.session.userId = user[0].id;

        // reply.send(response.data);
        reply.redirect("/posts");
      } catch (error) {
        reply.send(error);
      }
    }
  );
}
