require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-config/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const app = express();
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyToken = async(req, res, next) => {
    let idToken = req.headers.authorization;

    if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Remove 'Bearer ' from token if present
    if (idToken.startsWith('Bearer ')) {
        idToken = idToken.slice(7, idToken.length);
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Route to generate case study and store in Firebase
app.post('/generate-case-study', verifyToken, async(req, res) => {
    const { parameters } = req.body;
    const userId = req.user.uid;

    try {
        // Call your Python API to generate the case study
        console.log("Calling Python API to generate case study...");
        const response = await axios.post('http://localhost:5000/generate', {
            parameters: parameters
        });

        const generatedData = response.data;

        // Log the generated data for debugging
        console.log("Generated Case Study Data:", generatedData);

        // Store the generated data in Firebase Realtime Database
        const db = admin.database();
        const userCaseStudiesRef = db.ref(`users/${userId}/caseStudies`);
        const newCaseStudyRef = userCaseStudiesRef.push();

        await newCaseStudyRef.set({
            ...generatedData,
            createdAt: admin.database.ServerValue.TIMESTAMP
        });

        console.log("Case study stored in Firebase with ID:", newCaseStudyRef.key);

        res.json({
            success: true,
            caseStudyId: newCaseStudyRef.key,
            data: generatedData
        });
    } catch (error) {
        console.error('Error generating or storing case study:', error.message);
        res.status(500).json({
            error: 'Failed to generate or store case study',
            details: error.message
        });
    }
});

// Route to retrieve user's case studies
app.get('/user-case-studies', verifyToken, async(req, res) => {
    const userId = req.user.uid;

    try {
        const db = admin.database();
        const userCaseStudiesRef = db.ref(`users/${userId}/caseStudies`);
        const snapshot = await userCaseStudiesRef.once('value');
        const caseStudies = snapshot.val();

        if (!caseStudies) {
            return res.json({ message: 'No case studies found' });
        }

        res.json({ caseStudies });
    } catch (error) {
        console.error('Error retrieving case studies:', error.message);
        res.status(500).json({
            error: 'Failed to retrieve case studies',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));