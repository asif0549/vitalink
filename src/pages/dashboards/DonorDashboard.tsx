import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { donorApi, rewardApi, requestApi, notificationApi } from '../../services/api';
import { Heart, Droplets, MapPin, Award, CheckCircle, RefreshCw, Eye, Printer, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';

const DonorDashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [available, setAvailable] = useState(profile?.available ?? true);
  const [shareLocation, setShareLocation] = useState(false);
  const [simulateMovement, setSimulateMovement] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [nearbyRequests, setNearbyRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [certDetails, setCertDetails] = useState<any | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvailable(profile.available);
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      // Rewards
      const r = await rewardApi.getRewards();
      setRewards(r);

      // Nearby Requests matching donor blood group
      if (profile && profile.location) {
        const coords = profile.location.coordinates;
        // In GeoJson, longitude is index 0, latitude is index 1
        const activeRequests = await requestApi.getActive();
        // Filter requests matching group and within 50km
        const matched = activeRequests.filter((req: any) => {
          if (req.bloodGroup.toUpperCase() === profile.bloodGroup.toUpperCase()) {
            const dist = calculateDistance(
              coords[1], coords[0],
              req.location.coordinates[1], req.location.coordinates[0]
            );
            req.distance = Math.round(dist * 100.0) / 100.0;
            return dist <= 50.0;
          }
          return false;
        });
        setNearbyRequests(matched);
      }

      // Notifications
      const n = await notificationApi.getNotifications();
      setNotifications(n);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  // Periodic location updates
  useEffect(() => {
    let interval: any = null;

    if (shareLocation && profile) {
      const updateLocation = async () => {
        try {
          let lat = profile.location.coordinates[1];
          let lng = profile.location.coordinates[0];

          if (simulateMovement) {
            // Add a tiny random offset to simulate movement (~50-100 meters)
            lat += (Math.random() - 0.5) * 0.001;
            lng += (Math.random() - 0.5) * 0.001;
          } else {
            // Get actual coordinates
            const pos: any = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            });
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          }

          await donorApi.updateLocation({ latitude: lat, longitude: lng });
          refreshProfile();
          toast.success(`Location updated: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, {
            duration: 2000,
          });
        } catch (err) {
          console.error("Failed to share location:", err);
          toast.error("Location share error. Ensure GPS permissions are allowed.");
          setShareLocation(false);
        }
      };

      // Initial execution
      updateLocation();

      // Setup interval every 5 seconds
      interval = setInterval(updateLocation, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [shareLocation, simulateMovement]);

  const handleToggleAvailability = async () => {
    try {
      const nextState = !available;
      await donorApi.toggleAvailability(nextState);
      setAvailable(nextState);
      refreshProfile();
      toast.success(nextState ? "You are now AVAILABLE to receive blood requests!" : "Availability set to offline.");
    } catch (err) {
      toast.error("Failed to update availability status.");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await requestApi.acceptRequest(requestId);
      toast.success("Request accepted! Navigation instructions sent. Go to hospital to donate.");
      loadDashboardData();
      refreshProfile();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to accept blood request.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificate = async (level: string) => {
    try {
      const details = await rewardApi.getCertificate(level);
      setCertDetails(details);
      setShowCertModal(true);
    } catch (err) {
      toast.error("Failed to load certificate.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper distance calculations
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadius = 6371;
    const dLat = Math.toRadians(lat2 - lat1);
    const dLon = Math.toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  // Define badges based on donation count
  const getActiveBadgeName = (count: number) => {
    if (count >= 20) return { name: "Life Saver Legend", color: "text-red-600 bg-red-100 border-red-200" };
    if (count >= 10) return { name: "Gold Hero", color: "text-amber-600 bg-amber-100 border-amber-200" };
    if (count >= 5) return { name: "Silver Hero", color: "text-slate-600 bg-slate-100 border-slate-200" };
    if (count >= 2) return { name: "Bronze Hero", color: "text-orange-600 bg-orange-100 border-orange-200" };
    return { name: "Rising Donor", color: "text-gray-600 bg-gray-100 border-gray-200" };
  };

  const currentBadge = getActiveBadgeName(profile?.donationCount || 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Summary */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Droplets className="h-10 w-10 blood-drop" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Blood Donor Dashboard</span>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-primary" /> {profile?.city}, {profile?.state}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 px-6 py-3 rounded-xl text-center">
              <span className="text-xs text-gray-500 font-semibold block">Blood Group</span>
              <span className="text-2xl font-black text-primary">{profile?.bloodGroup}</span>
            </div>
            <div className="bg-gradient-to-br from-life-green/5 to-life-green/10 border border-life-green/20 px-6 py-3 rounded-xl text-center">
              <span className="text-xs text-gray-500 font-semibold block">Total Donations</span>
              <span className="text-2xl font-black text-life-green">{profile?.donationCount || 0}</span>
            </div>
            <div className={`px-6 py-3 rounded-xl border text-center ${currentBadge.color}`}>
              <span className="text-xs font-semibold block opacity-85">Hero Level</span>
              <span className="text-lg font-bold">{currentBadge.name}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Actions & Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" /> Donor Controls
            </h2>

            {/* Availability Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Active Donor Status</h3>
                <p className="text-xs text-gray-500 mt-1">Turn off if you're temporarily unavailable.</p>
              </div>
              <button
                onClick={handleToggleAvailability}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${available ? 'bg-life-green justify-end' : 'bg-gray-300 justify-start'}`}
              >
                <span className="bg-white w-6 h-6 rounded-full shadow-md"></span>
              </button>
            </div>

            {/* Location Tracking */}
            <div className="bg-gradient-to-br from-primary/5 to-medical-blue/5 p-4 rounded-xl border border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm flex items-center">
                    <MapPin className="h-5 w-5 mr-1.5 text-primary heartbeat" /> GPS Location Sharing
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Broadcast coordinates in real-time.</p>
                </div>
                <button
                  onClick={() => setShareLocation(!shareLocation)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${shareLocation ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'}`}
                >
                  <span className="bg-white w-6 h-6 rounded-full shadow-md"></span>
                </button>
              </div>

              {shareLocation && (
                <div className="space-y-3 pt-2 border-t border-primary/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 flex items-center">
                      <input
                        type="checkbox"
                        checked={simulateMovement}
                        onChange={(e) => setSimulateMovement(e.target.checked)}
                        className="mr-2 rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      Simulate Movement (Demo)
                    </label>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-life-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-life-green"></span>
                    </span>
                  </div>
                  <p className="text-xxs text-gray-500 bg-white/60 p-2 rounded border border-gray-200">
                    Live tracking active. Coordinating updates to database every 5 seconds.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Emergency Requests */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary heartbeat" /> Nearby Emergency Blood Requests
            </h2>

            {nearbyRequests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <CheckCircle className="h-10 w-10 text-life-green mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 text-sm">No Active Matching Requests</h3>
                <p className="text-xs text-gray-500 mt-1">Hospitals nearby have not requested {profile?.bloodGroup} blood recently.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-gradient-to-r from-red-50/50 to-white border border-red-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/30 transition-all shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase ${req.urgency === 'emergency' ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-100 text-amber-800'}`}>
                          🚨 {req.urgency}
                        </span>
                        <span className="text-xs text-gray-400">Requested {new Date(req.requestedAt).toLocaleTimeString()}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mt-1.5">
                        Patient: {req.patientName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 text-primary mr-1 flex-shrink-0" /> Approx. {req.distance} km away
                      </p>
                    </div>

                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      disabled={loading}
                      className="btn-donor text-xs px-4 py-2 w-full sm:w-auto text-center"
                    >
                      Accept Donation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Milestone Badges & Achievements */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" /> Reward Milestones
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Bronze Medal */}
            <div className={`p-4 rounded-xl border text-center transition-all ${profile?.donationCount >= 2 ? 'bg-orange-50/50 border-orange-200' : 'bg-gray-100/50 border-gray-200 opacity-60'}`}>
              <Award className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Bronze Hero Badge</h3>
              <p className="text-xs text-gray-500 mt-1">Requires 2 Donations</p>
              {profile?.donationCount >= 2 ? (
                <button
                  onClick={() => handleViewCertificate('BRONZE')}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-orange-600 hover:text-orange-800"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Certificate
                </button>
              ) : (
                <span className="mt-3 text-xxs font-bold text-gray-400 block">Locked (Need {2 - profile?.donationCount} more)</span>
              )}
            </div>

            {/* Silver Medal */}
            <div className={`p-4 rounded-xl border text-center transition-all ${profile?.donationCount >= 5 ? 'bg-slate-50/50 border-slate-200' : 'bg-gray-100/50 border-gray-200 opacity-60'}`}>
              <Award className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Silver Hero Badge</h3>
              <p className="text-xs text-gray-500 mt-1">Requires 5 Donations</p>
              {profile?.donationCount >= 5 ? (
                <button
                  onClick={() => handleViewCertificate('SILVER')}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Certificate
                </button>
              ) : (
                <span className="mt-3 text-xxs font-bold text-gray-400 block">Locked (Need {5 - profile?.donationCount} more)</span>
              )}
            </div>

            {/* Gold Medal */}
            <div className={`p-4 rounded-xl border text-center transition-all ${profile?.donationCount >= 10 ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-100/50 border-gray-200 opacity-60'}`}>
              <Award className="h-12 w-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Gold Hero Badge</h3>
              <p className="text-xs text-gray-500 mt-1">Requires 10 Donations</p>
              {profile?.donationCount >= 10 ? (
                <button
                  onClick={() => handleViewCertificate('GOLD')}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-amber-600 hover:text-amber-800"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Certificate
                </button>
              ) : (
                <span className="mt-3 text-xxs font-bold text-gray-400 block">Locked (Need {10 - profile?.donationCount} more)</span>
              )}
            </div>

            {/* Legend Medal */}
            <div className={`p-4 rounded-xl border text-center transition-all ${profile?.donationCount >= 20 ? 'bg-red-50/50 border-red-200' : 'bg-gray-100/50 border-gray-200 opacity-60'}`}>
              <Award className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Life Saver Legend</h3>
              <p className="text-xs text-gray-500 mt-1">Requires 20+ Donations</p>
              {profile?.donationCount >= 20 ? (
                <button
                  onClick={() => handleViewCertificate('LEGEND')}
                  className="mt-3 inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-800"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> View Certificate
                </button>
              ) : (
                <span className="mt-3 text-xxs font-bold text-gray-400 block">Locked (Need {20 - profile?.donationCount} more)</span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Printable Certificate Modal */}
      {showCertModal && certDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-8 rounded-xl border-4 border-double border-gray-300 relative shadow-2xl space-y-6 printable-certificate-area">
            
            {/* Certificate Header Graphic */}
            <div className="text-center space-y-2 border-b-2 border-primary/20 pb-4">
              <div className="flex justify-center mb-2">
                <Award className="h-16 w-16 text-amber-500" />
              </div>
              <h2 className="text-2xl font-serif font-black text-gray-900 tracking-wider">CERTIFICATE OF APPRECIATION</h2>
              <span className="text-xs font-semibold text-primary tracking-widest block uppercase">AK VITALINK BLOOD NETWORK</span>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-6 py-4">
              <p className="text-sm italic text-gray-500 font-serif">This is proudly presented to</p>
              
              <h3 className="text-3xl font-serif font-extrabold text-gray-900 underline decoration-primary decoration-double decoration-2 underline-offset-8">
                {certDetails.recipientName}
              </h3>
              
              <p className="text-sm text-gray-700 max-w-lg mx-auto leading-relaxed">
                in recognition and sincere appreciation for their outstanding dedication to human welfare. By achieving the status of <strong>{certDetails.level} HERO</strong> through selfless blood donations, they have saved multiple lives and inspired communities across India.
              </p>

              <div className="grid grid-cols-2 gap-8 pt-8 max-w-md mx-auto border-t border-gray-100">
                <div className="text-center">
                  <span className="font-bold text-xs text-gray-800 block underline underline-offset-4">Dr. A. K. Verma</span>
                  <span className="text-xxs text-gray-500">Director, AK VitaLink India</span>
                </div>
                <div className="text-center">
                  <span className="font-semibold text-xs text-gray-800 block">ID: {certDetails.certificateId}</span>
                  <span className="text-xxs text-gray-500">Date: {new Date(certDetails.dateAwarded).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Controls (Not Printed) */}
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// Math extensions for Degree to Radian conversion
if (typeof Math.toRadians === 'undefined') {
  Math.toRadians = function (degrees: number) {
    return (degrees * Math.PI) / 180;
  };
}

declare global {
  interface Math {
    toRadians(degrees: number): number;
  }
}

export default DonorDashboard;
