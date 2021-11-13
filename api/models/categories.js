const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Categories = sequelize.define(
    "categories",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      is_critical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      critical_terms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      default_pay_per_minute: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 1,
      },
      default_included_minutes: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 5,
      },
      default_connection_cost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 5,
      },
      icon_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      icon_content_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      icon_file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      icon_updated_at: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      photo_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      photo_content_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      photo_file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      photo_updated_at: {
        type: DataTypes.DATE,
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
      tableName: "categories",
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

  Categories.associate = function (models) {
    Categories.hasMany(models.specialties, {
      foreignKey: "specialtiesId",
      as: "specialties",
      onDelete: "CASCADE",
    });
  };

  return Categories;
};
