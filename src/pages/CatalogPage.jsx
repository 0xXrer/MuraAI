import { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { supabase } from "../lib/supabase";
import { HERITAGE_TYPES, REGIONS } from "../utils/constants";
import HeritageCard from "../components/HeritageCard";

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: [],
    region: "",
  });
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("heritage_items")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply type filter
      if (filters.type.length > 0) {
        query = query.in("type", filters.type);
      }

      // Apply region filter
      if (filters.region) {
        query = query.eq("region", filters.region);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadItems();
      return;
    }

    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
    setItems(filtered);
  };

  const handleTypeFilter = (type) => {
    setFilters((prev) => {
      const newTypes = prev.type.includes(type)
        ? prev.type.filter((t) => t !== type)
        : [...prev.type, type];
      return { ...prev, type: newTypes };
    });
  };

  const clearFilters = () => {
    setFilters({ type: [], region: "" });
    setSearchQuery("");
    loadItems();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Каталог культурного наследия
          </h1>

          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Поиск по названию, описанию, тегам..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
            >
              Искать
            </button>
          </div>

          {/* Filters and View Mode */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-600" />

              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {HERITAGE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeFilter(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.type.includes(type.value)
                        ? "bg-primary text-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type.label_ru}
                  </button>
                ))}
              </div>

              {/* Region Filter */}
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Все регионы</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              {(filters.type.length > 0 || filters.region || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        ) : items.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Найдено элементов:{" "}
              <span className="font-semibold">{items.length}</span>
            </p>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {items.map((item) => (
                <HeritageCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600 mb-4">Ничего не найдено</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
