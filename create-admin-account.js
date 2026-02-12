const mongoose = require("mongoose");
const md5 = require("md5");
require("dotenv").config();

// Connect to Database
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connect Success!");
});

const Account = require("./models/account.model");
const Role = require("./models/roles.model");
const systemConfig = require("./config/system");

const createAdminAccount = async () => {
  // 1. Find or create a Role
  let role = await Role.findOne({ title: "Quản trị viên" });
  if (!role) {
    role = new Role({
      title: "Quản trị viên",
      description: "Quyền quản trị cao nhất",
      permissions: [
        "products_view",
        "products_create",
        "products_edit",
        "products_delete",
        "roles_view",
        "roles_create",
        "roles_edit",
        "roles_delete",
        "accounts_view",
        "accounts_create",
        "accounts_edit",
        "accounts_delete",
      ],
    });
    await role.save();
    console.log("Created Role: Quản trị viên");
  } else {
    console.log("Role 'Quản trị viên' already exists.");
  }

  // 2. Create Admin Account
  const existAccount = await Account.findOne({
    email: "admin@gmail.com",
    deleted: false,
  });
  if (existAccount) {
    console.log("Account 'admin@gmail.com' already exists.");
  } else {
    const account = new Account({
      fullName: "Admin",
      email: "admin@gmail.com",
      password: md5("123456"),
      token: "admin_token_123456",
      role_id: role.id,
      status: "active",
    });
    await account.save();
    console.log("Created Account: admin@gmail.com | Password: 123456");
  }

  mongoose.connection.close();
};

createAdminAccount();
