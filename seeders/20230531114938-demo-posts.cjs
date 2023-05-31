"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("posts", [
      {
        title: "Post 1",
        content: "Content 1",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Post 2",
        content: "Conrent 2",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Post 3",
        content: "Content 3",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Post 4",
        content: "Conrent 4",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
