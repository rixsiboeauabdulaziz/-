import React from 'react';
import Hero from '../components/Hero';
import PopularProducts from '../components/PopularProducts';
import WhyUs from '../components/WhyUs';
import Reviews from '../components/Reviews';
import Contacts from '../components/Contacts_1';
import Footer from '../components/Footer';
import CategoriesHome from '../components/CategoriesHome';

const Home = () => {
  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; color: #f0ebe3; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 2px; }
      `}</style>
      <Hero />
      <CategoriesHome />
      <PopularProducts />
      <WhyUs />
      <Reviews />
      <Contacts />
      <Footer />
    </div>
  );
};

export default Home;
