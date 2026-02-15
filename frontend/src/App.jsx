import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import BrowsePage from './pages/BrowsePage';
import MyListingsPage from './pages/MyListingsPage';
import SellItemPage from './pages/SellItemPage';
import EditItemPage from './pages/EditItemPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import ItemDetailPage from './pages/ItemDetailPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ScrollToTop from './components/ScrollToTop';
import SplashScreen from './components/SplashScreen';
import AuthNotification from './components/AuthNotification';
import Footer from './components/Footer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  // Sync state if localStorage changes (e.g., from other tabs or LoginPage window.location)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSellClick = () => {
    if (isLoggedIn) {
      navigate('/sell');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <ScrollToTop />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <AuthNotification isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="min-h-screen bg-brand-dark font-sans text-gray-300">
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          onLogout={handleLogout}
          onSellClick={handleSellClick}
        />
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} onAuthRequired={() => setShowAuthModal(true)} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/browse" element={<BrowsePage isLoggedIn={isLoggedIn} onAuthRequired={() => setShowAuthModal(true)} />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/sell" element={<SellItemPage />} />
          <Route path="/edit/:id" element={<EditItemPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/item/:id" element={<ItemDetailPage isLoggedIn={isLoggedIn} onAuthRequired={() => setShowAuthModal(true)} />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
        <Footer onSellClick={handleSellClick} />
      </div>
    </>
  );
}

export default App;
