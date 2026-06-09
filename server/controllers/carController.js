import Car from '../models/Car.js';

// ── GET all cars with filters + pagination ────────────────
export const getCars = async (req, res) => {
  try {
    const {
      make, model, year, minPrice, maxPrice,
      fuelType, transmission, bodyType,
      condition, search, status,
      page  = 1,
      limit = 12,
      sortBy = 'createdAt',
    } = req.query;

    const query = {};

    if (make)         query.make         = { $regex: make,  $options: 'i' };
    if (model)        query.model        = { $regex: model, $options: 'i' };
    if (year)         query.year         = Number(year);
    if (fuelType)     query.fuelType     = fuelType;
    if (transmission) query.transmission = transmission;
    if (bodyType)     query.bodyType     = bodyType;
    if (condition)    query.condition    = condition;
    if (status)       query.status       = status;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { make:  { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Car.countDocuments(query);
    const cars  = await Car.find(query)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      // .populate('dealer', 'name email phone');

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

// ── GET featured cars ─────────────────────────────────────
export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ isFeatured: true, status: 'available' })
      .limit(8)
      // .populate('dealer', 'name email');
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET single car ────────────────────────────────────────
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ADD THIS (VERY IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);

  } catch (err) {
    console.error("ERROR:", err); // 👈 add this
    res.status(500).json({ message: err.message });
  }
};

// ── POST create car ───────────────────────────────────────
export const createCar = async (req, res) => {
  try {
    const {
      title, description, price,
      category, brand, make, model,
      year, mileage, color,
      fuelType, transmission, condition,
      engineSize, doors, seats,
      features, location, isFeatured,
    } = req.body;

    // ── Handle uploaded images ─────────────────────────────
    const images = req.files
      ? req.files.map(f => `uploads/cars/${f.filename}`)
      : [];

    const thumbnail = images[0] || '';

    const car = await Car.create({
      title, description,
      price:        Number(price),
      category, brand, make, model,
      year:         Number(year),
      mileage:      Number(mileage) || 0,
      color, fuelType, transmission, condition,
      engineSize,
      doors:        Number(doors)  || 0,
      seats:        Number(seats)  || 0,
      features:     features ? JSON.parse(features) : [],
      location,
      isFeatured:   isFeatured === 'true',
      images,
      thumbnail,
      dealer: req.user._id,
    });

    res.status(201).json({ message: 'Car added successfully', car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT update car ────────────────────────────────────────
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car)
      return res.status(404).json({ message: 'Car not found' });

    // ── Only dealer who owns it or admin can update ────────
if (
  !car.dealer ||
  (car.dealer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
) {
  return res.status(403).json({ message: 'Not authorized' });
}      return res.status(403).json({ message: 'Not authorized' });

    // ── Handle new images if uploaded ──────────────────────
    const newImages = req.files
      ? req.files.map(f => `uploads/cars/${f.filename}`)
      : [];

    const updatedData = {
      ...req.body,
      images:    newImages.length > 0 ? newImages : car.images,
      thumbnail: newImages.length > 0 ? newImages[0] : car.thumbnail,
    };

    if (req.body.features) {
      updatedData.features = JSON.parse(req.body.features);
    }

    const updated = await Car.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({ message: 'Car updated successfully', car: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE car ────────────────────────────────────────────
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ prevent crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid car ID' });
    }

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // ✅ safe check
    if (
      !car.dealer ||
      (car.dealer.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Car.findByIdAndDelete(id);

    res.json({ message: 'Car deleted successfully' });

  } catch (err) {
    console.error("DELETE ERROR:", err); // 👈 check terminal
    res.status(500).json({ message: err.message });
  }
};

// ── GET dealer's own cars ─────────────────────────────────
export const getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ dealer: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ cars, total: cars.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};