import { useContext } from 'react';
import { AppCtx, AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import RepairPage from './pages/RepairPage';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';

function AppRouter() {
  const { user, page } = useContext(AppCtx);

  if (!user) return <LoginPage />;

  const renderPage = () => {
    // Admin always sees AdminPanel
    if (user.role === 'admin') return <AdminPanel />;

    switch (page) {
      case 'home':        return <HomePage />;
      case 'aquafeed':    return <ProductPage category="aquafeed"    title="Aqua Feed"   subtitle="Premium fish & shrimp feeds, supplements"          icon="🐟" />;
      case 'medicine':    return <ProductPage category="medicine"    title="Medicine"    subtitle="Disease treatments, water care & vitamins"           icon="💊" />;
      case 'repair':      return <RepairPage />;
      case 'marketplace': return <MarketplacePage />;
      case 'cart':        return <CartPage />;
      default:            return <HomePage />;
    }
  };

  return (
    <div>
      <Navbar />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
