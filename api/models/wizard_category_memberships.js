const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wizard_category_memberships', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    pay_per_minute: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1
    },
    included_minutes: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 5
    },
    connection_cost: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 5
    },
    experience_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    years_of_experience: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    date_approved: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_applied: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approved_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rejected_explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'wizard_category_memberships',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
