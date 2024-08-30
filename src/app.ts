import express from "express";
import { prisma } from "../prisma/prisma-instance";
import { errorHandleMiddleware } from "./error-handler";
import "express-async-errors";

const app = express();
app.use(express.json());
// All code should go below this line
app.post("/dogs", async (req, res) => {
  const { name, breed, description, age } = req.body;

  if (
    typeof name !== "string" ||
    typeof breed !== "string" ||
    typeof description !== "string" ||
    typeof age !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid input data" });
  }

  try {
    const newDog = await prisma.dog.create({
      data: {
        name,
        breed,
        description,
        age,
      },
    });
    res.status(201).json(newDog);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the dog.",
      });
  }
});

app.delete("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id: Number(id) },
    });

    if (!dog) {
      return res.status(204).send();
    }

    await prisma.dog.delete({ where: { id: Number(id) } });
    return res.status(200).json(dog);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({
        error: "An error occurred while deleting the dog.",
      });
  }
});

app.get("/dogs", async (req, res) => {
  try {
    const dogs = await prisma.dog.findMany();
    res.status(200).json(dogs);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the dogs.",
      });
  }
});

app.get("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  try {
    const dog = await prisma.dog.findUnique({
      where: { id: Number(id) },
    });

    if (!dog) {
      return res.status(204).send();
    }

    res.status(200).json(dog);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the dog.",
      });
  }
});

app.patch("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    return res
      .status(400)
      .json({ message: "id should be a number" });
  }

  const { name, breed, description, age } = req.body;

  if (name && typeof name !== "string")
    return res
      .status(400)
      .json({ error: "Invalid input data" });
  if (breed && typeof breed !== "string")
    return res
      .status(400)
      .json({ error: "Invalid input data" });
  if (description && typeof description !== "string")
    return res
      .status(400)
      .json({ error: "Invalid input data" });
  if (age && typeof age !== "number")
    return res
      .status(400)
      .json({ error: "Invalid input data" });

  try {
    const updatedDog = await prisma.dog.update({
      where: { id: Number(id) },
      data: { name, breed, description, age },
    });
    return res.status(201).json(updatedDog);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: "An error occurred while updating the dog.",
      });
  }
});

// all your code should go above this line
app.use(errorHandleMiddleware);

const port = process.env.NODE_ENV === "test" ? 3001 : 3000;
app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
`)
);
