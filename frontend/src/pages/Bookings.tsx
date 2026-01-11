import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';
import { Calendar, Clock, MapPin, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { toast } from 'react-toastify';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookings({
        status: filter !== 'ALL' ? filter : undefined,
      });
      setBookings(response.bookings);
    } catch (error) {
      toast.error('Nepodarilo sa načítať rezervácie');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Naozaj chcete zrušiť túto rezerváciu?')) return;

    try {
      await bookingService.updateBookingStatus(bookingId, BookingStatus.CANCELLED, 'Zrušené používateľom');
      toast.success('Rezervácia zrušená');
      loadBookings();
    } catch (error) {
      toast.error('Nepodarilo sa zrušiť rezerváciu');
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'Potvrdené';
      case BookingStatus.PENDING:
        return 'Čaká na potvrdenie';
      case BookingStatus.CANCELLED:
        return 'Zrušené';
      case BookingStatus.COMPLETED:
        return 'Dokončené';
      default:
        return status;
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Moje rezervácie</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as BookingStatus | 'ALL')}
            className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'ALL' ? 'Všetky' : getStatusText(status as BookingStatus)}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nemáte žiadne rezervácie</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {booking.business?.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(booking.startTime), 'EEEE, d. MMMM yyyy', {
                        locale: sk,
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                      {format(new Date(booking.endTime), 'HH:mm')}
                    </div>
                    {booking.business?.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {booking.business.address}
                      </div>
                    )}
                    <div className="font-medium text-lg text-primary-600 mt-2">
                      {booking.service?.name} - {booking.totalPrice} {booking.currency}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(booking.status === BookingStatus.PENDING ||
                    booking.status === BookingStatus.CONFIRMED) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Zrušiť
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
