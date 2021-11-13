const errorHandler = require("../errors/handlers").errorHandler;
const models = require("../models");
const { Op } = require("sequelize");

exports.createUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email } = req.body;
    if (!email) throw new Error("Email is required");
    const user = await models.users.create({
      first_name,
      last_name,
      username,
      email
    });
    return res.status(201).json({
      user
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.users.findAll({
      attributes: {
        exclude: [
          "password",
          "password_reset_id",
          "password_reset_sent",
          "remember_token"
        ]
      }
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.body;
    if (page <= 0) throw new Error("Pages must be one or above");

    const query = {
      where: {
        [Op.and]: [{ role: "user" }, { locked: 0 }, { isWizard: 0 }]
      },
      limit: Number(limit),
      offset: Number((Number(page) === 1 ? 0 : page - 1) * limit)
    };

    const users = await models.users.findAndCountAll(query);
    return res
      .status(200)
      .json({ success: true, users: users.rows, total: users.count });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getAllWizards = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.body;
    if (page <= 0) throw new Error("Pages must be one or above");

    const query = {
      where: {
        isWizard: 1,
        locked: false
      },
      attributes: {
        exclude: [
          "password",
          "password_reset_id",
          "password_reset_sent",
          "remember_token"
        ]
      },
      limit: Number(limit),
      offset: Number((Number(page) === 1 ? 0 : page - 1) * limit)
    };

    const users = await models.users.findAndCountAll(query);
    return res
      .status(200)
      .json({ success: true, users: users.rows, total: users.count });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getAllDeactivated = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.body;
    if (page <= 0) throw new Error("Pages must be one or above");

    const query = {
      where: {
        locked: true,
        role: "user"
      },
      limit: Number(limit),
      offset: Number((Number(page) === 1 ? 0 : page - 1) * limit)
    };

    const users = await models.users.findAndCountAll(query);
    return res
      .status(200)
      .json({ success: true, users: users.rows, total: users.count });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getWizardById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Proper permissions are required");
    const user = await models.users.findByPk(id, {
      attributes: {
        exclude: [
          "password",
          "password_reset_id",
          "password_reset_sent",
          "remember_token"
        ]
      }
    });
    if (!user) throw new Error("User cannot be found");

    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Id cannot be found");

    const user = await models.users.findByPk(id, {
      attributes: {
        exclude: [
          "password",
          "password_reset_id",
          "password_reset_sent",
          "remember_token"
        ]
      }
    });

    // const user = await models.users.findOne({
    //   where: { id },
    //   order: [["createdAt", "DESC"]],
    //   include: [
    //     {
    //       model: models.Calls,
    //       as: "callHistory",
    //     },
    //   ],
    // });
    if (!user) throw new Error("User cannot be found");

    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.deactivateUserById = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const admin = await models.users.findByPk(userId);
    if (admin.role !== "superadmin")
      throw new Error("Proper permissions are required");

    const { id } = req.params;
    if (!id) throw new Error("A user id is required");
    const user = await models.users.update({ locked: 1 }, { where: { id } });
    if (!user) throw new Error("User cannot be found");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.reactivateUserById = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const admin = await models.users.findByPk(userId);
    if (admin.role !== "superadmin")
      throw new Error("Proper permissions are required");

    const { id } = req.params;
    if (!id) throw new Error("A user id is required");
    const user = await models.users.update({ locked: 0 }, { where: { id } });
    if (!user) throw new Error("User cannot be found");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const {
      updateUserId,
      email,
      phone,
      first_name,
      last_name,
      address,
      city,
      state,
      zip
    } = req.body;
    if (!updateUserId) throw new Error("Id is required");
    const id = updateUserId;
    const data = {};
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (city) data.city = city;
    if (state) data.state = state;
    if (zip) data.zip = zip;
    const user = await models.users.update(data, { where: { id } });
    if (!user) throw new Error("User cannot be found");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.decoded.id;
    const admin = await models.users.findByPk(userId);
    if (admin.role !== "superadmin")
      throw new Error("Proper permissions are required");

    const { id } = req.params;
    const deleted = await models.users.destroy({
      where: {
        id
      }
    });

    return res.status(200).send({ success: true, message: "user deleted" });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getUserSelf = async (req, res) => {
  try {
    let userId = req.decoded.id;

    if (!userId) throw new Error("A user id is required");

    const user = await models.users.findOne({
      where: { id: userId },
      attributes: {
        exclude: [
          "password",
          "password_reset_id",
          "password_reset_sent",
          "remember_token",
          "created_at"
        ]
      }
    });
    if (!user) throw new Error("User with the specified ID does not exists");
    let userObj = JSON.parse(JSON.stringify(user));

    return res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.getMyAccount = async (req, res) => {
  try {
    let userId = req.decoded.id;

    if (!userId) throw new Error("A user id is required");

    const user = await models.users.findOne({
      where: { id: userId },
      exclude: ["password", "createdAt", "updatedAt"]
    });
    if (!user) throw new Error("User with the specified ID does not exists");
    let userObj = JSON.parse(JSON.stringify(user));

    return res.status(200).json({ success: true, user: userObj });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.updateMyUser = async (req, res) => {
  try {
    const {
      email,
      phone,
      first_name,
      last_name,
      address,
      city,
      state,
      zip,
      id
    } = req.body;
    const data = {};
    if (email) data.email = email;
    if (phone) data.phone = phone;
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (!id) throw new Error("User cannot be found");

    const resp = await models.users.update(data, { where: { id } });
    if (!resp) throw new Error("User cannot be found");

    const user = await models.users.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "password_reset_id" ]
      }
    });
    if (!user) throw new Error("User cannot be found");
    return res.status(200).json({ success: true, user });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    let userId = req.decoded.id;
    let imageUrl = req.file ? req.file.location : null;

    const userData = {
      avatar: imageUrl
    };

    const [updated] = await models.users.update(userData, {
      where: { id: userId }
    });
    if (updated) {
      const updatedUser = await models.users.findOne({ where: { id: userId } });
      return res.status(200).json({ success: true, user: updatedUser });
    }
    return res.status(400).json({
      success: false,
      message:
        "User with the specified ID does not exists or error uploading image"
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};
