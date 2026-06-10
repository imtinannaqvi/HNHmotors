import Setting from '../models/Setting.js';

const defaultSettings = {
  navbar:      { location: '', phoneNumber: '', navLinks: [] },
  footer:      { logo: '', description: '', email: '', whatsappNumber: '', quickLinks: [] },
  socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' }
};

// ── GET current settings ──────────────────────────────────
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) return res.json(defaultSettings);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE settings ───────────────────────────────────────
export const updateSettings = async (req, res) => {
  try {
    const body = typeof req.body.data === 'string'
      ? JSON.parse(req.body.data)
      : req.body;

    // Get existing settings (or create a new doc)
    let settings = await Setting.findOne();
    if (!settings) settings = new Setting({});

    // If a new logo was uploaded, set its path; otherwise keep what the form sent
    if (req.file) {
      if (!body.footer) body.footer = {};
      body.footer.logo = `uploads/logo/${req.file.filename}`;
    }

    // Save exactly what the form sent (the form loads current data first,
    // so this contains the full, correct set — including edits and deletions)
    if (body.navbar)      settings.navbar      = body.navbar;
    if (body.footer)      settings.footer      = body.footer;
    if (body.socialLinks) settings.socialLinks = body.socialLinks;

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};