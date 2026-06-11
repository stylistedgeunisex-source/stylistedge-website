'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookPage() {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (date) {
      setLoading(true);
      fetch(`/api/bookings?date=${date}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSlots(data.slots);
          else setSlots([]);
        })
        .finally(() => setLoading(false));
    }
  }, [date]);

  const handleBook = async () => {
    if (!date || !selectedSlot) return;

    // Ideally, get user phone from session or prompt here.
    // For now, we will prompt or use a dummy for demonstration.
    const phone = prompt("Please confirm your phone number:");
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time: selectedSlot, phone, serviceId: 'general' })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Booking successful!');
        router.push('/');
      } else {
        alert(data.error || 'Failed to book');
      }
    } catch (err) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg"
          />
        </div>

        {date && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Available Slots for {date}</h2>
            {loading ? (
              <p>Loading slots...</p>
            ) : slots.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${selectedSlot === slot ? 'bg-black text-white border-black' : 'bg-white text-gray-700 hover:border-black'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-red-500">No slots available on this date. Store might be closed or fully booked.</p>
            )}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!selectedSlot || loading}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
