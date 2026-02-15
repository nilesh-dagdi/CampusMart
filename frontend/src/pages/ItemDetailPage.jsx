import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Heart,
    MessageSquare,
    Phone,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Clock,
    MapPin,
    Info,
    Share2,
    Calendar,
    IndianRupee,
    User,
    CheckCircle2,
    Sparkles,
    AlertCircle,
    Pencil,
    Trash2
} from 'lucide-react';
import { getItemById, deleteItem } from '../api/items';
import { initiatePurchase } from '../api/purchases';

const ItemDetailPage = ({ isLoggedIn, onAuthRequired }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const [interestSent, setInterestSent] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            try {
                const data = await getItemById(id);
                // Get current user to check ownership
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const isOwner = user.id === data.sellerId;

                const transformedItem = {
                    ...data,
                    isOwner,
                    images: [data.image],
                    postedDate: formatTime(data.createdAt),
                    specs: [
                        { label: "Category", value: data.category },
                        { label: "Condition", value: data.condition },
                        { label: "Posted", value: new Date(data.createdAt).toLocaleDateString() }
                    ]
                };
                setItem(transformedItem);
            } catch (err) {
                console.error('Fetch item error:', err);
                setError('Failed to load item details.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const handleBack = () => navigate(-1);

    const toggleLike = () => {
        if (!isLoggedIn) {
            onAuthRequired ? onAuthRequired() : setShowLoginMsg(true);
            return;
        }
        setIsLiked(!isLiked);
        if (!isLiked) {
            setToast({ show: true, message: "Saved to Wishlist!" });
            setTimeout(() => setToast({ show: false, message: "" }), 2000);
        }
    };

    const handleSendInterest = async () => {
        if (!isLoggedIn) {
            onAuthRequired ? onAuthRequired() : setShowLoginMsg(true);
            return;
        }

        try {
            const purchaseData = await initiatePurchase(id);
            setInterestSent(true);

            // Construct WhatsApp Message
            const buyer = JSON.parse(localStorage.getItem('user') || '{}');
            const sellerMobile = purchaseData.seller?.mobile;
            const sellerName = purchaseData.seller?.name || 'Seller';

            if (sellerMobile) {
                const message = `Hi ${sellerName}, I'm interested in buying your product "${item.title}" listed on CampusMart for ₹${item.price}.\n\nMy Details:\nName: ${buyer.name}\nYear: ${buyer.year}\nMobile: ${buyer.mobile}\n\nIs it still available?`;
                const encodedMessage = encodeURIComponent(message);

                // Open WhatsApp link
                // Clean mobile number (remove spaces, etc.) and add +91 if needed
                const cleanMobile = sellerMobile.replace(/\D/g, '');
                const finalMobile = cleanMobile.startsWith('91') ? cleanMobile : `91${cleanMobile}`;

                window.open(`https://wa.me/${finalMobile}?text=${encodedMessage}`, '_blank');
            }

            setToast({ show: true, message: "Opening WhatsApp to contact seller..." });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send interest.';
            setToast({ show: true, message: `Error: ${errorMessage}` });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: item.description,
                    url: window.location.href,
                });
                setToast({ show: true, message: "Item shared successfully!" });
                setTimeout(() => setToast({ show: false, message: "" }), 3000);
            } catch (error) {
                console.error('Error sharing:', error);
                setToast({ show: true, message: "Failed to share item." });
                setTimeout(() => setToast({ show: false, message: "" }), 3000);
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            navigator.clipboard.writeText(window.location.href);
            setToast({ show: true, message: "Link copied to clipboard!" });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        }
    };

    const handleDeleteItem = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;

        try {
            await deleteItem(id);
            setToast({ show: true, message: "Listing deleted successfully!" });
            setTimeout(() => {
                setToast({ show: false, message: "" });
                navigate('/my-listings');
            }, 1500);
        } catch (err) {
            console.error('Delete error:', err);
            setToast({ show: true, message: "Error: Failed to delete listing." });
            setTimeout(() => setToast({ show: false, message: "" }), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20 pt-6">

            {/* Login Prompt Toast */}


            {/* Success Toast */}
            {toast.show && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-500 text-brand-dark px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Link */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                        <ChevronLeft className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Marketplace</span>
                </button>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center bg-brand-surface border border-red-500/20 rounded-[40px] px-8">
                        <p className="text-red-400 font-bold text-xl mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-primary text-brand-dark font-black px-8 py-3 rounded-2xl"
                        >
                            Try Again
                        </button>
                    </div>
                ) : item && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* LEFT: Image Gallery (7/12) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="relative aspect-square lg:aspect-[4/3] rounded-[40px] overflow-hidden bg-brand-surface border border-white/5 shadow-2xl group">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain p-4 lg:p-8"
                                />

                                {/* Wishlist Overlay */}
                                <button
                                    onClick={toggleLike}
                                    className={`absolute top-6 right-6 h-14 w-14 rounded-3xl backdrop-blur-md border flex items-center justify-center transition-all shadow-2xl pulse-glow ${isLiked ? 'bg-red-500 border-red-400 text-white' : 'bg-brand-dark/80 border-white/10 text-gray-400 hover:text-white'}`}
                                >
                                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Description Section */}
                            <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 lg:p-10 shadow-2xl mt-12">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                    <Info className="h-6 w-6 text-brand-primary" />
                                    Item Description
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-lg mb-8">
                                    {item.description}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {item.specs.map((spec, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-brand-dark border border-white/5">
                                            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{spec.label}</span>
                                            <span className="text-white font-medium">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Action Sidebar (5/12) */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* 1. Main Info & Price */}
                            <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-primary to-brand-accent"></div>

                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
                                        {item.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                        <Clock className="h-3.5 w-3.5" />
                                        {item.postedDate}
                                    </div>
                                </div>

                                <h1 className="text-3xl font-black text-white mb-4 leading-tight">
                                    {item.title}
                                </h1>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                        <div className={`h-2 w-2 rounded-full ${item.condition.includes('New') ? 'bg-emerald-500' : 'bg-brand-accent'}`}></div>
                                        <span className="text-gray-300 text-xs font-bold">{item.condition}</span>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-3 mb-8">
                                    <span className="text-5xl font-black text-white flex items-center">
                                        <IndianRupee className="h-8 w-8 text-brand-primary" />
                                        {item.price}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {item.isOwner ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link
                                                to={`/edit/${item.id}`}
                                                className="bg-brand-primary text-brand-dark font-black text-lg py-5 rounded-3xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                            >
                                                <Pencil className="h-5 w-5" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={handleDeleteItem}
                                                className="bg-red-500 text-white font-black text-lg py-5 rounded-3xl hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                                Delete
                                            </button>
                                        </div>
                                    ) : !interestSent ? (
                                        <button
                                            onClick={handleSendInterest}
                                            className="w-full bg-brand-primary text-brand-dark font-black text-xl py-5 rounded-3xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            {isLoggedIn ? "I'm Interested - Notify Seller" : "Sign in to Buy"}
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <button
                                                disabled
                                                className="w-full bg-white/5 text-gray-500 border border-white/10 font-black text-xl py-5 rounded-3xl flex items-center justify-center gap-3 cursor-not-allowed"
                                            >
                                                Interest Sent <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                            </button>
                                            <p className="text-gray-500 text-sm text-center font-medium leading-relaxed">
                                                The seller has been notified with your profile details. They will contact you if the item is still available.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Share */}
                            <div className="flex items-center justify-center pt-4">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share Item
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default ItemDetailPage;
