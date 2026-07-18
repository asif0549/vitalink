import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, Award, MapPin, Phone, Droplets, Plus } from 'lucide-react';
import { donorApi } from '../services/api';

interface Donor {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  city: string;
  state: string;
  contactNumber: string;
  isAvailable: boolean;
  donationCount: number;
  lastDonation?: string;
  location: {
    lat: number;
    lng: number;
  } | null;
}

const Donors = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const fetched = await donorApi.getAll();
        const mapped = fetched.map((d: any) => ({
          id: d.id,
          name: d.name,
          age: d.age,
          bloodGroup: d.bloodGroup,
          city: d.city,
          state: d.state,
          contactNumber: d.contactNumber,
          isAvailable: d.isAvailable !== undefined ? d.isAvailable : d.available,
          donationCount: d.donationCount || 0,
          lastDonation: d.lastDonationDate || d.lastDonation,
          location: d.location && d.location.coordinates ? {
            lat: d.location.coordinates[1],
            lng: d.location.coordinates[0]
          } : null
        }));
        setDonors(mapped);
      } catch (err: any) {
        console.error("Failed to fetch donors:", err);
        setError("Could not load registered donors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  const availableDonors = donors.filter(donor => donor.isAvailable);
  const lifeSavers = donors.filter(donor => donor.donationCount >= 2);

  const handleBecomeDonor = () => {
    navigate('/auth?mode=register&role=DONOR');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-primary mr-3 heartbeat" fill="currentColor" />
            <Droplets className="h-8 w-8 text-primary-glow blood-drop" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-gradient-donor">Blood Donors</span> Registry
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and connect with verified blood donors. Every donation counts!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-donor text-center">
            <Users className="h-12 w-12 text-life-green mx-auto mb-4" />
            <div className="text-3xl font-bold text-life-green mb-2">
              {loading ? '...' : donors.length}
            </div>
            <div className="text-gray-600">Total Donors</div>
          </div>
          <div className="card-donor text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" fill="currentColor" />
            <div className="text-3xl font-bold text-primary mb-2">
              {loading ? '...' : availableDonors.length}
            </div>
            <div className="text-gray-600">Available Now</div>
          </div>
          <div className="card-donor text-center">
            <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {loading ? '...' : lifeSavers.length}
            </div>
            <div className="text-gray-600">Life Savers (2+ Donations)</div>
          </div>
        </div>

        {/* Become a Donor CTA */}
        <div className="text-center mb-12">
          <button
            onClick={handleBecomeDonor}
            className="btn-donor text-lg group"
          >
            <Plus className="h-6 w-6 mr-3" />
            Become a Donor
            <Heart className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading registered donors from the database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto">
            {error}
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registered Donors Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              There are currently no registered donors in the system. Be the first to register as a donor!
            </p>
            <button
              onClick={handleBecomeDonor}
              className="btn-donor text-lg"
            >
              Register as Donor
            </button>
          </div>
        ) : (
          <>
            {/* Life Savers Section */}
            {lifeSavers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                  🏆 <span className="text-gradient-donor">Life Saver Heroes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lifeSavers.map(donor => (
                    <div key={donor.id} className="card-donor relative overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <Award className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
                        <div className="flex items-center space-x-2 text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{donor.city}, {donor.state}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Blood Group:</span>
                          <span className="font-semibold text-primary text-lg">{donor.bloodGroup}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Donations:</span>
                          <span className="font-bold text-life-green">{donor.donationCount}</span>
                        </div>
                        <div className="pt-3">
                          <span className="badge-available">Life Saver Badge</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Donors List */}
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                📋 <span className="text-gradient-donor">All Registered Donors</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map(donor => (
                  <div key={donor.id} className="card-donor">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
                        <p className="text-gray-600">{donor.age} years old</p>
                      </div>
                      <div className="text-right">
                        {donor.isAvailable ? (
                          <span className="badge-available">Available</span>
                        ) : (
                          <span className="badge-unavailable">Not Available</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-bold text-primary text-lg">{donor.bloodGroup}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{donor.city}, {donor.state}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{donor.contactNumber}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-gray-600">Donations:</span>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-primary" fill="currentColor" />
                          <span className="font-semibold">{donor.donationCount}</span>
                        </div>
                      </div>

                      {donor.lastDonation && (
                        <div className="text-sm text-gray-500">
                          Last donated: {new Date(donor.lastDonation).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Motivation Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-life-green/10 to-primary/10 rounded-2xl p-8">
          <Heart className="h-16 w-16 text-primary mx-auto mb-4 heartbeat" fill="currentColor" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🩸 Every Drop Counts - Be a Hero Today!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Your blood donation can save up to 3 lives. Register to join our community of heroes!
          </p>
          <button
            onClick={handleBecomeDonor}
            className="btn-donor text-lg"
          >
            Start Saving Lives
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donors;