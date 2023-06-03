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
      console.log(
        "testing to see if the token is set: \n\n ",
        request.session.token
      );
      reply.redirect("/auth/login/github/verifyAccessToken");
    } catch (err) {
      console.log(err);
    }
  });

  fastify.get(
    "/auth/login/github/verifyAccessToken",
    async function (request, reply) {
      console.log(
        "testing to see the session token here: \n\n ",
        request.session.token
      );

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
        // reply.redirect("/posts");
        // reply.redirect("/");
        reply.redirect("http://localhost:5173");
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.get("/auth/login/google/callback", async (request, reply) => {
    try {
      const token =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      console.log("testing \n\n\n", token);
      request.session.token = token;
      console.log(
        "testing to see if session token is set: \n\n",
        request.session.token
      );
      reply.redirect("/auth/login/google/verifyAccessToken");
      // reply.redirect("/");
    } catch (error) {
      console.log(error);
    }
  });

  fastify.get(
    "/auth/login/google/verifyAccessToken",
    async function (request, reply) {
      console.log("tseting for undefined token: \n\n\n", request.session.token);
      const accessToken = request.session.token.access_token;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      console.log(
        "testing123hhhhhhhhhhhhhhhh \n\n\n",
        accessToken,
        clientId,
        clientSecret
      );

      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { given_name, family_name, id } = response.data;
        const username = `${given_name}_${family_name}:${id}`;

        const user = await fastify.User.findOrCreate({
          where: { username: username },
          defaults: { username: username, password: id },
        });

        request.session.userId = user[0].id;

        // reply.send(response.data);
        // reply.redirect("/posts");
        reply.redirect("http://localhost:5173");
      } catch (error) {
        reply.send(error);
      }
    }
  );
}
