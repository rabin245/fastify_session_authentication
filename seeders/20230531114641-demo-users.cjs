"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        username: "testuser1",
        password: "password1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testuser2",
        password: "password2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "testuser3",
        password: "password3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
