import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// In real app it will be on .env file
const usersFilePath = "./db/users.json";
const secretKey = "yourSecretKey";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const data = await readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);

    if (users.some((user) => user.email === email)) {
      return res.status(409).send("User already exists!");
    }

    if (!name || !email || !password)
      return res.status(400).send("There is empty filed!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    };

    users.push(newUser);
    await writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");

    return res.status(201).send("User has been created");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(400).send("Email is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("Password is incorrect");
    }

    const token = jwt.sign({ id: user.id }, secretKey);

    res.cookie("accessToken", token, { httpOnly: true }).status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};
