import { AlertCircle, X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthNotification = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-brand-surface border border-white/10 rounded-[32px] w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-3xl bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
                        <AlertCircle className="h-10 w-10" />
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Wait a second!</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        You need to be part of the community to sell or wishlist items.
                    </p>

                    <div className="w-full space-y-3">
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full bg-brand-primary text-brand-dark font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20 active:scale-[0.98]"
                        >
                            <LogIn className="h-5 w-5" />
                            Sign In Now
                        </Link>

                        <Link
                            to="/signup"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 w-full bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98] border border-white/5"
                        >
                            <UserPlus className="h-5 w-5 text-gray-400" />
                            Create Account
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-6 text-gray-600 hover:text-gray-400 text-sm font-bold transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthNotification;
