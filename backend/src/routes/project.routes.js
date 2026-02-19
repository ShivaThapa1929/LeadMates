const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject, updateProject, getProject } = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/delete/:id', deleteProject);

module.exports = router;
