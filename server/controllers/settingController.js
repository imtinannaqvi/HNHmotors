import Setting from '../models/Setting.js';

// Define a default structure so your frontend doesn't break
const defaultSettings = {
    navbar: { logo: '', location: '', phoneNumber: '', navLinks: [] },
    footer: { description: '', email: '', whatsappNumber: '', quickLinks: [], bodyTypeLinks: [], importantLinks: [] },
    socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' }
};

// ── GET current settings ──────────────────────────────────
export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // If no settings exist, return the defaults
        if (!settings) {
            return res.json(defaultSettings);
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ── UPDATE settings ───────────────────────────────────────
export const updateSettings = async (req, res) => {
    try {
        // req.body should contain the full nested structure
        const updatedSettings = await Settings.findOneAndUpdate(
            {}, 
            req.body, 
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        );
        
        res.json({ message: "Settings updated successfully", settings: updatedSettings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};