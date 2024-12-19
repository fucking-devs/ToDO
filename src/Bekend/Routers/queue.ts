import { Router } from "express";
import Queue from "../Models/Queue";
import Task from "../Models/Task";

const queueRouter = Router();

queueRouter.get("/queues", async (req, res) => {
  const queues = await Queue.find().populate("tasks");
  res.send(queues);
});

queueRouter.post("/queues", async (req, res) => {
  const { title } = req.body;
  const queue = new Queue({ title });
  const savedQueue = await queue.save();
  res.send(savedQueue);
});

queueRouter.put("/queues/:id", async (req, res) => {
  const { id } = req.params;
  const { title, tasks } = req.body;

  const updatedQueue = await Queue.findByIdAndUpdate(
    id,
    { title, tasks },
    { new: true }
  );
  res.send(updatedQueue);
});

queueRouter.delete("/queues/:id", async (req, res) => {
  const { id } = req.params;
  await Queue.findByIdAndDelete(id);
  res.send({ message: "Очередь удалена" });
});

queueRouter.post("/queues/:id/tasks", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const task = new Task({ title });
    const savedTask = await task.save();

    const updatedQueue = await Queue.findByIdAndUpdate(
      id,
      { $push: { tasks: savedTask._id } },
      { new: true }
    ).populate("tasks");

    res.send(updatedQueue);
  } catch (error) {
    res.send({ message: "Ошибка при добавлении задачи в очередь", error });
  }
});

export default queueRouter