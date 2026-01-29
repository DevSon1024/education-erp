const TermsAndConditions = require('../models/TermsAndConditions');

// Get Terms (Assume single document)
const getTerms = async (req, res) => {
    try {
        const terms = await TermsAndConditions.findOne();
        if (!terms) {
            return res.status(200).json({ content: "" }); // Return empty if not initialized
        }
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Terms (Upsert)
const updateTerms = async (req, res) => {
    try {
        const { content } = req.body;
        // Find existing or create new
        let terms = await TermsAndConditions.findOne();
        
        if (terms) {
            terms.content = content;
            await terms.save();
        } else {
            terms = await TermsAndConditions.create({ content });
        }
        
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTerms,
    updateTerms
};
