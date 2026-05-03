const express = require('express');
const router = express.Router();
const { getAllProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/controller_projects');
const { auth } = require ('../middleware/middleware_auth');

router.get('/getAll', auth , getAllProjects);
router.get('/get/:id', auth, getProject);
router.post('/create', auth,createProject);
router.put('/update/:id', auth, updateProject);
router.delete('/delete/:id', auth, deleteProject);


module.exports = router;
