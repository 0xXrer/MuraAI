import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslations } from "../../locales/translations";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentLanguage } = useLanguage();
  const t = useTranslations(currentLanguage);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide header when scrolling down and past a threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setMobileMenuOpen(false); // Close mobile menu when hiding
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md bg-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="MuraAI Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MuraAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              {t("home")}
            </Link>
            <Link
              to="/catalog"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              {t("catalog")}
            </Link>
            <Link
              to="/upload"
              className="bg-gradient-to-r from-primary to-secondary text-black px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {t("addHeritage")}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              to="/catalog"
              className="block text-gray-700 hover:text-primary transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("catalog")}
            </Link>
            <Link
              to="/upload"
              className="block bg-gradient-to-r from-primary to-secondary text-black px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("addHeritage")}
            </Link>
            <div className="pt-3 border-t border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
