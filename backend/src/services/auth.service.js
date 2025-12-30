const prisma = require("../utils/prisma");
const { hashPassword } = require("../utils/password");

async function createUser({ name, email, password }) {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
}

module.exports = {
  createUser,
};
