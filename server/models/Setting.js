import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Navbar Section
    navbar: {
        logo: String,
        location: String,
        phoneNumber: String,
        navLinks: [{ title: String }]
    },

    // Footer Section
    footer: {
        logo: String,              // ✅ ADDED — this was missing
        description: String,
        email: String,
        whatsappNumber: String,
        quickLinks: [{ title: String }],

        bodyTypeLinks: [{
            title: String,
            options: [{ label: String }]
        }],

        importantLinks: [{
            title: String,
            options: [{ label: String }]
        }]
    },

    // Socials
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);