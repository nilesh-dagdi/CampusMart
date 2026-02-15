import { Mail, Github, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = ({ onSellClick }) => {
    return (
        <footer className="bg-[--color-brand-dark] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* About Us */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-white text-lg font-bold mb-4">CampusMart</h3>
                        <p className="text-gray-400 text-sm mb-4 max-w-md">
                            The exclusive marketplace for students. Buy, sell, and trade safely within your campus community.
                            Built by students of the CS Dept.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/nilesh__dagdi?igsh=MW0ydXBtaThsOWduMA=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="/#how-it-works" className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors">How it Works</a></li>
                            <li><Link to="/browse" className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors">Browse Items</Link></li>
                            <li>
                                {onSellClick ? (
                                    <button
                                        onClick={onSellClick}
                                        className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors text-left"
                                    >
                                        Sell an Item
                                    </button>
                                ) : (
                                    <Link to="/sell" className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors">Sell an Item</Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center text-gray-400 text-sm">
                                <Mail className="h-4 w-4 mr-2" />
                                nileshdagdi.5904@gmail.com
                            </li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="text-gray-400 hover:text-[--color-brand-primary] text-sm transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} CampusMart. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-xs mt-2 md:mt-0">
                        Made with <span className="text-[--color-brand-primary]">♥</span> for students
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
