import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    Heart,
    ShieldCheck,
    LayoutGrid,
    List,
    BookOpen,
    Laptop,
    Armchair,
    Shirt,
    ArrowRight,
    Sparkles,
    Clock,
    Layers,
    Bike,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getItems } from '../api/items';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist';
import Skeleton from '../components/Skeleton';

const CATEGORIES = [
    { name: "Academic", icon: BookOpen },
    { name: "Dorm Essentials", icon: Armchair },
    { name: "Electronics", icon: Laptop },
    { name: "Transport", icon: Bike },
    { name: "Others", icon: Layers },
];

const BrowsePage = ({ isLoggedIn, onAuthRequired }) => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const params = {};
                if (selectedCategory !== "All") params.category = selectedCategory;
                if (searchQuery) params.search = searchQuery;

                const [itemsData, wishlistData] = await Promise.all([
                    getItems(params),
                    isLoggedIn ? getWishlist().catch(() => []) : Promise.resolve([])
                ]);

                setProducts(itemsData);
                setWishlistIds(new Set(wishlistData.map(item => item.id)));
            } catch (err) {
                console.error('Fetch products error:', err);
                setError('Failed to load items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchInitialData, searchQuery ? 500 : 0);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, selectedCategory]);

    const toggleWishlist = async (productId) => {
        if (!isLoggedIn) {
            onAuthRequired();
            return;
        }
        try {
            if (wishlistIds.has(productId)) {
                await removeFromWishlist(productId);
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            } else {
                await addToWishlist(productId);
                setWishlistIds(prev => new Set(prev).add(productId));
            }
        } catch (err) {
            console.error('Toggle wishlist error:', err);
        }
    };

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            if (sortBy === "Cheapest") return a.price - b.price;
            if (sortBy === "Expensive") return b.price - a.price;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [products, sortBy]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const optimizeImage = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        // Add auto quality and fetch format, and set width to 400 for thumbnails
        if (url.includes('/upload/')) {
            return url.replace('/upload/', '/upload/q_auto,f_auto,w_400/');
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-8 pb-20">
            {/* Login Prompt Toast */}
            {showLoginMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-brand-accent text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 border border-brand-accent/20">
                        <AlertCircle className="h-6 w-6" />
                        Please login or sign up first!
                    </div>
                </div>
            )}
            <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            <div className="pt-2">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-brand-primary" />
                                    Categories
                                </h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory("All")}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedCategory === "All" ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <span className="font-medium text-sm">All Items</span>
                                        <span className="text-xs opacity-50">{products.length}</span>
                                    </button>
                                    {CATEGORIES.map((cat) => {
                                        const count = products.filter(p => p.category === cat.name).length;
                                        return (
                                            <button
                                                key={cat.name}
                                                onClick={() => setSelectedCategory(cat.name)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.name ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <cat.icon className="h-4 w-4" />
                                                    <span className="font-medium text-sm">{cat.name}</span>
                                                </div>
                                                <span className="text-xs opacity-50">{count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-6 rounded-[28px] bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 border border-white/5 space-y-4">
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">Selling something?</h4>
                                    <p className="text-gray-400 text-[10px] leading-relaxed">Turn your unused items into cash by reaching the whole campus.</p>
                                </div>
                                {isLoggedIn ? (
                                    <Link to="/sell" className="w-full bg-brand-primary/20 hover:bg-brand-primary/30 text-brand-primary border border-brand-primary/20 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                                        <Plus className="h-3.5 w-3.5" />
                                        Post Listing
                                    </Link>
                                ) : (
                                    <button
                                        onClick={onAuthRequired}
                                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-3.5 w-3.5 text-brand-primary" />
                                        Post Listing
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Header Section (Search + Sort) - Now aligned with sidebar */}
                        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
                            <div className="flex-1 w-full lg:mr-12 relative group">
                                <Search className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-5 lg:h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for Lab Coats, Mattresses, Cycles..."
                                    className="w-full bg-brand-surface border border-white/10 rounded-[20px] lg:rounded-[24px] py-2.5 lg:py-3.5 pl-11 lg:pl-16 pr-6 lg:pr-8 text-sm lg:text-base text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all shadow-2xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 lg:w-48 justify-end w-full lg:w-auto px-1">
                                <span className="text-gray-400 text-[10px] lg:text-sm font-medium whitespace-nowrap">Sort by:</span>
                                <div className="relative">
                                    <select
                                        className="bg-brand-surface border border-white/10 text-white rounded-lg lg:rounded-xl py-2 lg:py-2.5 pl-3 lg:pl-4 pr-8 lg:pr-10 appearance-none focus:outline-none focus:border-brand-primary/50 transition-colors cursor-pointer text-xs lg:text-sm"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Newest</option>
                                        <option>Cheapest</option>
                                        <option>Expensive</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Filter Chips - Mobile/Tablet Only */}
                        <div className="flex lg:hidden gap-2 overflow-x-auto pb-6 scrollbar-hide">
                            <button
                                onClick={() => setSelectedCategory("All")}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategory === "All" ? 'bg-brand-primary text-brand-dark border-brand-primary' : 'bg-brand-surface border-white/10 text-gray-400'}`}
                            >
                                All Items
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat.name ? 'bg-brand-primary text-brand-dark border-brand-primary' : 'bg-brand-surface border-white/10 text-gray-400'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="bg-brand-surface border border-white/5 rounded-2xl lg:rounded-3xl overflow-hidden p-3 lg:p-5 flex flex-col gap-4">
                                        <Skeleton className="aspect-square lg:aspect-[4/3] w-full rounded-xl lg:rounded-2xl" />
                                        <div className="space-y-3">
                                            <Skeleton className="h-4 w-1/4 rounded" />
                                            <Skeleton className="h-6 w-full rounded" />
                                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                                <Skeleton className="h-4 w-1/3 rounded" />
                                                <Skeleton className="h-4 w-1/4 rounded" />
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
                        ) : sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
                                {sortedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group bg-brand-surface border border-white/5 rounded-2xl lg:rounded-3xl overflow-hidden hover:border-brand-primary/30 transition-all duration-300 shadow-xl flex flex-col h-full"
                                    >
                                        {/* Image Container */}
                                        <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden">
                                            <Link to={`/item/${product.id}`} className="block h-full w-full">
                                                <img
                                                    src={optimizeImage(product.image)}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </Link>
                                            {/* Price Badge */}
                                            <div className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-brand-dark/80 backdrop-blur-md px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl border border-white/10">
                                                <span className="text-brand-primary font-bold text-xs lg:text-base">₹{product.price}</span>
                                            </div>
                                            {/* Save Button */}
                                            <button
                                                onClick={() => toggleWishlist(product.id)}
                                                className={`absolute top-2 lg:top-4 right-2 lg:right-4 h-8 w-8 lg:h-10 lg:w-10 bg-brand-dark/80 backdrop-blur-md rounded-lg lg:rounded-xl flex items-center justify-center transition-colors border border-white/10 ${wishlistIds.has(product.id) ? 'text-red-500' : 'text-white hover:text-red-400'}`}
                                            >
                                                <Heart className={`h-4 w-4 lg:h-5 lg:w-5 ${wishlistIds.has(product.id) ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-3 lg:p-5 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[8px] lg:text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-white/5 px-1.5 lg:px-2 py-0.5 rounded-md border border-white/5">
                                                    {product.category}
                                                </span>
                                                <div className="flex items-center gap-1 text-[8px] lg:text-[10px] text-brand-secondary font-medium whitespace-nowrap overflow-hidden">
                                                    <Clock className="h-2.5 w-2.5 lg:h-3 lg:w-3" /> {formatTime(product.createdAt)}
                                                </div>
                                            </div>

                                            <Link to={`/item/${product.id}`}>
                                                <h3 className="text-white font-bold text-sm lg:text-lg mb-2 lg:mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors leading-tight lg:leading-normal">
                                                    {product.title}
                                                </h3>
                                            </Link>

                                            <div className="mt-auto pt-3 lg:pt-4 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 lg:gap-2 overflow-hidden">
                                                    <div className="h-5 w-5 lg:h-6 lg:w-6 rounded-full bg-brand-primary/20 flex-shrink-0 flex items-center justify-center">
                                                        <ShieldCheck className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-brand-primary" />
                                                    </div>
                                                    <span className="text-[10px] lg:text-xs text-gray-400 font-medium truncate">Verified Student</span>
                                                </div>
                                                <div className="text-[8px] lg:text-[10px] font-bold text-gray-500 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-lg border border-white/10 flex-shrink-0">
                                                    {product.condition}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-brand-surface border border-white/5 rounded-[40px] px-8">
                                <div className="h-20 w-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-primary">
                                    <Search className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">No matching items found</h3>
                                <p className="text-gray-400 max-w-sm mx-auto mb-8">
                                    We couldn't find anything matching your search. Try different keywords or adjust the filters.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                            setSortBy("Newest");
                                        }}
                                        className="bg-brand-primary text-brand-dark font-black px-8 py-3 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20"
                                    >
                                        Clear all filters
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowsePage;
