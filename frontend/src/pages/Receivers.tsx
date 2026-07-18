import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Building2, Phone, Navigation, AlertTriangle } from 'lucide-react';
import { bloodGroups } from '../data/mockData';
import LocationService from '../components/LocationService';
import { donorApi, hospitalApi } from '../services/api';

interface NearbyItem {
  id: string;
  name: string;
  bloodGroup?: string;
  availableBloodTypes?: string[];
  distance: number;
  type: 'donor' | 'hospital';
  contactNumber: string;
  location: { lat: number; lng: number };
  isAvailable?: boolean;
  isSubscribed?: boolean;
}

const Receivers = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'emergency'>('medium');
  const [nearbyItems, setNearbyItems] = useState<NearbyItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [requestSent, setRequestSent] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const findNearbyItems = async () => {
    if (!userLocation || !selectedBloodGroup) return;

    setSearching(true);
    try {
      const [backendDonors, backendHospitals] = await Promise.all([
        donorApi.getAll(),
        hospitalApi.getAll()
      ]);

      const nearby: NearbyItem[] = [];

      // Find nearby donors from database
      backendDonors.forEach((donor: any) => {
        const isAvailable = donor.isAvailable !== undefined ? donor.isAvailable : donor.available;
        const matchesBloodGroup = donor.bloodGroup === selectedBloodGroup || 
          (selectedBloodGroup !== 'O-' && donor.bloodGroup === 'O-') || 
          (selectedBloodGroup.includes('+') && donor.bloodGroup.includes('-') && donor.bloodGroup.charAt(0) === selectedBloodGroup.charAt(0));

        if (matchesBloodGroup && donor.location && donor.location.coordinates) {
          const lat = donor.location.coordinates[1];
          const lng = donor.location.coordinates[0];
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            lat, lng
          );

          nearby.push({
            id: donor.id,
            name: donor.name,
            bloodGroup: donor.bloodGroup,
            distance,
            type: 'donor',
            contactNumber: donor.contactNumber,
            location: { lat, lng },
            isAvailable: isAvailable
          });
        }
      });

      // Find nearby hospitals from database
      backendHospitals.forEach((hospital: any) => {
        const availableBloodTypes = hospital.availableBloodTypes || [];
        if (availableBloodTypes.includes(selectedBloodGroup) && hospital.location && hospital.location.coordinates) {
          const lat = hospital.location.coordinates[1];
          const lng = hospital.location.coordinates[0];
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            lat, lng
          );

          nearby.push({
            id: hospital.id,
            name: hospital.name,
            availableBloodTypes: availableBloodTypes,
            distance,
            type: 'hospital',
            contactNumber: hospital.contactNumber,
            location: { lat, lng },
            isSubscribed: hospital.isSubscribed
          });
        }
      });

      // Sort by distance
      nearby.sort((a, b) => a.distance - b.distance);
      setNearbyItems(nearby);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to find nearby items:", err);
      alert("Failed to connect to the server to find nearby matches. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleRequest = (item: NearbyItem) => {
    setRequestSent(item.id);
    setTimeout(() => setRequestSent(null), 3000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-emergency bg-emergency/10 border-emergency/20';
      case 'high': return 'text-urgent bg-urgent/10 border-urgent/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-life-green bg-life-green/10 border-life-green/20';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    if (urgency === 'emergency') return '🚨';
    if (urgency === 'high') return '⚠️';
    if (urgency === 'medium') return '⏰';
    return '📋';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Search className="h-12 w-12 text-medical-blue mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 <span className="text-gradient-medical">Request Blood & Search Donors</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find and request blood from nearby active donors and hospitals. No registration required.
          </p>
        </div>

        {/* Request Form */}
        <div className="max-w-2xl mx-auto mb-12">
          {/* Info Tip for Blood Seeker Candidates */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 text-left flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Tip for Blood Seekers</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Allow location permissions in your browser. VitaLink will access your coordinates to find nearby active donors and dynamically display their live distance (e.g. <strong>2.0 km away</strong>), helping you connect with the closest help first.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-medical-blue/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🩸 Blood Request Form
            </h2>
            
            <LocationService
              onLocationReceived={setUserLocation}
              className="mb-6"
            />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Blood Group *
                  </label>
                  <select
                    value={selectedBloodGroup}
                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    required
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Urgency Indicator */}
              <div className={`p-4 rounded-lg border ${getUrgencyColor(urgency)}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getUrgencyIcon(urgency)}</span>
                  <div>
                    <h4 className="font-semibold capitalize">{urgency} Priority Request</h4>
                    <p className="text-sm">
                      {urgency === 'emergency' && 'Immediate assistance required - will notify all nearby sources'}
                      {urgency === 'high' && 'Urgent requirement - prioritized matching'}
                      {urgency === 'medium' && 'Standard blood request processing'}
                      {urgency === 'low' && 'Non-urgent request - will find best matches'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={findNearbyItems}
                disabled={!userLocation || !selectedBloodGroup || searching}
                className="w-full btn-medical text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Searching Database...
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6 mr-3" />
                    Find Nearby Donors & Hospitals
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                📍 Nearby Results for <span className="text-primary">{selectedBloodGroup}</span>
              </h2>
              <p className="text-lg text-gray-600">
                Found {nearbyItems.length} matches within your area
              </p>
            </div>

            {nearbyItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 max-w-2xl mx-auto shadow-sm">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Matches Found</h3>
                <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                  No registered donors or hospitals found nearby with {selectedBloodGroup} blood group.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Suggestions:</p>
                  <p>• Share this app to invite new donors in your area</p>
                  <p>• Contact regional public blood banks</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyItems.map(item => (
                  <div key={item.id} className={`${
                    item.type === 'donor' ? 'card-donor' : 'card-hospital'
                  } relative overflow-hidden`} >
                    {/* Request Sent Overlay */}
                    {requestSent === item.id && (
                      <div className="absolute inset-0 bg-life-green/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 transition-all">
                        <div className="text-center text-white">
                          <div className="text-5xl mb-2">🎉</div>
                          <p className="font-bold text-xl">Request Sent Successfully!</p>
                          <p className="text-sm opacity-90 mt-1">Please call the contact number below directly to coordinate.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <div className="flex items-center space-x-2 text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{item.distance.toFixed(1)} km away</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.type === 'donor' ? (
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-life-green" />
                            {item.isAvailable ? (
                              <span className="badge-available">Available</span>
                            ) : (
                              <span className="badge-unavailable">Not Available</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-hospital-primary" />
                            {item.isSubscribed ? (
                              <span className="badge-available">Active</span>
                            ) : (
                              <span className="badge-unavailable">Inactive</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {item.type === 'donor' ? (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Blood Group:</span>
                          <span className="font-bold text-primary text-lg">{item.bloodGroup}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-gray-600 text-sm">Available Blood Types:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.availableBloodTypes?.map(type => (
                              <span 
                                key={type} 
                                className={`px-2 py-1 rounded text-sm font-medium ${
                                  type === selectedBloodGroup 
                                    ? 'bg-primary text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                  }`}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span className="font-medium text-gray-900">{item.contactNumber}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Navigation className="h-4 w-4" />
                        <span>Distance: {item.distance.toFixed(1)} km</span>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleRequest(item)}
                          disabled={
                            (item.type === 'donor' && !item.isAvailable) ||
                            requestSent === item.id
                          }
                          className={`w-full py-3 rounded-lg font-medium transition-colors ${
                            item.type === 'donor' 
                              ? 'btn-donor' 
                              : 'btn-hospital'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {item.type === 'donor' ? (
                            item.isAvailable ? 'Send Request to Donor' : 'Not Available'
                          ) : (
                            'Send Request to Hospital'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Emergency Help Callout */}
        <div className="mt-16 bg-gradient-to-r from-emergency/10 to-urgent/10 rounded-2xl p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-emergency mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🚨 Need Emergency Help?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            For life-threatening emergencies, contact national medical services immediately
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:108" 
              className="btn-emergency"
            >
              Call 108 - Emergency
            </a>
            <a 
              href="tel:102" 
              className="bg-white text-emergency border-2 border-emergency px-8 py-4 rounded-xl font-semibold hover:bg-emergency hover:text-white transition-colors"
            >
              Call 102 - Ambulance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receivers;