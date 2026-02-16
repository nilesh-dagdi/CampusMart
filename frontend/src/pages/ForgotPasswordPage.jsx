import { useState, useEffect } from 'react';
// Forgot Password Page - Optimized for CampusMart
import { Mail, Lock, Key, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../api/auth';

const ForgotPasswordPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    console.log('ForgotPasswordPage rendering');
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email.endsWith('@rtu.ac.in')) {
            setError('Please use your official college email (@rtu.ac.in)');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            setStep(2);
            setSuccess('OTP sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ email, otp, newPassword });
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Check your OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-brand-dark relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md bg-brand-surface border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-primary/10 text-brand-primary mb-4 shadow-lg shadow-brand-primary/10">
                        {step === 1 ? <Mail className="h-8 w-8" /> : <Key className="h-8 w-8" />}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {step === 1
                            ? "No worries, we'll send you reset instructions."
                            : "Enter the OTP sent to your email and your new password."
                        }
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center gap-3 text-brand-primary text-sm animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                placeholder="your-id@rtu.ac.in"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-2xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                            ) : (
                                <>Send Reset Code <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                maxLength="6"
                                placeholder="6-digit OTP"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all tracking-[0.5em] font-bold"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="New Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="Confirm New Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-2xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                            ) : (
                                <>Reset Password <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-gray-400 text-sm hover:text-white transition-colors py-2"
                        >
                            Didn't get the code? Try again
                        </button>
                    </form>
                )}

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
