import { useState, useEffect } from 'react';
import {
    Heart,
    Trash2,
    ShoppingBag,
    ArrowRight,
    Tag,
    Clock,
    ShieldCheck,
    AlertCircle,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist, addToWishlist } from '../api/wishlist';
import Skeleton from '../components/Skeleton';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [undoItem, setUndoItem] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            setError(''); // Clear any previous errors
            try {
                const data = await getWishlist();
                setWishlist(data);
            } catch (err) {
                console.error('Fetch wishlist error:', err);
                // Only set error for actual failures, not empty wishlists
                if (err.response?.status !== 404) {
                    setError('Failed to load wishlist. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const removeItem = async (id) => {
        const itemToRemove = wishlist.find(item => item.id === id);
        try {
            await removeFromWishlist(id);
            setUndoItem(itemToRemove);
            setWishlist(prev => prev.filter(item => item.id !== id));

            // Hide undo toast after 4 seconds
            setTimeout(() => setUndoItem(null), 4000);
        } catch (err) {
            console.error('Remove item error:', err);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
            try {
                // For now, we clear one by one or we could add a backend endpoint for clear all
                await Promise.all(wishlist.map(item => removeFromWishlist(item.id)));
                setWishlist([]);
            } catch (err) {
                console.error('Clear wishlist error:', err);
            }
        }
    };

    const handleUndo = async () => {
        if (undoItem) {
            try {
                await addToWishlist(undoItem.id);
                setWishlist(prev => [...prev, undoItem]);
                setUndoItem(null);
            } catch (err) {
                console.error('Undo error:', err);
            }
        }
    };

    const optimizeImage = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        if (url.includes('/upload/')) {
            return url.replace('/upload/', '/upload/q_auto,f_auto,w_400/');
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-8 pb-20">
            {/* Undo Notification */}
            {undoItem && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-brand-surface border border-brand-primary/20 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-4">
                        <span className="text-sm">Item removed from wishlist</span>
                        <button
                            onClick={handleUndo}
                            className="text-brand-primary hover:text-emerald-400 text-sm font-black uppercase tracking-widest"
                        >
                            Undo
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">My Wishlist</h1>
                        <p className="text-gray-400 font-medium">
                            {wishlist.length > 0
                                ? `You have ${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved for later.`
                                : "Start saving items you're interested in!"}
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm font-bold transition-colors group"
                        >
                            <Trash2 className="h-4 w-4 group-hover:animate-bounce" />
                            Clear All
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-brand-surface border border-white/5 rounded-[28px] overflow-hidden p-4 flex flex-col gap-4">
                                <Skeleton className="aspect-square w-full rounded-2xl" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-1/3 rounded" />
                                    <Skeleton className="h-6 w-full rounded" />
                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <Skeleton className="h-5 w-1/2 rounded" />
                                        <Skeleton className="h-4 w-4 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="py-20 text-center bg-brand-surface border border-red-500/20 rounded-[40px] px-8">
                        <p className="text-red-400 font-medium mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-primary text-brand-dark font-bold px-6 py-2 rounded-xl"
                        >
                            Retry
                        </button>
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {wishlist.map((item) => (
                            <div key={item.id} className="group relative bg-brand-surface border border-white/5 rounded-[28px] overflow-hidden hover:border-brand-primary/30 transition-all duration-300 shadow-xl flex flex-col h-full">

                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden">
                                    <Link to={`/item/${item.id}`} className="block h-full w-full">
                                        <img
                                            src={optimizeImage(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Unlike Button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute top-3 right-3 h-10 w-10 bg-brand-dark/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-white/10 shadow-xl"
                                    >
                                        <Heart className="h-5 w-5 fill-current" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
                                            {item.category}
                                        </span>
                                    </div>

                                    <Link to={`/item/${item.id}`}>
                                        <h3 className="text-white font-bold text-sm md:text-base mb-3 line-clamp-2 leading-tight">
                                            {item.title}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-brand-primary font-black text-lg">₹{item.price}</span>
                                        </div>

                                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                                <div className="h-5 w-5 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                                    <ShieldCheck className="h-3 w-3 text-brand-primary" />
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-bold truncate">Verified Student</span>
                                            </div>
                                            <Link to="/browse" className="text-brand-primary hover:text-emerald-400 transition-colors">
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty Wishlist State */
                    <div className="py-20 text-center bg-brand-surface border border-white/5 rounded-[40px] px-8 max-w-2xl mx-auto shadow-2xl">
                        <div className="h-24 w-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-primary">
                            <Heart className="h-12 w-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                            See something you like? Tap the heart icon on any item to save it here and keep an eye on price drops!
                        </p>
                        <Link
                            to="/browse"
                            className="inline-flex items-center gap-2 bg-brand-primary text-brand-dark font-black px-10 py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20 active:scale-95"
                        >
                            Go Browsing
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
