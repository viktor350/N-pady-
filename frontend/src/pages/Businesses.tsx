import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { businessService } from '../services/businessService';
import { Business } from '../types';
import { MapPin, Star, Phone } from 'lucide-react';
import { toast } from 'react-toastify';

const Businesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBusinesses();
  }, [page, search]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessService.getBusinesses({
        page,
        limit: 12,
        search: search || undefined,
      });
      setBusinesses(response.businesses);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error('Nepodarilo sa načítať firmy');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadBusinesses();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Firmy a služby</h1>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hľadať firmu alebo službu..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
        >
          Hľadať
        </button>
      </form>

      {businesses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenašli sa žiadne firmy</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Link
              key={business.id}
              to={`/businesses/${business.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {business.coverImage && (
                <img
                  src={business.coverImage}
                  alt={business.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {business.name}
                  </h3>
                  {business.averageRating > 0 && (
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {business.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                {business.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {business.description}
                  </p>
                )}
                <div className="space-y-2 text-sm text-gray-500">
                  {business.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {business.address}, {business.city}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {business.phone}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Predchádzajúca
          </button>
          <span className="px-4 py-2">
            Strana {page} z {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Ďalšia
          </button>
        </div>
      )}
    </div>
  );
};

export default Businesses;
