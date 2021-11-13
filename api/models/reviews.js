const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Reviews = sequelize.define(
    "reviews",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      from_user_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      to_user_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      call_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      ratingEmotion: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      tags: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP")
      }
    },
    {
      sequelize,
      tableName: "reviews",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }]
        }
      ]
    }
  );

  Reviews.associate = function (models) {
    Reviews.belongsTo(models.users, {
      foreignKey: "toId",
      as: "recipient",
      onDelete: "CASCADE",
    });
    Reviews.belongsTo(models.users, {
        foreignKey: "fromID",
        as: "sender",
        onDelete: "CASCADE",
      });
  };

  return Reviews;
};
