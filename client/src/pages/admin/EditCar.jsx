import React, { useState } from 'react';
import api from "../../api/axios.js"; // ✅ fixed typo axois → axios
import { Plus, Upload } from 'lucide-react';

const AddCar = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Sedan',
    brand: 'Toyota', make: '', model: '', year: '', mileage: '',
    color: '', fuelType: 'Petrol', transmission: 'Manual', condition: 'Used'
  });

  const [visibleFields, setVisibleFields] = useState(['title', 'price']);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const allFields = [
    'description', 'category', 'brand', 'make', 'model',
    'year', 'mileage', 'color', 'fuelType', 'transmission', 'condition'
  ];

  const fieldOptions = {
    category:     ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible'],
    brand:        ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Hyundai', 'Kia', 'Nissan'],
    fuelType:     ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    transmission: ['Manual', 'Automatic'],
    condition:    ['New', 'Used', 'Certified Pre-Owned'],
  };

  const showNextField = () => {
    const nextIndex = visibleFields.length - 2;
    if (nextIndex < allFields.length) {
      setVisibleFields([...visibleFields, allFields[nextIndex]]);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('images', image);

    try {
      const token = localStorage.getItem('token');
      // ✅ correct endpoint — matches server.js: app.use('/api/cars', carRoutes)
      await api.post('/cars', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      alert('Car added successfully!');
      // Reset form
      setFormData({
        title: '', description: '', price: '', category: 'Sedan',
        brand: 'Toyota', make: '', model: '', year: '', mileage: '',
        color: '', fuelType: 'Petrol', transmission: 'Manual', condition: 'Used'
      });
      setImage(null);
      setVisibleFields(['title', 'price']);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold mb-5 text-gray-900">Add New Vehicle</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleFields.map((field) => (
            <div key={field} className={`flex flex-col ${field === 'description' ? 'md:col-span-2' : ''}`}>
              <label className="text-xs font-semibold text-gray-500 mb-0.5 capitalize">
                {field}
              </label>

              {fieldOptions[field] ? (
                // ✅ Select with actual options
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="p-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-gray-400">
                  {fieldOptions[field].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field === 'description' ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="p-2 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-gray-400 resize-none"
                  rows="2"
                  placeholder="Enter description"
                />
              ) : (
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="p-2 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:border-gray-400"
                  placeholder={`Enter ${field}`}
                />
              )}
            </div>
          ))}

          {/* Add more fields button */}
          {visibleFields.length < allFields.length + 2 && (
            <button
              type="button"
              onClick={showNextField}
              className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition p-2 text-sm">
              <Plus size={18} />
              <span className="ml-2 font-medium">Add details</span>
            </button>
          )}
        </div>

        {/* Image upload */}
        <div className="border-t pt-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            Vehicle Image
          </label>
          <div className="flex items-center justify-center w-full border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
              id="file"
            />
            <label htmlFor="file" className="cursor-pointer flex items-center text-gray-500 text-sm">
              <Upload size={20} className="mr-2" />
              <span className="font-medium">
                {image ? image.name : 'Upload Image'}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-black transition disabled:opacity-50">
          {loading ? 'Publishing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;