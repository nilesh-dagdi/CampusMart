import { useState, useRef, useEffect } from 'react';
import {
    Camera,
    X,
    Plus,
    ChevronDown,
    Info,
    CheckCircle2,
    IndianRupee,
    Tag,
    Clock,
    ChevronLeft,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getItemById, updateItem, deleteItem } from '../api/items';

const CATEGORIES = ["Academic", "Dorm Essentials", "Electronics", "Transport", "Others"];
const CONDITIONS = ["New", "Like New", "Used - Good", "Worn Out"];

const EditItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [photos, setPhotos] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Academic',
        price: '',
        negotiable: true,
        condition: 'Like New',
        description: '',
        status: 'Available'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Populate data on mount
    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                const item = await getItemById(id);
                setFormData({
                    title: item.title,
                    category: item.category,
                    price: item.price,
                    negotiable: true,
                    condition: item.condition,
                    description: item.description || '',
                    status: item.status === 'AVAILABLE' ? 'Available' : 'Sold'
                });
                if (item.image) {
                    setPhotos([{ id: 'existing', url: item.image }]);
                }
            } catch (err) {
                console.error('Fetch item error:', err);
                setError('Failed to load item data.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
            alert("Maximum 5 photos allowed");
            return;
        }
        const newPhotos = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            file: file // Store the raw file
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (photoId) => {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Validations
        if (formData.title.trim().length < 5) {
            setError('Title must be at least 5 characters long');
            return;
        }

        if (formData.description.trim().length < 10) {
            setError('Description must be at least 10 characters long');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            setError('Price must be a positive number');
            return;
        }

        setSaving(true);
        setError('');

        try {
            let finalImageUrl = photos.length > 0 ? photos[0].url : '';

            // If the first photo is a new file, upload it to Cloudinary
            if (photos.length > 0 && photos[0].file) {
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

                if (!cloudName || cloudName === 'your_cloud_name') {
                    throw new Error("Cloudinary not configured in .env");
                }

                const formDataCloud = new FormData();
                formDataCloud.append('file', photos[0].file);
                formDataCloud.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formDataCloud
                });

                if (!response.ok) {
                    throw new Error("Cloudinary upload failed");
                }

                const data = await response.json();
                finalImageUrl = data.secure_url;
            }

            await updateItem(id, {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                condition: formData.condition,
                image: finalImageUrl,
                status: formData.status === 'Available' ? 'AVAILABLE' : 'SOLD'
            });

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate('/my-listings');
            }, 1500);
        } catch (err) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to update listing.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await deleteItem(id);
            navigate('/my-listings');
        } catch (err) {
            console.error('Delete error:', err);
            alert("Failed to delete listing.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark pt-8 pb-20 relative">

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-500 text-brand-dark px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        Listing updated successfully!
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/my-listings" className="h-10 w-10 rounded-full bg-brand-surface border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-primary/50 transition-all">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-xl font-bold text-white">Edit Your Listing</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>

                <form onSubmit={handleSave} className="space-y-8">

                    {/* Status Section (Special for Edit) */}
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-6 flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${formData.status === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></div>
                            <div>
                                <p className="text-white font-bold text-sm">Item Status</p>
                                <p className="text-gray-500 text-xs">Is this item still for sale?</p>
                            </div>
                        </div>
                        <div className="bg-brand-dark p-1 rounded-2xl border border-white/5 flex gap-1">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, status: 'Available' })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.status === 'Available' ? 'bg-emerald-500 text-brand-dark' : 'text-gray-500 hover:text-white'}`}
                            >
                                Available
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, status: 'Sold' })}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.status === 'Sold' ? 'bg-gray-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Mark as Sold
                            </button>
                        </div>
                    </div>

                    {/* 1. Upload Photos Section */}
                    <div className="space-y-4">
                        <label className="text-white font-bold text-lg flex items-center gap-2 pl-1">
                            <Camera className="h-5 w-5 text-brand-primary" />
                            Manage Photos
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {photos.map((photo) => (
                                <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-white/5 shadow-lg">
                                    <img src={photo.url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(photo.id)}
                                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            {photos.length < 5 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square border-2 border-dashed border-white/10 rounded-2xl bg-brand-surface/50 hover:bg-white/5 hover:border-brand-primary/30 transition-all flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:text-brand-primary group"
                                >
                                    <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Add More</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handlePhotoUpload}
                            className="hidden"
                            multiple
                            accept="image/*"
                        />
                    </div>

                    {/* 2. Item Details */}
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 space-y-6 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-gray-400 text-sm font-bold pl-1">Item Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm font-bold pl-1">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-6 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm font-bold pl-1">Price (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-primary" />
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-brand-dark border border-brand-primary/30 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pl-1 mt-2">
                                    <input
                                        type="checkbox"
                                        id="negotiable"
                                        className="rounded border-white/10 bg-brand-dark text-brand-primary focus:ring-offset-brand-dark"
                                        checked={formData.negotiable}
                                        onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                                    />
                                    <label htmlFor="negotiable" className="text-sm text-gray-500 cursor-pointer select-none">Negotiable</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Condition & Description */}
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl">
                        <div className="space-y-4">
                            <label className="text-gray-400 text-sm font-bold pl-1 uppercase tracking-widest">Condition</label>
                            <div className="flex flex-wrap gap-3">
                                {CONDITIONS.map(condition => (
                                    <button
                                        key={condition}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, condition })}
                                        className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${formData.condition === condition
                                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10'
                                            : 'bg-brand-dark border-white/5 text-gray-500 hover:text-white'
                                            }`}
                                    >
                                        {condition}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-bold pl-1">Description</label>
                            <textarea
                                required
                                rows="5"
                                className="w-full bg-brand-dark border border-white/10 rounded-[28px] py-6 px-8 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium resize-none shadow-inner"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-6 pt-4 text-center">
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm justify-center mb-4">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full bg-brand-primary text-brand-dark font-black text-xl py-5 rounded-[28px] hover:bg-emerald-400 transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-2 group ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Changes
                                    <CheckCircle2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-8">
                            <Link to="/my-listings" className="text-gray-500 hover:text-white text-sm font-bold transition-colors">
                                Discard Changes
                            </Link>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex items-center gap-2 text-red-500/60 hover:text-red-500 text-sm font-bold transition-all"
                            >
                                <X className="h-4 w-4" />
                                Delete Listing
                            </button>
                        </div>

                        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 flex items-start gap-3 text-left">
                            <Info className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                <span className="text-brand-primary font-bold">Pro Tip:</span> Updating your price often moves your listing to the top of "Newest" results!
                            </p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditItemPage;
