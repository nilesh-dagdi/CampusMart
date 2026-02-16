import { useState, useRef } from 'react';
import {
    Camera,
    X,
    Plus,
    ChevronDown,
    Info,
    CheckCircle2,
    IndianRupee,
    Tag,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../api/items';

const CATEGORIES = ["Academic", "Dorm Essentials", "Electronics", "Transport", "Others"];
const CONDITIONS = ["New", "Like New", "Used - Good", "Worn Out"];

const SellItemPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [photos, setPhotos] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Academic',
        price: '',
        negotiable: false,
        condition: 'Like New',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
            alert("Maximum 5 photos allowed");
            return;
        }

        const newPhotos = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(file),
            file: file // Store the raw file for upload
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (id) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const handlePost = async (e) => {
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

        setLoading(true);
        setError('');

        try {
            let imageUrl = 'https://images.unsplash.com/photo-1544640808-32ca72ac7f60?auto=format&fit=crop&q=80&w=800';

            if (photos.length > 0) {
                // 1. Upload to Cloudinary
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

                if (!cloudName || cloudName === 'your_cloud_name') {
                    throw new Error("Cloudinary Cloud Name not configured in .env");
                }

                const photoToUpload = photos[0].file;
                const formDataCloud = new FormData();
                formDataCloud.append('file', photoToUpload);
                formDataCloud.append('upload_preset', uploadPreset);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: formDataCloud
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "Cloudinary upload failed");
                }

                const data = await response.json();
                imageUrl = data.secure_url;
            }

            // 2. Create item in backend
            await createItem({
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                condition: formData.condition,
                image: imageUrl
            });

            alert("Listing posted successfully!");
            navigate('/browse');
        } catch (err) {
            console.error('Post item error:', err);
            setError(err.message || 'Failed to post item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-8 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Sell an Item</h1>
                    <p className="text-gray-400">Post your essentials and reach the campus community.</p>
                </div>

                <form onSubmit={handlePost} className="space-y-8">

                    {/* 1. Upload Photos Section */}
                    <div className="space-y-4">
                        <label className="text-white font-bold text-lg flex items-center gap-2">
                            <Camera className="h-5 w-5 text-brand-primary" />
                            Upload Photos
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group cursor-pointer"
                        >
                            <div className="h-48 border-2 border-dashed border-white/10 rounded-[32px] bg-brand-surface group-hover:bg-white/5 group-hover:border-brand-primary/30 transition-all flex flex-col items-center justify-center gap-3">
                                <div className="h-14 w-14 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                    <Plus className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold">Drag & Drop or Click to Upload</p>
                                    <p className="text-gray-500 text-sm">Upload up to 5 photos</p>
                                </div>
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

                        {/* Photo Previews */}
                        {photos.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-2">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-brand-surface border border-white/5">
                                        <img src={photo.url} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-dark/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors shadow-lg"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Item Details */}
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-gray-400 text-sm font-bold pl-1">Item Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Engineering Mechanics Textbook"
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
                                        placeholder="0.00"
                                        className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold text-lg"
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
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-8 space-y-8">
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
                                placeholder="e.g. No markings inside, 2024 edition. Bought locally last semester."
                                className="w-full bg-brand-dark border border-white/10 rounded-[28px] py-6 px-8 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium resize-none shadow-inner"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    {/* Errors */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm justify-center animate-in fade-in slide-in-from-top-1">
                            <Info className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    {/* 5. The Post Button */}
                    <div className="space-y-4 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-brand-primary text-brand-dark font-black text-xl py-5 rounded-[28px] hover:bg-emerald-400 transition-all shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-2 group overflow-hidden relative"
                        >
                            <span className="relative z-10">Post My Listing</span>
                            <CheckCircle2 className="relative z-10 h-6 w-6 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 group-hover:h-full transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-10"></div>
                        </button>

                        <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 flex items-start gap-3">
                            <Info className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                <span className="text-brand-primary font-bold">Safety Reminder:</span> By posting, you agree to meet only in safe, public campus areas. Always examine items before completing a transaction.
                            </p>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SellItemPage;
