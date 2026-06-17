'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function formatToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export default function BookPage() {
  const [view, setView] = useState<'book' | 'manage'>('book');

  // Booking state
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manage state
  const [managePhone, setManagePhone] = useState('');
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (view === 'book' && date) {
      setLoading(true);
      setErrorMsg('');
      fetch(`/api/bookings?date=${date}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSlots(data.slots);
          } else {
            setSlots([]);
            setErrorMsg(data.error || 'Failed to fetch slots.');
          }
        })
        .catch(() => {
          setSlots([]);
          setErrorMsg('Failed to connect to the booking service.');
        })
        .finally(() => setLoading(false));
    }
  }, [date, view]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedSlot || !name || !phone) {
      alert("Please fill all required fields.");
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time: selectedSlot, phone, name, gender, serviceId: 'general' })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Booking successful!');
        setDate('');
        setSelectedSlot('');
        setName('');
        setPhone('');
        router.push('/');
      } else {
        alert(data.error || 'Failed to book');
        // Refresh slots in case someone else took it
        const refresh = await fetch(`/api/bookings?date=${date}`);
        const refData = await refresh.json();
        if (refData.success) setSlots(refData.slots);
      }
    } catch (err) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managePhone) return;
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(managePhone)) {
      alert("Please enter a valid phone number (10-15 digits).");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?phone=${encodeURIComponent(managePhone)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMyBookings(data.bookings);
        setSearched(true);
      } else {
        alert(data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?id=${id}&phone=${encodeURIComponent(managePhone)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMyBookings(prev => prev.filter(b => b.id !== id));
        alert('Booking cancelled successfully.');
      } else {
        alert(data.error || 'Failed to cancel');
      }
    } catch (err) {
      alert('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,33,36,0.08),_transparent_36%),linear-gradient(180deg,_#f8f3ed_0%,_#f4f5f7_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_rgba(30,33,36,0.08)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary shadow-sm">
              <img src="/logo.png" alt="Stylist Edge Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">Appointment Desk</p>
              <h1 className="font-serif-luxury text-2xl font-semibold text-primary sm:text-3xl">Book or manage your visit</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-primary/10 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Back to Home
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-primary-light"
            >
              View Menu
            </Link>
          </div>
        </header>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_80px_rgba(30,33,36,0.10)] overflow-hidden">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <aside className="border-b border-primary/5 bg-primary px-6 py-8 text-white lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">Bookings</p>
              <h2 className="mt-3 font-serif-luxury text-3xl font-semibold leading-tight text-white">
                Simple, guided scheduling.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                New bookings and existing booking cancellations live here in one clear place. Use the tabs below to switch between them.
              </p>

              <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">1</div>
                  <div>
                    <p className="text-sm font-semibold">Choose the right mode</p>
                    <p className="text-xs text-white/65">Book a new appointment or cancel one you already made.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">2</div>
                  <div>
                    <p className="text-sm font-semibold">Fill in your details</p>
                    <p className="text-xs text-white/65">Use your name and phone number so we can identify your booking.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">3</div>
                  <div>
                    <p className="text-sm font-semibold">Confirm with confidence</p>
                    <p className="text-xs text-white/65">Review the selected slot or booking before you submit.</p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="flex flex-col gap-4 border-b border-primary/5 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-accent">Appointment Mode</p>
                  <h2 className="mt-2 font-serif-luxury text-2xl font-semibold text-primary sm:text-3xl">
                    Choose what you want to do
                  </h2>
                </div>

                <div className="inline-flex rounded-full bg-primary/5 p-1">
                  <button
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${view === 'book' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-primary'}`}
                    onClick={() => setView('book')}
                  >
                    New Booking
                  </button>
                  <button
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${view === 'manage' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-primary'}`}
                    onClick={() => setView('manage')}
                  >
                    Cancel Existing Booking
                  </button>
                </div>
              </div>

              {view === 'book' && (
                <form onSubmit={handleBook} className="mt-8 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">New Booking</p>
                      <h3 className="mt-2 text-2xl font-bold text-primary">Book an Appointment</h3>
                    </div>
                    <div className="hidden rounded-full bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent md:block">
                      Quick and easy
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="rounded-2xl border border-primary/5 bg-[#fcfbf9] p-4 shadow-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
                        required
                      />
                    </div>

                    <div className="rounded-2xl border border-primary/5 bg-[#fcfbf9] p-4 shadow-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
                        required
                      />
                    </div>

                    <div className="rounded-2xl border border-primary/5 bg-[#fcfbf9] p-4 shadow-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
                      >
                        <option value="unspecified">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="rounded-2xl border border-primary/5 bg-[#fcfbf9] p-4 shadow-sm">
                      <label className="mb-2 block text-sm font-medium text-gray-700">Select Date</label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => {
                          setDate(e.target.value);
                          setSelectedSlot('');
                        }}
                        className="w-full rounded-xl border border-primary/10 bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
                        required
                      />
                    </div>
                  </div>

                  {date && (
                    <div className="rounded-3xl border border-primary/5 bg-bg-luxury/70 p-5 sm:p-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Availability</p>
                          <h4 className="mt-2 text-xl font-semibold text-primary">Available Slots for {formatToDDMMYYYY(date)}</h4>
                        </div>
                        {selectedSlot && (
                          <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
                            Selected: {selectedSlot}
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        {loading && !slots.length ? (
                          <p className="text-sm text-text-muted">Loading slots...</p>
                        ) : errorMsg ? (
                          <p className="text-sm text-red-500">{errorMsg} Please check your database settings or try again.</p>
                        ) : slots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                            {slots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${selectedSlot === slot ? 'border-primary bg-primary text-white shadow-md' : 'border-primary/10 bg-white text-gray-700 hover:border-accent hover:text-accent'}`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-red-500">No slots available on this date. Store might be closed or fully booked.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedSlot || loading}
                    className="w-full rounded-2xl bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </form>
              )}

              {view === 'manage' && (
                <div className="mt-8 space-y-6">
                  <div className="rounded-3xl border border-accent/20 bg-gradient-to-br from-primary to-primary-light p-6 text-white shadow-[0_20px_50px_rgba(30,33,36,0.18)] sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">Existing Booking</p>
                    <h3 className="mt-2 text-3xl font-bold">Cancel a booking you already made</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
                      Enter the phone number used for the appointment to look up your existing booking and cancel it safely from here.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-primary/5 bg-[#fcfbf9] p-5 shadow-sm sm:p-6">
                    <form onSubmit={fetchMyBookings} className="flex flex-col gap-4 sm:flex-row">
                      <input
                        type="tel"
                        value={managePhone}
                        onChange={e => setManagePhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="flex-1 rounded-2xl border border-primary/10 bg-white px-4 py-3 outline-none transition-colors focus:border-accent"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Find Booking
                      </button>
                    </form>
                  </div>

                  {searched && (
                    <div className="space-y-4">
                      {myBookings.length > 0 ? (
                        <div className="space-y-4">
                          {myBookings.map(b => (
                            <div key={b.id} className="rounded-3xl border border-primary/5 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:p-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Appointment</p>
                                  <div className="mt-2 text-xl font-semibold text-primary">{b.date} at {b.time}</div>
                                  <div className="mt-1 text-sm text-text-muted">{b.name} • {b.gender}</div>
                                </div>
                                <button
                                  onClick={() => handleCancel(b.id)}
                                  className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                                >
                                  Cancel Booking
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-primary/15 bg-white/70 px-6 py-12 text-center">
                          <p className="text-sm font-medium text-text-muted">No upcoming bookings found for this number.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
