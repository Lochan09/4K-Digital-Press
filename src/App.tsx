import React, { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Catalog from './components/sections/Catalog';
import Services from './components/sections/Services';
import OrderSection from './components/sections/OrderSection';
import Contact from './components/sections/Contact';
import Reviews from './components/sections/Reviews';
import AboutPage from './components/pages/AboutPage';
import AchievementsPage from './components/pages/AchievementsPage';

type Page = 'main' | 'about' | 'achievements';

function App() {
  const [activePage, setActivePage] = useState<Page>('main');

  React.useEffect(() => {
    fetch('/api/content').catch(() => {});
  }, []);

  const navigateTo = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (activePage === 'main') {
    return (
      <div className="page-shell">
        <Header activePage={activePage} onNavigate={navigateTo} />
        <main id="top">
          <Hero />
          <About />
          <Catalog />
          <Services />
          <OrderSection />
          <Contact />
          <Reviews />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="topbar-wrap">
        <Header activePage={activePage} onNavigate={navigateTo} />
      </div>
      {activePage === 'about' && <AboutPage onBack={() => navigateTo('main')} />}
      {activePage === 'achievements' && <AchievementsPage onBack={() => navigateTo('main')} />}
    </>
  );
}

export default App;
