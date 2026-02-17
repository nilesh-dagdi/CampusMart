import { FileText, Shield, UserCheck, AlertCircle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-16 lg:pb-24">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-6">
                        <Scale className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Terms of Service
                    </h1>
                </div>

                {/* Content Card */}
                <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="space-y-12 relative z-10">
                        {/* 1. Intro */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <FileText className="h-5 w-5 text-brand-primary" />
                                1. Acceptance of Terms
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                Welcome to CampusMart. By accessing or using our platform, you agree to be bound by these Terms of Service. CampusMart is a marketplace exclusively for verified students. If you do not agree to these terms, please do not use the service.
                            </p>
                        </section>

                        {/* 2. Eligibility */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <UserCheck className="h-5 w-5 text-brand-primary" />
                                2. Eligibility & Verification
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                To use CampusMart, you must be a currently enrolled student. Verification is required via your official university email address (@rtu.ac.in).
                            </p>
                            <ul className="list-disc list-inside text-gray-500 space-y-2 text-sm ml-4">
                                <li>Account sharing is strictly prohibited.</li>
                                <li>You are responsible for maintaining account confidentiality.</li>
                                <li>CampusMart reserves the right to suspend unverified accounts.</li>
                            </ul>
                        </section>

                        {/* 3. Buying & Selling */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <Shield className="h-5 w-5 text-brand-primary" />
                                3. Buying and Selling Rules
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                Our platform facilitates connections between students. We do not handle payments directly.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">For Sellers</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">Ensure item descriptions are accurate. Do not list prohibited items (drugs, weapons, illegal services).</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">For Buyers</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">Inspect items before payment. CampusMart is not responsible for the quality of goods traded.</p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Disclaimers */}
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-brand-primary" />
                                4. Disclaimers
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                CampusMart is provided "as is" without any warranties. We are not liable for any disputes between users, lost items, or fraudulent behavior. Users are encouraged to meet in public campus areas for transactions.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-gray-500 text-sm">
                                Have questions? Reach out to us at <span className="text-brand-primary font-bold">nilesh312213@gmail.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
