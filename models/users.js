const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password_reset_sent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    remember_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    isWizard: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    image_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_content_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    image_file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image_updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_guest: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    customer_profile_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    payment_profile_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    authnet_customer_profile_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    authnet_payment_profile_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    valid_authnet_payment_id: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_last4: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_brand: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_exp_month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    card_exp_year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    facebook_user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    facebook_oauth_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    facebook_oauth_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_online: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    video_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_verify_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone_verification_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phone_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    stripe_state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    default_stripe_payment_source_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
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
