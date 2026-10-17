import { CurrencyProvider } from "./lib/CurrencyContext";
import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureBar from "./components/FeatureBar";
import Catalog from "./components/Catalog";
import Editorial from "./components/Editorial";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function App() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-obsidian text-frost">
        <TopBar />
        <Header />
        <main>
          <Hero />
          <FeatureBar />
          <Catalog />
          <Editorial />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </CurrencyProvider>
  );
}
