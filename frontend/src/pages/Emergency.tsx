import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Heart, Users, Navigation, Send } from 'lucide-react';
import { mockDonors, mockHospitals, bloodGroups } from '../data/mockData';
import LocationService from '../components/LocationService';

const Emergency = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyData, setEmergencyData] = useState({
    patientName: '',
    bloodGroup: '',
    contactNumber: '',
    hospitalName: '',
    urgency: 'emergency' as const,
    additionalInfo: ''
  });
  const [requestSent, setRequestSent] = useState(false);
  const [nearbyHelp, setNearbyHelp] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmergencyData(prev => ({ ...prev, [name]: value }));
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (userLocation && emergencyData.bloodGroup) {
      // Find nearby emergency help
      const help: any[] = [];

      // Add nearby hospitals
      mockHospitals.forEach(hospital => {
        if (hospital.availableBloodTypes.includes(emergencyData.bloodGroup)) {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            hospital.location.lat, hospital.location.lng
          );
          help.push({
            ...hospital,
            type: 'hospital',
            distance
          });
        }
      });

      // Add nearby donors
      mockDonors.forEach(donor => {
        if ((donor.bloodGroup === emergencyData.bloodGroup || donor.bloodGroup === 'O-') && donor.isAvailable) {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            donor.location.lat, donor.location.lng
          );
          help.push({
            ...donor,
            type: 'donor',
            distance
          });
        }
      });

      help.sort((a, b) => a.distance - b.distance);
      setNearbyHelp(help.slice(0, 5)); // Top 5 nearest
    }
  }, [userLocation, emergencyData.bloodGroup]);

  const handleEmergencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation) {
      alert('Please enable location access for emergency requests');
      return;
    }

    setRequestSent(true);
    
    // Simulate emergency alert sent to all nearby sources
    setTimeout(() => {
      setRequestSent(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emergency/10 via-urgent/5 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <AlertTriangle className="h-20 w-20 text-emergency mx-auto mb-4" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚨 <span className="text-emergency">EMERGENCY</span>
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            Immediate Blood Request - Lives at Stake
          </p>
          <div className="bg-emergency/10 border border-emergency/20 rounded-xl p-4 mt-6">
            <p className="text-emergency font-bold">
              ⚠️ For life-threatening emergencies, call 108 immediately while filling this form
            </p>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a 
            href="tel:108" 
            className="btn-emergency text-center text-lg"
          >
            📞 Call 108
            <div className="text-sm opacity-90">Medical Emergency</div>
          </a>
          <a 
            href="tel:102" 
            className="bg-urgent text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-urgent/90 transition-colors"
          >
            🚑 Call 102
            <div className="text-sm opacity-90">Ambulance Service</div>
          </a>
          <a 
            href="tel:104" 
            className="bg-medical-blue text-white px-6 py-4 rounded-xl font-bold text-center hover:bg-medical-blue/90 transition-colors"
          >
            🩸 Call 104
            <div className="text-sm opacity-90">Blood Bank Helpline</div>
          </a>
        </div>

        {/* Request Success */}
        {requestSent && (
          <div className="mb-8 bg-life-green/10 border border-life-green/20 rounded-xl p-6 text-center">
            <div className="text-6xl mb-4">🚨</div>
            <h3 className="text-2xl font-bold text-life-green mb-4">EMERGENCY ALERT SENT!</h3>
            <p className="text-lg text-gray-700 mb-4">
              Your emergency request has been broadcast to all nearby hospitals and donors.
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="font-semibold">Notifications sent to:</p>
              <p>• {nearbyHelp.filter(h => h.type === 'hospital').length} nearby hospitals</p>
              <p>• {nearbyHelp.filter(h => h.type === 'donor').length} available donors</p>
              <p>• Emergency services in your area</p>
            </div>
          </div>
        )}

        <div className={nearbyHelp.length > 0 ? "grid lg:grid-cols-2 gap-8" : "max-w-2xl mx-auto"}>
          {/* Emergency Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-emergency/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🩸 Emergency Blood Request
            </h2>
            
            <LocationService
              onLocationReceived={setUserLocation}
              className="mb-6"
            />

            <form onSubmit={handleEmergencySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={emergencyData.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient's name"
                    className="w-full px-4 py-3 border-2 border-emergency/30 rounded-lg focus:ring-2 focus:ring-emergency focus:border-emergency"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={emergencyData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-emergency/30 rounded-lg focus:ring-2 focus:ring-emergency focus:border-emergency"
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
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={emergencyData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border-2 border-emergency/30 rounded-lg focus:ring-2 focus:ring-emergency focus:border-emergency"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={emergencyData.hospitalName}
                    onChange={handleInputChange}
                    placeholder="Current hospital (if any)"
                    className="w-full px-4 py-3 border-2 border-emergency/30 rounded-lg focus:ring-2 focus:ring-emergency focus:border-emergency"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={emergencyData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any additional medical information, surgery details, or special requirements..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-emergency/30 rounded-lg focus:ring-2 focus:ring-emergency focus:border-emergency resize-vertical"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-emergency text-xl py-4"
                disabled={!userLocation || requestSent}
              >
                <Send className="h-6 w-6 mr-3" />
                SEND EMERGENCY ALERT
                <AlertTriangle className="h-6 w-6 ml-3 animate-pulse" />
              </button>
            </form>
          </div>

          {/* Nearby Emergency Help */}
          {nearbyHelp.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                🏥 Nearest Emergency Help
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {nearbyHelp.map((item, index) => (
                  <div key={item.id} className={`${
                    item.type === 'hospital' ? 'card-hospital' : 'card-donor'
                  } border-2 ${item.type === 'hospital' ? 'border-hospital-primary/30' : 'border-life-green/30'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                          <Navigation className="h-4 w-4" />
                          <span>{item.distance.toFixed(1)} km away</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {item.type === 'hospital' ? (
                          <div className="bg-hospital-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                            🏥 Hospital
                          </div>
                        ) : (
                          <div className="bg-life-green text-white px-3 py-1 rounded-full text-sm font-medium">
                            👤 Donor
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.type === 'hospital' ? (
                        <div>
                          <p className="text-sm text-gray-600">Available Blood Types:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.availableBloodTypes.slice(0, 4).map((type: string) => (
                              <span 
                                key={type} 
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  type === emergencyData.bloodGroup 
                                    ? 'bg-emergency text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Blood Group:</span>
                          <span className="font-bold text-lg text-primary">{item.bloodGroup}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`tel:${item.contactNumber}`}
                          className="text-primary hover:text-primary-glow font-medium"
                        >
                          {item.contactNumber}
                        </a>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <a
                          href={`tel:${item.contactNumber}`}
                          className={`w-full text-center py-2 rounded-lg font-medium transition-colors ${
                            item.type === 'hospital' 
                              ? 'bg-hospital-primary text-white hover:bg-hospital-secondary' 
                              : 'bg-life-green text-white hover:bg-green-600'
                          }`}
                        >
                          📞 Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Tips */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ⚡ Emergency Blood Donation Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-emergency mb-4">For Patients/Family:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-emergency" />
                  <span>Call emergency services (108) first</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-emergency" />
                  <span>Share exact location with responders</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-emergency" />
                  <span>Know patient's blood group and medical history</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-emergency" />
                  <span>Keep multiple contact numbers ready</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-life-green mb-4">For Donors:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-life-green" />
                  <span>Respond quickly to emergency alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-life-green" />
                  <span>Share your live location when responding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-life-green" />
                  <span>Ensure you're eligible to donate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-life-green" />
                  <span>Coordinate with hospitals directly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;