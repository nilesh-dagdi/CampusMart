import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Camera, MapPin, Shield, DollarSign, BookOpen, Laptop, Armchair, Shirt, Sparkles, CheckCircle2, AlertCircle, Bike, Clock, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getItems } from '../api/items';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist';

const LandingPage = ({ isLoggedIn, onAuthRequired }) => {
    const navigate = useNavigate();
    const [showLoginMsg, setShowLoginMsg] = useState(false);
    const [recentItems, setRecentItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        Academic: 0,
        "Dorm Essentials": 0,
        Electronics: 0,
        Transport: 0
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [data, wishlistData] = await Promise.all([
                    getItems(),
                    isLoggedIn ? getWishlist().catch(() => []) : Promise.resolve([])
                ]);

                setRecentItems(data.slice(0, 4));
                setWishlistIds(new Set(wishlistData.map(item => item.id)));

                // Calculate counts
                const newCounts = {
                    Academic: data.filter(i => i.category === 'Academic').length,
                    "Dorm Essentials": data.filter(i => i.category === 'Dorm Essentials').length,
                    Electronics: data.filter(i => i.category === 'Electronics').length,
                    Transport: data.filter(i => i.category === 'Transport').length
                };
                setCounts(newCounts);
            } catch (err) {
                console.error('Fetch initial data error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [isLoggedIn]);

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

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-primary opacity-15 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-secondary opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-primary/30 border border-brand-primary/40 mb-8 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 text-brand-primary mr-2" />
                        <span className="text-sm font-medium text-brand-primary">Just launched for Campus</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                        Find What You Need <br className="hidden md:block" />
                        <span className="text-brand-accent"></span>Sell what you don't.
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                        A platform to buy and sell high quality student essentials with beautiful & modular designs, guided by verified students and an active community.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/browse"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-full text-brand-dark bg-brand-primary hover:bg-emerald-400 transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40"
                        >
                            Browse Items <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </div>


                </div>
            </section>



            {/* 2. How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white/5 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-brand-secondary font-semibold tracking-wide uppercase">Simple Process</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            How It Works
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex flex-col items-center text-center group">
                            <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-surface border border-white/10 text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                <Shield className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">1. Verify</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Sign up with your official college email. We ensure only real students join the platform.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-surface border border-white/10 text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                <Camera className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">2. List or Browse</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Snap a photo to sell, or search for what you need using our filters.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-brand-surface border border-white/10 text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                <MapPin className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">3. Meet Up</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Message to agree on a price, and meet on campus to swap the item.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Why Use CampusMart (Benefits) */}
            <section className="py-24 bg-brand-dark border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Run by Students, For Students
                        </h2>
                        <p className="mt-4 text-xl text-gray-400">
                            Why we are better than generic marketplaces.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-brand-surface border border-white/5 rounded-3xl p-8 hover:border-brand-primary/30 transition-colors duration-300">
                            <div className="text-brand-primary mb-4">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Verified Community</h3>
                            <p className="text-gray-400">No random strangers. Everyone here is a verified student from your campus.</p>
                        </div>
                        <div className="bg-brand-surface border border-white/5 rounded-3xl p-8 hover:border-brand-primary/30 transition-colors duration-300">
                            <div className="text-brand-primary mb-4">
                                <MapPin className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Zero Travel</h3>
                            <p className="text-gray-400">Everything is within walking distance. No expensive shipping or long drives.</p>
                        </div>
                        <div className="bg-brand-surface border border-white/5 rounded-3xl p-8 hover:border-brand-primary/30 transition-colors duration-300">
                            <div className="text-brand-primary mb-4">
                                <DollarSign className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Hidden Fees</h3>
                            <p className="text-gray-400">100% free for students. Keep all the profit from your sales.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Featured Categories */}
            <section className="py-24 bg-gradient-to-b from-brand-dark to-brand-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
                        <Link to="/browse" className="text-brand-primary font-medium hover:text-emerald-400 flex items-center transition-colors">
                            View all <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Link to="/browse?category=Academic" className="group block">
                            <div className="relative h-64 bg-brand-surface border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"
                                    alt="Academic"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">Academic</h3>
                                    <p className="text-sm text-gray-500">{counts.Academic}</p>
                                </div>
                                <div className="absolute top-6 right-6 text-gray-400 group-hover:text-white transition-colors bg-brand-dark/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                            </div>
                        </Link>

                        <Link to="/browse?category=Dorm Essentials" className="group block">
                            <div className="relative h-64 bg-brand-surface border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"
                                    alt="Dorm Essentials"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">Dorm Essentials</h3>
                                    <p className="text-sm text-gray-500">{counts["Dorm Essentials"]}</p>
                                </div>
                                <div className="absolute top-6 right-6 text-gray-400 group-hover:text-white transition-colors bg-brand-dark/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                    <Armchair className="h-8 w-8" />
                                </div>
                            </div>
                        </Link>

                        <Link to="/browse?category=Electronics" className="group block">
                            <div className="relative h-64 bg-brand-surface border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600"
                                    alt="Electronics"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">Electronics</h3>
                                    <p className="text-sm text-gray-500">{counts.Electronics}</p>
                                </div>
                                <div className="absolute top-6 right-6 text-gray-400 group-hover:text-white transition-colors bg-brand-dark/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                    <Laptop className="h-8 w-8" />
                                </div>
                            </div>
                        </Link>

                        <Link to="/browse?category=Transport" className="group block">
                            <div className="relative h-64 bg-brand-surface border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300">
                                <img
                                    src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600"
                                    alt="Transport"
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">Transport</h3>
                                    <p className="text-sm text-gray-500">{counts.Transport}</p>
                                </div>
                                <div className="absolute top-6 right-6 text-gray-400 group-hover:text-white transition-colors bg-brand-dark/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                    <Bike className="h-8 w-8" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
