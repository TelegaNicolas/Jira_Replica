const Issue = require('../models/model_issues');
const Project = require('../models/model_project');
 
const getAllIssues = async (req, res) => {
    try {
        const { project_id } = req.params;
 
        const project = await Project.findById(project_id);
        if (!project) return res.status(404).json({ message: 'This project does not exist.' });
 
        const issues = await Issue.findAllByProject(project_id);
        res.status(200).json(issues); 
 
        res.status(200).json(issues);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
 
const getIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);
        if (!issue) return res.status(404).json({ message: 'This issue does not exist.' });
 
        res.status(200).json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
 
const createIssue = async (req, res) => {
    try {
        const { title, description, priority, project_id, assignee_id, status } = req.body;
 
        const project = await Project.findById(project_id);
        if (!project) return res.status(404).json({ message: 'This project does not exist.' });
 
        const issue = await Issue.create(title, description, priority, project_id, assignee_id, status);
        res.status(201).json({ message: 'Issue created', issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
 
const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { updates } = req.body;
 
        const issue = await Issue.findById(id);
        if (!issue) return res.status(404).json({ message: 'This issue does not exist.' });
 
        const updatedIssue = await Issue.update(id, updates);
        res.status(200).json({ message: 'Issue updated', issue: updatedIssue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
 
const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;
 
        const issue = await Issue.findById(id);
        if (!issue) return res.status(404).json({ message: 'This issue does not exist.' });
 
        // Seul le owner du projet peut supprimer une issue
        const project = await Project.findById(issue.project_id);
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }
 
        const deleted = await Issue.delete(id);
        res.status(200).json({ message: 'Issue deleted', issue: deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
 
module.exports = { getAllIssues, getIssue, createIssue, updateIssue, deleteIssue };