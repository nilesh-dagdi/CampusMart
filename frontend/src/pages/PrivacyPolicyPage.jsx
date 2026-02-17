import { ShieldCheck, Lock, Eye, Mail, Database, UserCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-brand-dark">
            <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-16 lg:pb-24">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-6">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        Privacy Policy
                    </h1>
                </div>

                {/* Content Card */}
                <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="space-y-12 relative z-10">
                        {/* Main Statement */}
                        <section className="bg-white/5 border border-white/5 p-8 rounded-[32px] mb-12">
                            <p className="text-white text-lg leading-relaxed font-medium">
                                At CampusMart, we take your campus privacy seriously. We collect minimal personal information, including your name, college email address, and phone number, solely to verify your student status and facilitate connections between buyers and sellers.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Verification */}
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <UserCheck className="h-5 w-5 text-brand-primary" />
                                    Authentication
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Your college email is used for authentication purposes only and will never be shared publicly. We ensure only verified campus members can access the marketplace.
                                </p>
                            </section>

                            {/* Data Sharing */}
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Eye className="h-5 w-5 text-brand-primary" />
                                    Information Sharing
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    When you express interest in an item, your profile details (name and contact info) are shared only with that specific seller to allow them to contact you.
                                </p>
                            </section>

                            {/* Security */}
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-brand-primary" />
                                    Data Security
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    We use industry-standard encryption to protect your data and hashed passwords to ensure account security. We do not sell or trade your data to marketing firms.
                                </p>
                            </section>

                            {/* Control */}
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Database className="h-5 w-5 text-brand-primary" />
                                    Account Control
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    By using this platform, you consent to the collection and use of this information. You may update or remove your data at any time through your Profile settings.
                                </p>
                            </section>
                        </div>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-gray-500 text-sm">
                                Privacy concerns? Contact us at <span className="text-brand-primary font-bold">nilesh312213@gmail.com</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
