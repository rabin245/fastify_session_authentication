const userModel = (sequelize, DataTypes) => {
  return sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING(255),
    password: DataTypes.STRING(255),
  });
};

export default userModel;
