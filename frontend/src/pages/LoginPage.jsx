import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@rtu.ac.in')) {
            setError('Please use your official college email (@rtu.ac.in)');
            return;
        }

        setLoading(true);
        try {
            const data = await login({ email, password });

            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            console.log('Login successful:', data.user);

            // Navigate home - App.js will pick up the auth state on reload or via props
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-brand-dark relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md bg-brand-surface border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-primary/10 text-brand-primary mb-4 shadow-lg shadow-brand-primary/10">
                        <LogIn className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Sign in to your student account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    <div className="flex justify-end px-1">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm text-brand-primary hover:text-emerald-400 transition-colors"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    {error && <p className="text-red-400 text-xs ml-2 animate-pulse">{error}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-brand-primary text-brand-dark font-bold py-4 rounded-2xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-2"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin"></div>
                        ) : (
                            <>Sign In <ArrowRight className="h-4 w-4" /></>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 text-center">
                    <p className="text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="text-brand-primary font-medium hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
