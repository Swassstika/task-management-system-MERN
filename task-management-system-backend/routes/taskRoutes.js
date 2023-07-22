const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { hasPermission } = require('../middleware/authMiddleware');

// Middleware to check user permissions for certain routes
const hasPermissionForTasks = hasPermission('createTask', 'readOwnTask', 'updateOwnTask', 'deleteOwnTask');
const hasPermissionForAllTasks = hasPermission('readAllTasks', 'updateAllTasks', 'deleteAllTasks');

router.post('/', hasPermissionForTasks, taskController.createTask);
router.get('/', hasPermissionForTasks, taskController.getAllTasks);
router.get('/:id', hasPermissionForTasks, taskController.getTaskById);
router.put('/:id', hasPermissionForTasks, taskController.updateTask);
router.delete('/:id', hasPermissionForTasks, taskController.deleteTask);
router.post('/:id/comments', hasPermissionForTasks, taskController.addTaskComment);

module.exports = router;
