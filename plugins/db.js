import fp from "fastify-plugin";
import Sequelize from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

import postModel from "../models/posts.js";
import userModel from "../models/users.js";
import sessionModel from "../models/sessionStore.js";

export default fp(async function (fastify, opts) {
  const sequelize = new Sequelize(
    process.env.PSQLDATABASE,
    process.env.PSQLUSER,
    process.env.PSQLPASSWORD,
    {
      host: process.env.PSQLHOST,
      dialect: "postgres",
    }
  );

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const Post = postModel(sequelize);
    const User = userModel(sequelize);
    const Sessions = sessionModel(sequelize);

    User.hasMany(Post, { foreignKey: "userId" });
    Post.belongsTo(User, { foreignKey: "userId" });

    fastify.decorate("Post", Post);
    fastify.decorate("User", User);

    // await User.sync({ force: true });
    // await Post.sync({ force: true });
    // await User.sync({ alter: true });
    // await Post.sync({ alter: true });
    await User.sync();
    await Post.sync();
    await Sessions.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  fastify.decorate("sequelize", sequelize);
});
