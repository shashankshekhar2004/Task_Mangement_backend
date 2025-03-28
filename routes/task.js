const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const authenticateToken=require('./auth')

router.post('/create-task',authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body; // Extract `userId` from body

        if (!title || !desc) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        const {id}=req.headers;
        //console.log(id);
        // Create and save the task
        const newTask = new Task({ title, desc });
        const saveTask = await newTask.save();

        // Push task ID into the user's `tasks` array
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: { tasks: saveTask._id } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'Task created successfully', task: saveTask });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
router.get('/get-all-tasks', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } },
        });

        res.status(200).json({ data: userData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Delete Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
        
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Update Task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        await Task.findByIdAndUpdate(id, { title: title, desc: desc });
        
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Update-Important Task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        
        await Task.findByIdAndUpdate(id, { important: !ImpTask });

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
//complete-task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CompleteTask = TaskData.complete;
        
        await Task.findByIdAndUpdate(id, { complete: !CompleteTask });

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { important: true },
            options: { sort: { createdAt: -1 } },
        });

        const ImpTaskData = Data.tasks;
        res.status(200).json({ data: ImpTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Get completed tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: true },
            options: { sort: { createdAt: -1 } },
        });

        const CompTaskData = Data.tasks;
        res.status(200).json({ data: CompTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});
// Get incomplete tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: { complete: false },
            options: { sort: { createdAt: -1 } },
        });

        const CompTaskData = Data.tasks;
        res.status(200).json({ data: CompTaskData });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
});





module.exports = router;
