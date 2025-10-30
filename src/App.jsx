import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import UploadPage from "./pages/UploadPage";
import DetailPage from "./pages/DetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <HomePage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/catalog"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <CatalogPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/upload"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <UploadPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
          path="/detail/:id"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <DetailPage />
              </main>
              <Footer />
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <NotFoundPage />
              </main>
              <Footer />
            </div>
          }
        />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
