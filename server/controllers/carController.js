import Car from '../models/Car.js';
import mongoose from 'mongoose';

// ── GET all cars with filters + pagination ────────────────
export const getCars = async (req, res) => {
  try {
    const {
      minPrice, maxPrice,
      search, status,
      page  = 1,
      limit = 12,
      sortBy = 'createdAt',
    } = req.query;

    const query = {};

    if (status) query.status = status;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Car.countDocuments(query);
    const cars  = await Car.find(query)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      cars,
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET special offer cars ────────────────────────────────
export const getSpecialOffers = async (req, res) => {
  try {
    const cars = await Car.find({ isSpecialOffer: true }).limit(8).sort({ createdAt: -1 });
    res.json({ cars });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET featured cars ─────────────────────────────────────
export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ isFeatured: true, status: 'available' }).limit(8);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET single car ────────────────────────────────────────
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    res.json(car);
  } catch (err) {
    console.error('GET BY ID ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── POST create car ───────────────────────────────────────
// ── POST create car ───────────────────────────────────────
export const createCar = async (req, res) => {
  try {
    const {
      title, price,
      details, features,
      isFeatured, isSpecialOffer, discountedPrice, offerLabel,
    } = req.body;

    // req.files is now an OBJECT: { images: [...], brandLogo: [...] }
    const imageFiles = req.files?.images || [];
    const images = imageFiles.map(f => `uploads/cars/${f.filename}`);
    const thumbnail = images[0] || '';

    const logoFile  = req.files?.brandLogo?.[0];
    const brandLogo = logoFile ? `uploads/cars/${logoFile.filename}` : '';

    const car = await Car.create({
      title,
      price:           Number(price),
      details:         details  ? JSON.parse(details)  : {},
      features:        features ? JSON.parse(features) : [],
      images,
      thumbnail,
      brandLogo,
      isFeatured:      isFeatured === 'true',
      isSpecialOffer:  isSpecialOffer === 'true',
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      offerLabel:      offerLabel || '',
    });

    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    console.error('CREATE CAR ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── PUT update car ────────────────────────────────────────
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const updatedData = { ...req.body };

    if (req.body.details)  updatedData.details  = JSON.parse(req.body.details);
    if (req.body.features) updatedData.features = JSON.parse(req.body.features);
    if (req.body.price)    updatedData.price    = Number(req.body.price);

    updatedData.isSpecialOffer  = req.body.isSpecialOffer === 'true';
    updatedData.discountedPrice = req.body.discountedPrice ? Number(req.body.discountedPrice) : null;

    // req.files is now an OBJECT: { images: [...], brandLogo: [...] }
    const imageFiles = req.files?.images || [];

    // ── Brand logo: replace only if a new one was uploaded ──
    const logoFile = req.files?.brandLogo?.[0];
    if (logoFile) updatedData.brandLogo = `uploads/cars/${logoFile.filename}`;
    if (req.body.removeBrandLogo === 'true') updatedData.brandLogo = '';

    // ── Images ──
    if (req.body.existingImages !== undefined) {
      const kept  = JSON.parse(req.body.existingImages);
      const added = imageFiles.map(f => `uploads/cars/${f.filename}`);
      const finalImages = [...kept, ...added];
      updatedData.images    = finalImages;
      updatedData.thumbnail = finalImages[0] || '';
    } else if (imageFiles.length > 0) {
      const added = imageFiles.map(f => `uploads/cars/${f.filename}`);
      updatedData.images    = added;
      updatedData.thumbnail = added[0];
    }

    delete updatedData.existingImages;
    delete updatedData.removeBrandLogo;

    const updated = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ message: 'Car updated successfully', car: updated });
  } catch (err) {
    console.error('UPDATE CAR ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE car ────────────────────────────────────────────
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    await Car.findByIdAndDelete(id);
    res.json({ message: 'Car deleted successfully' });

  } catch (err) {
    console.error('DELETE ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};