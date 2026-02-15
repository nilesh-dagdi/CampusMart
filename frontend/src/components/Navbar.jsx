import { useState, useEffect } from 'react';
import { ShoppingBag, User, Plus, Menu, X, LogOut, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getWishlist } from '../api/wishlist';

const Navbar = ({ isLoggedIn, setIsLoggedIn, onLogout, onSellClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [wishlistCount, setWishlistCount] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchWishlistCount = async () => {
            if (isLoggedIn) {
                try {
                    const items = await getWishlist();
                    setWishlistCount(items.length);
                } catch (err) {
                    console.error('Failed to fetch wishlist count:', err);
                    setWishlistCount(0);
                }
            } else {
                setWishlistCount(0);
            }
        };
        fetchWishlistCount();
    }, [isLoggedIn]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            setIsLoggedIn(false);
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer">
                        <ShoppingBag className="h-8 w-8 text-brand-primary mr-2" />
                        <span className="font-bold text-xl text-white">CampusMart</span>
                    </Link>


                    {/* Desktop Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>

                                <Link to="/browse" className={`px-4 py-2 text-sm font-medium transition-colors ${location.pathname === '/browse' ? 'text-brand-primary font-bold' : 'text-gray-300 hover:text-white'}`}>
                                    Explore
                                </Link>
                                <Link to="/my-listings" className={`px-4 py-2 text-sm font-medium transition-colors ${location.pathname === '/my-listings' ? 'text-brand-primary font-bold' : 'text-gray-300 hover:text-white'}`}>
                                    My Listings
                                </Link>
                                <Link to="/sell" className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-accent hover:bg-[#e62e00] focus:outline-none transition-colors shadow-lg hover:shadow-brand-accent/20 mr-2">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Sell
                                </Link>
                                <Link to="/wishlist" className={`relative p-2 transition-colors ${location.pathname === '/wishlist' ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}>
                                    <Heart className="h-6 w-6" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 border-2 border-brand-dark">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="relative ml-2">
                                    <Link to="/profile" className={`flex text-sm border-2 rounded-full focus:outline-none transition duration-150 ease-in-out ${location.pathname === '/profile' ? 'border-brand-primary/50' : 'border-transparent focus:border-white/20'}`}>
                                        <div className={`h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold transition-colors ${location.pathname === '/profile' ? 'text-brand-primary' : 'text-gray-400 hover:text-white'}`}>
                                            {user?.name ? (
                                                user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                            ) : (
                                                <User className="h-5 w-5" />
                                            )}
                                        </div>
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>

                                <Link to="/browse" className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${location.pathname === '/browse' ? 'text-brand-primary font-bold' : 'text-gray-300 hover:text-white'}`}>
                                    Explore
                                </Link>
                                <Link to="/login" className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors ${location.pathname === '/login' ? 'text-brand-primary font-bold' : 'text-gray-300 hover:text-white'}`}>
                                    Sign in
                                </Link>
                                <button
                                    onClick={onSellClick}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none"
                                >
                                    Sell Item
                                </button>
                                <Link to="/signup" className={`px-4 py-2 border border-transparent text-sm font-medium rounded-full focus:outline-none transition-all shadow-lg ${location.pathname === '/signup' ? 'text-white bg-emerald-400 hover:bg-emerald-500' : 'text-brand-dark bg-brand-primary hover:bg-emerald-400 hover:shadow-brand-primary/25'}`}>
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-brand-dark border-t border-white/10">
                    <div className="px-4 pt-2 pb-4 space-y-1">


                        {isLoggedIn ? (
                            <>

                                <Link to="/browse" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5 transition-colors ${location.pathname === '/browse' ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-gray-300 hover:text-white'}`}>
                                    Explore Marketplace
                                </Link>
                                <Link to="/sell" className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-accent hover:bg-[#e62e00] mt-2 mb-2">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Sell Item
                                </Link>
                                <Link to="/wishlist" className={`w-full block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5 transition-colors flex items-center justify-between ${location.pathname === '/wishlist' ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-gray-300 hover:text-white'}`}>
                                    <span>My Wishlist</span>
                                    {wishlistCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{wishlistCount}</span>
                                    )}
                                </Link>
                                <Link to="/my-listings" className={`w-full block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5 transition-colors ${location.pathname === '/my-listings' ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-gray-300 hover:text-white'}`}>
                                    My Listings
                                </Link>
                                <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="h-5 w-5 mr-3" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>

                                <Link to="/browse" className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5 transition-colors ${location.pathname === '/browse' ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-gray-300 hover:text-white'}`}>
                                    Explore Marketplace
                                </Link>
                                <div className="flex space-x-3 px-3 pb-2 pt-2">
                                    <Link to="/login" className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-base font-medium uppercase tracking-wider transition-colors ${location.pathname === '/login' ? 'border-brand-primary/50 text-brand-primary bg-brand-primary/10' : 'border-white/10 text-gray-300 bg-white/5 hover:bg-white/10'}`}>
                                        Login
                                    </Link>
                                    <button
                                        onClick={onSellClick}
                                        className="flex-1 flex items-center justify-center px-4 py-2 border border-white/10 rounded-md shadow-sm text-base font-medium uppercase tracking-wider transition-colors text-gray-300 bg-white/5 hover:bg-white/10"
                                    >
                                        Sell
                                    </button>
                                    <Link to="/signup" className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium uppercase tracking-wider transition-colors ${location.pathname === '/signup' ? 'text-white bg-emerald-400 hover:bg-emerald-500' : 'text-brand-dark bg-brand-primary hover:bg-emerald-400'}`}>
                                        Sign Up
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
