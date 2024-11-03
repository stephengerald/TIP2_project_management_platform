const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require('express');
const router = express.Router();
const Collaboration = require("../models/collaborationModel");

const PDFDocument = require("pdfkit")
const fs = require("fs")

// Create a new collaboration entry
const newCollaborationFn = async(req, res)=> {
    try {
        const newCollaboration = new Collaboration(req.body);
        await newCollaboration.save();
        return res.status(201).json({ message: "Created successfully!", new_collaboration: newCollaboration });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

//Get all collaboration 
const allCollaborationFn = async(req, res)=> {
    try {
        const allCollaboration = await Collaboration.find({ projectId: req.params.projectId });
        return res.status(201).json({ message: "Successful", all_collaboration: allCollaboration });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//Get a single Collaboration
const singleCollaborationFn = async(req, res)=> {
    try {
        const singleCollaboration = await Collaboration.findById(req.params.id);
        if(singleCollaboration){
            return res.status(200).json({ message: "Succcessful", single_collaboration: singleCollaboration });
        } else {
            return res.status(404).json({ message: "Collaboration entry not found!" });
        }

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Update collaboration
const updateCollaborationFn = async(req, res)=> {
    try {
        const updateCollaboration = await Collaboration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(updateCollaboration){
            return res.status(201).json({ message: "Updated Successfully", update_collaboration: updateCollaboration });
        } else {
            return res.status(404).json({ message: "Collaboration entry not found!" });
        }      

    } catch (error) {
        return res.status(400).json({ message: error.message });   
    }
};

//Delete Collaboration 
const deleteCollaborationFn = async(req, res)=> {
    try {
        const deleteCollaboration = await Collaboration.findByIdAndDelete(req.params.id);
        if(deleteCollaboration){
            return res.status(201).json({ message: "Collaboration entry deleted successfully!"});
        } else {
            return res.status(404).json({ message: "Collaboration entry not found!"});
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


// Generate PDF report for collaboration entries
const generateCollaborationReportFn = async (req, res) => {
    try {
        const generateCollaborationReport = await Collaboration.find({ projectId: req.params.projectId }).populate('sender');
        if (!generateCollaborationReport.length) {
            return res.status(404).json({ error: 'No collaboration entries found for this project' });
        }

        const doc = new PDFDocument();
        let filename = `CollaborationReport_Project_${req.params.projectId}.pdf`;
        filename = encodeURIComponent(filename);

        // Setting headers for PDF download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);

        // Adding content to the PDF
        doc.fontSize(25).text('Collaboration Report', { align: 'center' });
        generateCollaborationReport.forEach(collaboration => {
            doc.addPage();
            doc.fontSize(18).text(`Type: ${collaboration.type}`, { align: 'left' });
            doc.fontSize(18).text(`Content: ${collaboration.content}`, { align: 'left' });
            doc.fontSize(18).text(`Sender: ${collaboration.sender.name}`, { align: 'left' });
            doc.fontSize(18).text(`Created At: ${collaboration.createdAt}`, { align: 'left' });
        });

        doc.end();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    generateCollaborationReportFn,
};


module.exports = {
    newCollaborationFn,
    allCollaborationFn,
    singleCollaborationFn,
    updateCollaborationFn,
    deleteCollaborationFn,
    generateCollaborationReportFn
}