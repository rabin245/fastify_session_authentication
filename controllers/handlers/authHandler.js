export default {
  login: async (request, reply) => {
    const User = request.server.User;
    const { username, password } = request.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user)
        reply.code(404).send({ error: "Incorrect username or password" });

      if (user.password !== password)
        reply.code(401).send({ error: "Incorrect username or password" });

      request.session.userId = user.id;

      reply.send({ message: "Login Success" });
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        error: "Internal Server Error",
        msg: error.message,
      });
    }
  },
  signup: async (request, reply) => {
    const User = request.server.User;
    const { username, password } = request.body;

    try {
      const user = await User.findOne({ where: { username } });
      if (user) reply.code(409).send({ error: "User already exists" });

      const newUser = await User.create({ username, password });

      reply.send({ message: "Signup Success", user: newUser });
    } catch (error) {
      console.log(error);
      reply.code(500).send({
        error: "Internal Server Error",
        msg: error.message,
      });
    }
  },
  logout: async (request, reply) => {
    try {
      if (!request.session.userId) throw new Error("No user logged in");

      // destroys session in store
      await request.session.destroy();

      reply.send({ message: "Logout Success" });
    } catch (error) {
      console.log(error.message);

      if (error.message === "No user logged in")
        reply.code(401).send({ error: error.message });
      else
        reply.code(500).send({
          error: "Internal Server Error",
          msg: error.message,
        });
    }
  },
};
