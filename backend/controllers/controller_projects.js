const Project = require('../models/model_project');
require('dotenv').config();

const createProject = async (req,res) => {
    try {
        const { name, description, owner_id } = req.body;
        const existingProject = await Project.findById
    }
}
module.exports = {};
