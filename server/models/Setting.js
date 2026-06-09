import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    // Navbar Section
    navbar: {
        logo: String,
        location: String,
        phoneNumber: String,
        navLinks: [{ title: String }] // List of navigation names
    },

    // Footer Section
    footer: {
        description: String,
        email: String,
        whatsappNumber: String,
        quickLinks: [{ title: String }],
        
        // Import Links by Body Type
        bodyTypeLinks: [{ 
            title: String, 
            options: [{ label: String }] 
        }],
        
        // Important Links
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

export default mongoose.model('Settings', settingsSchema);