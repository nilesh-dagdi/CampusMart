import { useState } from 'react';
import { Mail, ShieldCheck, User, Phone, BookOpen, ArrowRight, CheckCircle2, Plus, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, sendOtp, verifyOtp } from '../api/auth';

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    // const [sentOtp, setSentOtp] = useState(''); // No longer needed
    const [formData, setFormData] = useState({
        name: '',
        year: '1st Year',
        mobile: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (loading) return; // Prevent double clicks

        const isLocal = window.location.hostname === 'localhost';
        if (!email.endsWith('@rtu.ac.in') && !isLocal) {
            setError('Please use your official college email (@rtu.ac.in)');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await sendOtp(email);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOtp(email, otp);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.mobile || !formData.password) {
            setError('Please fill in all fields including a password');
            return;
        }

        if (formData.name.trim().length < 3) {
            setError('Name must be at least 3 characters long');
            return;
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            setError('Mobile number must be exactly 10 digits');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await signup({
                email,
                name: formData.name,
                password: formData.password,
                year: formData.year,
                mobile: formData.mobile,
                otp // Include OTP for backend verification
            });

            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Trigger storage event for App.jsx to update auth state
            window.dispatchEvent(new Event('storage'));

            console.log('User Registered successfully:', data.user);

            // Redirect to browse page after a brief success message
            setTimeout(() => {
                navigate('/browse');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-brand-dark relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md bg-brand-surface border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">

                {/* Progress Indicators */}
                <div className="flex justify-between mb-10 px-2">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2">
                            <div className={`h-2 w-16 rounded-full transition-all duration-300 ${step >= s ? 'bg-brand-primary' : 'bg-white/10'}`}></div>
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Join CampusMart</h2>
                            <p className="text-gray-400">Start by verifying your student email</p>
                        </div>
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="your-id@rtu.ac.in"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm ml-2">{error}</p>}
                            <button
                                disabled={loading}
                                className={`w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-400 shadow-brand-primary/20'}`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send OTP <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Verify OTP</h2>
                            <p className="text-gray-400">Enter the 6-digit code sent to <span className="text-brand-primary block mt-1">{email}</span></p>
                        </div>
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white tracking-[0.5em] text-center font-mono text-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <button className="w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                                Verify & Continue <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-gray-500 text-sm hover:text-white transition-colors"
                            >
                                Use a different email
                            </button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Almost there!</h2>
                            <p className="text-gray-400">Tell us a bit about yourself</p>
                        </div>
                        <form onSubmit={handleCompleteSignup} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Full Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                >
                                    <option className="bg-brand-surface">1st Year</option>
                                    <option className="bg-brand-surface">2nd Year</option>
                                    <option className="bg-brand-surface">3rd Year</option>
                                    <option className="bg-brand-surface">4th Year</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="Mobile Number"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Create Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm justify-center animate-in fade-in slide-in-from-top-1">
                                    <ShieldCheck className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                            <button className="w-full bg-brand-accent text-white font-bold py-3 rounded-2xl hover:bg-[#e62e00] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20">
                                Complete Signup <Plus className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white">Welcome aboard!</h2>
                            <p className="text-gray-400">Account created successfully for <br /><span className="text-white font-medium">{email}</span></p>
                            <p className="text-brand-primary text-sm font-medium animate-pulse mt-4">Redirecting you to marketplace...</p>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default SignupPage;
