const express = require('express');
const router = express.Router();
const { getAllIssues, getIssue, createIssue, updateIssue, deleteIssue } = require('../controllers/controller_issues');
const { auth } = require('../middleware/middleware_auth');
 
router.get('/getAll/:project_id', auth, getAllIssues);
router.get('/get/:id', auth, getIssue);
router.post('/create', auth, createIssue);
router.put('/update/:id', auth, updateIssue);
router.delete('/delete/:id', auth, deleteIssue);
 
module.exports = router;
 