import { useState } from 'react';
import api from "../../api/axios.js";
import { Upload, CheckCircle, Plus, X } from 'lucide-react';

const OPTIONS = {
  category:     ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible', 'Wagon'],
  brand:        ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Volkswagen', 'Chevrolet', 'Other'],
  fuelType:     ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'],
  transmission: ['Manual', 'Automatic'],
  condition:    ['New', 'Used', 'Certified Pre-Owned'],
};

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:border-gray-800 transition font-medium bg-white';
const labelCls = 'block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5';

// ── OUTSIDE component — prevents focus loss ───────────────
const Field = ({ label, children }) => (
  <div className="flex flex-col">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

// All optional fields in reveal order
const EXTRA_FIELDS = [
  { key: 'category',     label: 'Category',        type: 'select' },
  { key: 'brand',        label: 'Brand',            type: 'select' },
  { key: 'make',         label: 'Make',             type: 'input',  placeholder: 'e.g. BMW'          },
  { key: 'model',        label: 'Model',            type: 'input',  placeholder: 'e.g. X5'           },
  { key: 'year',         label: 'Year',             type: 'number', placeholder: 'e.g. 2022'         },
  { key: 'mileage',      label: 'Mileage (km)',     type: 'number', placeholder: 'e.g. 25000'        },
  { key: 'color',        label: 'Color',            type: 'input',  placeholder: 'e.g. Midnight Blue' },
  { key: 'fuelType',     label: 'Fuel Type',        type: 'select' },
  { key: 'transmission', label: 'Transmission',     type: 'select' },
  { key: 'condition',    label: 'Condition',        type: 'select' },
  { key: 'location',     label: 'Location',         type: 'input',  placeholder: 'e.g. London'       },
  { key: 'description',  label: 'Description',      type: 'textarea' },
];

const AddCar = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '',
    category: '', brand: '', make: '', model: '',
    year: '', mileage: '', color: '',
    fuelType: '', transmission: '', condition: '', location: '',
  });

  const [visibleCount, setVisibleCount] = useState(0); // how many extra fields shown
  const [image,        setImage]        = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('images', image);
    try {
      await api.post('/cars', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        title: '', description: '', price: '',
        category: '', brand: '', make: '', model: '',
        year: '', mileage: '', color: '',
        fuelType: '', transmission: '', condition: '', location: '',
      });
      setImage(null); setPreview(null); setVisibleCount(0);
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const visibleExtras  = EXTRA_FIELDS.slice(0, visibleCount);
  const hasMoreFields  = visibleCount < EXTRA_FIELDS.length;

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <select name={field.key} value={formData[field.key]}
          onChange={handleChange} className={inputCls}>
          <option value="">Select {field.label}</option>
          {OPTIONS[field.key]?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (field.type === 'textarea') {
      return (
        <textarea name={field.key} value={formData[field.key]}
          onChange={handleChange} rows={3}
          placeholder="Describe the vehicle..."
          className={`${inputCls} resize-none`} />
      );
    }
    return (
      <input name={field.key} type={field.type === 'number' ? 'number' : 'text'}
        value={formData[field.key]} onChange={handleChange}
        placeholder={field.placeholder}
        className={inputCls} />
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Fill in basic info then add more details with the + button
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
          <CheckCircle size={15} /> Car published successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* ── Image Upload ── */}
          <div className="p-5 border-b border-gray-50">
            <label htmlFor="imgUpload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition overflow-hidden"
              style={{ minHeight: '140px' }}>
              {preview ? (
                <div className="relative w-full">
                  <img src={preview} alt="preview"
                    className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <p className="text-white text-xs font-semibold">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-gray-300">
                  <Upload size={26} />
                  <p className="text-sm font-medium text-gray-400">Click to upload vehicle image</p>
                  <p className="text-xs">JPG, PNG, WEBP — max 5MB</p>
                </div>
              )}
              <input id="imgUpload" type="file" accept="image/*"
                className="hidden" onChange={handleImage} />
            </label>
          </div>

          {/* ── Always visible: Title + Price ── */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-50">
            <div className="md:col-span-2">
              <Field label="Listing Title *">
                <input name="title" value={formData.title}
                  onChange={handleChange} required
                  placeholder="e.g. 2022 BMW X5 xDrive40i"
                  className={inputCls} />
              </Field>
            </div>
            <Field label="Price (£) *">
              <input name="price" type="number" value={formData.price}
                onChange={handleChange} required
                placeholder="e.g. 35000"
                className={inputCls} />
            </Field>
          </div>

          {/* ── Progressive extra fields ── */}
          {visibleExtras.length > 0 && (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-50">
              {visibleExtras.map(field => (
                <div key={field.key}
                  className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <Field label={field.label}>
                    {renderField(field)}
                  </Field>
                </div>
              ))}
            </div>
          )}

          {/* ── Add more / Submit row ── */}
          <div className="p-5 flex items-center gap-3">
            {/* + Add details button */}
            {hasMoreFields && (
              <button type="button"
                onClick={() => setVisibleCount(prev => prev + 1)}
                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-50 transition">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus size={13} className="text-gray-600" />
                </div>
                Add {EXTRA_FIELDS[visibleCount]?.label}
              </button>
            )}

            {/* Show all remaining at once */}
            {hasMoreFields && visibleCount > 0 && (
              <button type="button"
                onClick={() => setVisibleCount(EXTRA_FIELDS.length)}
                className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition">
                Add all fields
              </button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition disabled:opacity-50">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing...
                </>
              ) : 'Publish Listing'}
            </button>
          </div>

        </div>

        {/* Field progress indicator */}
        {visibleCount > 0 && (
          <p className="text-center text-xs text-gray-400 mt-3 font-medium">
            {visibleCount} of {EXTRA_FIELDS.length} optional fields added
          </p>
        )}
      </form>
    </div>
  );
};

export default AddCar;