import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, Clock, Shield } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Rezervujte služby online
          <span className="block text-primary-600">jednoduchšie ako kedykoľvek predtým</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Bookio Pro je moderná platforma pre online rezervácie. Nájdite si termín u kaderníka,
          kozmetičky, maséra alebo inej služby v pár kliknutiach.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/businesses"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Nájsť služby
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            Zaregistrovať firmu
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Online rezervácie 24/7</h3>
          <p className="text-gray-600">
            Rezervujte si termín kedykoľvek, odkiaľkoľvek
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Real-time dostupnosť</h3>
          <p className="text-gray-600">
            Vidíte len voľné termíny v reálnom čase
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Star className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hodnotenia a recenzie</h3>
          <p className="text-gray-600">
            Prečítajte si skúsenosti iných zákazníkov
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Bezpečné a spoľahlivé</h3>
          <p className="text-gray-600">
            Vaše dáta sú v bezpečí
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Vlastníte firmu poskytujúcu služby?
        </h2>
        <p className="text-xl mb-8 text-primary-100">
          Zaregistrujte sa a začnite prijímať online rezervácie ešte dnes
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Začať zadarmo
        </Link>
      </section>
    </div>
  );
};

export default Home;
