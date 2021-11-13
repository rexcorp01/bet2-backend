const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Calls = sequelize.define(
    "calls",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wizard_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      duration: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      channel_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      amount_charged: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      pay_per_minute: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      included_minutes: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      connection_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      channel_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      recording_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      request_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      started_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ended_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      wizow_fee: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      stripe_fee: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      wizard_earnings: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      tip: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
      response_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      stripe_payment_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "calls",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );

  // Calls.associate = function (models) {
  //   Calls.belongsTo(models.Users, {
  //     foreignKey: "callerId",
  //     as: "caller",
  //     onDelete: "CASCADE",
  //   });
  //   Calls.belongsTo(models.Users, {
  //     foreignKey: "receiverId",
  //     as: "receiver",
  //     onDelete: "CASCADE",
  //   });
  // };

  return Calls;
};
