const Project = require('../models/model_project');
require('dotenv').config();


const getAllProjects = async (req,res) => {
    try {
        const allProjects = await Project.findAll();
        if(!allProjects || allProjects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.status(200).json(allProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getProject = async (req,res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if(!project) return res.status(404).json({ message : "This project does not exist."});
        res.status(200).json(project);
    } catch (error){
        console.error(error);
        res.status(500).json({ message : 'Server error'});
    }
}
         
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const owner_id = req.user.id;

        const existingProject = await Project.findByName(name);
        if (existingProject) return res.status(400).json({ message: 'This project already exists' });

        const project = await Project.create(name, description, owner_id);
        res.status(201).json({ message: 'Project created', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProject = async (req, res) => {
    try {
        
        const { updates } = req.body;
        const { id } = req.params;
        const projectExist = await Project.findById(id);
        if (!projectExist) return res.status(404).json({ message: 'This project does not exist.' });
        if (projectExist.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }       
        const project = await Project.update(id,updates);
        res.status(200).json({ message: 'Project Updated', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const projectExist = await Project.findById(id);
        if (!projectExist) return res.status(404).json({ message: 'This project does not exist.' });
        if (projectExist.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
        }
        const project = await Project.delete(id);
        res.status(200).json({ message: 'Project Deleted', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllProjects, getProject, createProject, updateProject, deleteProject};
