import fs from "fs/promises";

export const getUsers = async (req, res) => {
  let users = [];

  try {
    const data = await fs.readFile("./db/users.json", "utf-8");
    users = JSON.parse(data);
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const userID = req.params.id;
  const updateData = req.body.selectedColors;
  try {
    const data = await fs.readFile("./db/users.json", "utf-8");
    let users = JSON.parse(data);

    const userToUpdate = users.find((user) => user.id == userID);
    console.log(userToUpdate);

    if (userToUpdate) {
      Object.assign(userToUpdate, updateData);

      await fs.writeFile(
        "./db/users.json",
        JSON.stringify(users, null, 2),
        "utf-8"
      );

      return res.json(userToUpdate);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
