import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Music,
  BookOpen,
  Users,
  Palette,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import HeritageCard from "../components/HeritageCard";
import { HERITAGE_TYPES } from "../utils/constants";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslations } from "../locales/translations";

export default function HomePage() {
  const { currentLanguage } = useLanguage();
  const t = useTranslations(currentLanguage);
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, byType: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load recent items
      const { data: items } = await supabase
        .from("heritage_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (items) {
        setRecentItems(items);

        // Calculate stats
        const total = items.length;
        const byType = items.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {});

        setStats({ total, byType });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = { Music, BookOpen, Users, Palette };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background - Extends above header */}
      <section className="relative overflow-hidden -mt-16 pt-32 pb-20 min-h-[100vh] flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/glass-animation.mp4" type="video/mp4" />
          </video>
          {/* Gradient Overlay - with fade to white at bottom */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-secondary/80" />
          {/* Bottom gradient fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Glass Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Sparkles className="h-16 w-16 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow-md">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                {t("addHeritage")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition-all border-2 border-white/40 hover:scale-105 transform shadow-lg"
              >
                {t("exploreCatalog")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HERITAGE_TYPES.map((type) => {
              const IconComponent = iconMap[type.icon];
              const count = stats.byType[type.value] || 0;

              return (
                <div
                  key={type.value}
                  className="bg-white rounded-xl p-6 shadow-md text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {count}
                  </p>
                  <p className="text-sm text-gray-600">{type.label_ru}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("recentAdditions")}
            </h2>
            <Link
              to="/catalog"
              className="text-primary hover:text-primary/80 font-medium flex items-center"
            >
              {t("viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-gray-600">{t("loading")}</p>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <HeritageCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">{t("noItems")}</p>
              <Link
                to="/upload"
                className="inline-block mt-4 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90"
              >
                {t("addFirstItem")}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("howItWorks")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step1Title")}</h3>
              <p className="text-gray-600">{t("step1Desc")}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 text-secondary rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step2Title")}</h3>
              <p className="text-gray-600">{t("step2Desc")}</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("step3Title")}</h3>
              <p className="text-gray-600">{t("step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-black">
            <h2 className="text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
            <p className="text-xl mb-8 text-black/90">{t("ctaDescription")}</p>
            <Link
              to="/upload"
              className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              {t("addFirstItem")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
