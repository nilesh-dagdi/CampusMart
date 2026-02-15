import { useState, useRef, useEffect } from 'react';
import {
    User,
    Camera,
    Pencil,
    Check,
    X,
    ShieldCheck,
    Mail,
    Phone,
    Home,
    TextQuote,
    Lock,
    Bell,
    LogOut,
    Trash2,
    CheckCircle2,
    Calendar,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteAccount, changePassword as changePasswordApi } from '../api/user';

const ProfilePage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(null); // stores the key of the field being edited
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        mobile: "",
        year: "",
    });

    const [loading, setLoading] = useState(true);
    const [tempValue, setTempValue] = useState("");

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfileData({
                    name: data.name || "",
                    email: data.email || "",
                    mobile: data.mobile || "",
                    year: data.year || "",
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setToastMessage("Failed to load profile.");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditStart = (field, value) => {
        setIsEditing(field);
        setTempValue(value);
    };

    const handleEditSave = async (field) => {
        try {
            const updatedData = { ...profileData, [field]: tempValue };
            await updateProfile({
                name: updatedData.name,
                year: updatedData.year,
                mobile: updatedData.mobile
            });
            setProfileData(updatedData);
            setIsEditing(null);
            setToastMessage("Profile updated!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error('Update failed:', err);
            setToastMessage("Failed to update profile.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleEditCancel = () => {
        setIsEditing(null);
        setTempValue("");
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setToastMessage("Photo updated!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            await changePasswordApi({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setShowPasswordModal(false);
            setToastMessage("Password updated successfully!");
            setShowToast(true);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error('Password update failed:', err);
            alert(err.response?.data?.message || "Failed to update password.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This will permanently delete all your listings, messages, and profile data.")) {
            try {
                await deleteAccount();
                setToastMessage("Account deleted successfully.");
                setShowToast(true);

                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Disatch event for Navbar
                window.dispatchEvent(new Event('storage'));

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (err) {
                console.error('Delete failed:', err);
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
            </div>
        );
    }

    const renderPasswordModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
            <div className="relative bg-brand-surface border border-white/5 rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={() => setShowPasswordModal(false)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <h3 className="text-2xl font-black text-white mb-2 leading-tight">Update Password</h3>
                <p className="text-gray-500 text-sm mb-8">Keep your account secure by using a strong password.</p>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Current Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            className="w-full bg-brand-dark border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-brand-dark font-black text-lg py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-brand-primary/20 mt-4 active:scale-[0.98]"
                    >
                        Update Password
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="w-full text-gray-500 hover:text-white text-sm font-bold transition-colors py-2"
                    >
                        Maybe Later
                    </button>
                </form>
            </div>
        </div>
    );

    const renderEditableRow = ({ label, field, value, icon: Icon, isLocked = false }) => {
        const active = isEditing === field;

        return (
            <div key={field} className="group flex items-center justify-between py-6 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4 flex-1">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-brand-primary transition-colors">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                        {active ? (
                            <input
                                type="text"
                                className="w-full bg-brand-dark border border-brand-primary/30 rounded-lg py-1 px-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <p className={`text-white font-medium ${isLocked ? 'opacity-50' : ''}`}>{value}</p>
                        )}
                    </div>
                </div>

                {!isLocked && (
                    <div className="ml-4">
                        {active ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEditSave(field)}
                                    className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-brand-dark transition-all"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleEditCancel}
                                    className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => handleEditStart(field, value)}
                                className="h-8 w-8 rounded-lg bg-white/5 text-gray-500 flex items-center justify-center hover:text-brand-primary hover:bg-brand-primary/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
                {isLocked && (
                    <div className="ml-4 h-8 w-8 flex items-center justify-center text-emerald-500/40">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-12 pb-20 relative">

            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-500 text-brand-dark px-6 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5" />
                        {toastMessage}
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && renderPasswordModal()}

            <div className="max-w-2xl mx-auto px-4">

                {/* 1. Header (Identity) */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-4xl font-black text-brand-dark shadow-2xl relative">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-brand-surface border-4 border-brand-dark text-gray-400 hover:text-white flex items-center justify-center transition-all shadow-xl group"
                        >
                            <Camera className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{profileData.name}</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Student
                    </div>
                </div>

                {/* 2. Information List */}
                <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 mb-8 shadow-2xl">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-brand-primary" />
                        Personal Details
                    </h3>
                    <div className="divide-y divide-white/5">
                        {renderEditableRow({
                            label: "Full Name",
                            field: "name",
                            value: profileData.name,
                            icon: User
                        })}
                        {renderEditableRow({
                            label: "College Email",
                            field: "email",
                            value: profileData.email,
                            icon: Mail,
                            isLocked: true
                        })}
                        {renderEditableRow({
                            label: "Phone Number",
                            field: "mobile",
                            value: profileData.mobile,
                            icon: Phone
                        })}
                        {renderEditableRow({
                            label: "Academic Year",
                            field: "year",
                            value: profileData.year,
                            icon: Calendar
                        })}
                    </div>
                </div>

                {/* 3. Account Settings & Safety */}
                <div className="bg-brand-surface border border-white/5 rounded-[40px] p-8 space-y-8 shadow-2xl">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                            <Lock className="h-5 w-5 text-brand-primary" />
                            Account & Safety
                        </h3>

                        <div className="space-y-4">
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-dark border border-white/5 hover:border-brand-primary/30 transition-all text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <Lock className="h-5 w-5 text-gray-500 group-hover:text-brand-primary transition-colors" />
                                    <span className="text-white font-medium">Change Password</span>
                                </div>
                                <Pencil className="h-4 w-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
                            </button>

                            <div className="p-4 rounded-2xl bg-brand-dark border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-5 w-5 text-gray-500" />
                                        <span className="text-white font-medium">Email Notifications</span>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, emailNotifications: !s.emailNotifications }))}
                                        className={`w-12 h-6 rounded-full transition-all relative ${settings.emailNotifications ? 'bg-brand-primary' : 'bg-gray-700'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.emailNotifications ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-6">
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.dispatchEvent(new Event('storage'));
                                navigate('/login');
                            }}
                            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-500/5 py-4 rounded-2xl transition-all border border-red-500/10"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout of account
                        </button>

                        <div className="text-center">
                            <button
                                onClick={handleDeleteAccount}
                                className="text-gray-600 hover:text-red-500 text-sm font-bold transition-colors flex items-center gap-2 mx-auto"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete account & data
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
