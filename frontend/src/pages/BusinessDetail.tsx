import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { businessService } from '../services/businessService';
import { bookingService } from '../services/bookingService';
import { Business, Service, TimeSlot } from '../types';
import { MapPin, Phone, Mail, Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { format, addDays } from 'date-fns';
import { sk } from 'date-fns/locale';

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadBusiness();
    }
  }, [id]);

  useEffect(() => {
    if (selectedService && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const loadBusiness = async () => {
    try {
      const data = await businessService.getBusiness(id!);
      setBusiness(data);
    } catch (error) {
      toast.error('Nepodarilo sa načítať firmu');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedService || !business) return;

    try {
      const response = await bookingService.getAvailableSlots({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
      });
      setAvailableSlots(response.slots);
    } catch (error) {
      toast.error('Nepodarilo sa načítať voľné termíny');
    }
  };

  const handleBooking = async (slot: TimeSlot) => {
    if (!isAuthenticated) {
      toast.info('Pre rezerváciu sa musíte prihlásiť');
      navigate('/login');
      return;
    }

    if (!selectedService || !business) return;

    setBookingLoading(true);
    try {
      await bookingService.createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        startTime: slot.start.toISOString(),
      });
      toast.success('Rezervácia úspešná!');
      navigate('/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Rezervácia zlyhala');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business) {
    return <div className="text-center py-12">Firma nebola nájdená</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {business.coverImage && (
          <img
            src={business.coverImage}
            alt={business.name}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {business.name}
              </h1>
              {business.averageRating > 0 && (
                <div className="flex items-center text-yellow-500">
                  <Star className="h-6 w-6 fill-current" />
                  <span className="ml-2 text-lg font-medium">
                    {business.averageRating.toFixed(1)} ({business.totalReviews} hodnotení)
                  </span>
                </div>
              )}
            </div>
          </div>
          {business.description && (
            <p className="text-gray-600 mb-4">{business.description}</p>
          )}
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            {business.address && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                {business.address}, {business.city}
              </div>
            )}
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-gray-400" />
              {business.phone}
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-400" />
              {business.email}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">Služby</h2>
            <div className="space-y-3">
              {business.services?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition ${
                    selectedService?.id === service.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary-600">
                        {service.price} {service.currency}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration} min
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {business.reviews && business.reviews.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Hodnotenia</h2>
              <div className="space-y-4">
                {business.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {review.client?.firstName} {review.client?.lastName}
                      </span>
                      <span className="ml-auto text-sm text-gray-400">
                        {format(new Date(review.createdAt), 'dd.MM.yyyy', { locale: sk })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Rezervácia</h2>
            {selectedService ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dátum
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dostupné termíny
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableSlots.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        Žiadne voľné termíny
                      </p>
                    ) : (
                      availableSlots
                        .filter((slot) => slot.available)
                        .map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleBooking(slot)}
                            disabled={bookingLoading}
                            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                          >
                            {format(new Date(slot.start), 'HH:mm')} -{' '}
                            {format(new Date(slot.end), 'HH:mm')}
                          </button>
                        ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Vyberte službu pre rezerváciu
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
