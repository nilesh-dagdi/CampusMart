import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 2500); // Wait for the 2.5s transition to finish
        }, 1200); // Stay at center for 1.2 seconds

        return () => clearTimeout(timeout);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark transition-all duration-[1000ms] ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div
                className={`flex flex-col items-center gap-4 transition-all duration-[2500ms] ${isExiting ? 'translate-y-[-45vh] translate-x-[-42vw] scale-50 opacity-0 blur-sm' : 'scale-125'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                    <ShoppingBag className="h-16 w-16 text-brand-primary relative z-10" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                    Campus<span className="text-brand-primary">Mart</span>
                </h1>
            </div>
        </div>
    );
};

export default SplashScreen;
