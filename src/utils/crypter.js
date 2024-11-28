// src/utils/passwordUtils.ts
import bcrypt from "bcryptjs";

// Hash the password before saving it to the database
export const hashPassword = async (password) => {
  const saltRounds = 10; // The cost factor controls the computational complexity of the hash
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare the provided password with the stored hashed password
export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
