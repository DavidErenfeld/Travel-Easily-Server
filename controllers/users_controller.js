const Users = require("../models/users_model");

const getAllUsers = async (req, res) => {
  console.log("get all users");
  const users = await Users.find();
  try {
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  console.log(`get user by id: ${req.params.id}`);
  try {
    const user = await Users.findById(req.params.id);
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const postUser = async (req, res) => {
  console.log(`post user ${req.body}`);
  const user = new Users(req.body);
  try {
    await user.save();
    res.status(200).send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const putUserById = async (req, res) => {
  console.log("put user");
  const userId = req.params.id;
  try {
    const updateUser = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: `id: ${userId} is not found!` });
    }
    res.send(updateUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUserById = async (req, res) => {
  console.log("delete user");
  try {
    const deleteUser = await Users.findOneAndDelete({ _id: req.params.id });
    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: `id: ${req.params.id} is not found` });
    }
    res.send(`User ${req.params.id} is deleted`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  putUserById,
  deleteUserById,
};
