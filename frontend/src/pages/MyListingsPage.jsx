import { useState, useEffect } from 'react';
import {
    Plus,
    CheckCircle2,
    Eye,
    Pencil,
    Trash2,
    ShoppingBag,
    ExternalLink,
    Search,
    AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem, updateItem } from '../api/items';

const MyListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyListings = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (!user.id) {
                    setError('Please log in to view your listings.');
                    setLoading(false);
                    return;
                }
                const data = await getItems({ sellerId: user.id });
                setListings(data);
            } catch (err) {
                console.error('Fetch listings error:', err);
                setError('Failed to load your listings.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, []);

    const activeCount = listings.filter(item => item.status === "AVAILABLE").length;

    const toggleSold = async (id) => {
        const itemToToggle = listings.find(item => item.id === id);
        if (!itemToToggle) return;

        const newStatus = itemToToggle.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';

        try {
            await updateItem(id, { ...itemToToggle, status: newStatus });
            setListings(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, status: newStatus };
                }
                return item;
            }));
        } catch (err) {
            console.error('Toggle sold error:', err);
            alert('Failed to update status.');
        }
    };

    const deleteListing = async (id) => {
        if (window.confirm("Are you sure you want to remove this listing entirely?")) {
            try {
                await deleteItem(id);
                setListings(prev => prev.filter(item => item.id !== id));
            } catch (err) {
                console.error('Delete error:', err);
                alert('Failed to delete item. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-8 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Page Header: Status at a Glance */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Listings</h1>
                            {!loading && (
                                <div className="bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full">
                                    <span className="text-brand-primary text-sm font-bold">{activeCount} Active</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">Manage your shop and track your campus sales.</p>
                    </div>

                    <Link to="/sell" className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-brand-primary/20 group">
                        <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                        Post Another Item
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="py-20 text-center bg-brand-surface border border-red-500/20 rounded-[40px] px-8">
                        <p className="text-red-400 font-bold text-xl mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-primary text-brand-dark font-black px-8 py-3 rounded-2xl"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && listings.length === 0 ? (
                    /* 4. The "Zero Listings" State */
                    <div className="bg-brand-surface border border-white/5 rounded-[32px] p-12 text-center space-y-8">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                                <ShoppingBag className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Your shop is empty!</h2>
                            <p className="text-gray-400 max-w-sm mx-auto">Got an old textbook or a chair you don't need? Turn your clutter into cash.</p>
                        </div>
                        <Link to="/sell" className="inline-flex items-center justify-center px-10 py-4 bg-brand-primary text-brand-dark font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20">
                            Start Selling Now
                        </Link>
                    </div>
                ) : !loading && !error && (
                    /* 2 & 3. The Listing Layout (List View) */
                    <div className="space-y-4">
                        {/* Active Items Section Header */}
                        {activeCount > 0 && (
                            <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest pl-2 mb-2">Active Listings</h3>
                        )}

                        {/* Render Items */}
                        <div className="space-y-4">
                            {[...listings].sort((a, b) => a.status === "Sold" ? 1 : -1).map((item) => (
                                <div
                                    key={item.id}
                                    className={`group relative bg-brand-surface border border-white/5 rounded-3xl p-4 lg:p-6 transition-all duration-300 ${item.status === 'SOLD' ? 'opacity-40 grayscale-[0.5]' : 'hover:border-brand-primary/30 shadow-xl'}`}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        {/* Thumbnail */}
                                        <div className="relative h-24 w-24 lg:h-32 lg:w-32 rounded-2xl overflow-hidden flex-shrink-0 bg-brand-dark border border-white/5">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {item.status === 'SOLD' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-widest">Sold</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Info */}
                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{item.category}</span>
                                                {item.status === 'AVAILABLE' && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                )}
                                            </div>
                                            <h3 className="text-white font-bold text-lg lg:text-xl truncate group-hover:text-brand-primary transition-colors mb-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-center sm:justify-start gap-6">
                                                <span className="text-brand-primary font-black text-xl">₹{item.price}</span>
                                                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                                    <Eye className="h-4 w-4" />
                                                    {item.views || 0} views
                                                </div>
                                            </div>
                                        </div>

                                        {/* Management Actions */}
                                        <div className="flex items-center gap-3 lg:gap-4 flex-wrap justify-center">
                                            <button
                                                onClick={() => toggleSold(item.id)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${item.status === 'SOLD'
                                                    ? 'bg-white/5 text-white hover:bg-white/10'
                                                    : 'bg-emerald-500 text-brand-dark hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'}`}
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                                {item.status === 'SOLD' ? "Mark Active" : "Mark as Sold"}
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/edit/${item.id}`}
                                                    className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/30 transition-all shadow-lg"
                                                >
                                                    <Pencil className="h-4 w-4 lg:h-5 lg:w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteListing(item.id)}
                                                    className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center" title="Delete Listing"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <Link to={`/item/${item.id}`} className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all flex items-center justify-center" title="View Publicly">
                                                    <ExternalLink className="h-5 w-5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyListingsPage;
