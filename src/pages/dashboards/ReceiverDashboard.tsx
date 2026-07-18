import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestApi, hospitalApi, donorApi } from '../../services/api';
import { Heart, Droplets, MapPin, Search, AlertCircle, RefreshCw, CheckCircle, Clock, Building2, User } from 'lucide-react';
import { toast } from 'sonner';
import { bloodGroups } from '../../data/mockData';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Active tracking state
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [trackedDonor, setTrackedDonor] = useState<any | null>(null);
  const [trackingInterval, setTrackingInterval] = useState<any>(null);

  // Form fields
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [urgency, setUrgency] = useState('emergency');
  const [hospitalId, setHospitalId] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const loadData = async () => {
    try {
      setDataLoading(true);
      const reqList = await requestApi.getReceiverRequests();
      setRequests(reqList);

      const hospList = await hospitalApi.getAll();
      setHospitals(hospList);
      if (hospList.length > 0 && !hospitalId) {
        setHospitalId(hospList[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-fetch location coordinates
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        console.error("GPS permissions denied", err);
      }
    );
  }, []);

  // Track accepted donor movement
  useEffect(() => {
    if (selectedRequest && selectedRequest.status === 'ACCEPTED' && selectedRequest.donorId) {
      const fetchDonorLocation = async () => {
        try {
          const allDonors = await donorApi.getAll();
          const match = allDonors.find((d: any) => d.id === selectedRequest.donorId);
          if (match && match.location) {
            setTrackedDonor(match);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchDonorLocation();
      const interval = setInterval(fetchDonorLocation, 5000);
      return () => clearInterval(interval);
    } else {
      setTrackedDonor(null);
    }
  }, [selectedRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalId) {
      toast.error("Please fill in patient name and select target hospital.");
      return;
    }

    let lat = coords?.lat || 16.5062;
    let lng = coords?.lng || 80.6480;

    setLoading(true);
    try {
      await requestApi.createRequest({
        patientName,
        bloodGroup,
        urgency,
        hospitalId,
        latitude: lat,
        longitude: lng
      });
      toast.success("Blood request created! Nearby matching donors have been notified.");
      setPatientName('');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await requestApi.cancelRequest(id);
      toast.success("Request cancelled.");
      if (selectedRequest?.id === id) {
        setSelectedRequest(null);
      }
      loadData();
    } catch (err) {
      toast.error("Error cancelling request.");
    }
  };

  const handleSelectRequest = (req: any) => {
    setSelectedRequest(req);
  };

  // Google Maps Load & Render Simulation
  const renderMapContainer = () => {
    if (!selectedRequest) return null;

    const hospital = hospitals.find((h: any) => h.id === selectedRequest.hospitalId);
    const destName = hospital ? hospital.name : "Target Hospital";

    // Distance and ETA Calculations
    let distance = "Calculating...";
    let eta = "Calculating...";
    let donorLat = 0;
    let donorLng = 0;

    if (trackedDonor && trackedDonor.location) {
      donorLng = trackedDonor.location.coordinates[0];
      donorLat = trackedDonor.location.coordinates[1];
      const reqLat = selectedRequest.location.coordinates[1];
      const reqLng = selectedRequest.location.coordinates[0];

      // Distance estimation
      const dist = calculateDistance(reqLat, reqLng, donorLat, donorLng);
      distance = `${dist.toFixed(2)} km`;
      eta = `${Math.round((dist / 30.0) * 60.0)} mins`;
    }

    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Live Donor GPS Tracking</h3>
            <p className="text-xs text-gray-500">Matching Request ID: {selectedRequest.id.substring(0, 8)}</p>
          </div>
          <button 
            onClick={() => setSelectedRequest(null)}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600"
          >
            Close Map
          </button>
        </div>

        {/* Map Placeholder Render (Leaflet/SVG Style Mock or Google maps fallback) */}
        <div className="h-64 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-800">
          <div className="absolute inset-0 opacity-10 bg-radial-grid"></div>
          
          {/* Animated GPS Path Line */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-primary animate-pulse"></div>

          {/* Markers */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 text-center space-y-1">
            <div className="h-4 w-4 bg-life-green rounded-full mx-auto relative flex items-center justify-center shadow-lg">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-life-green opacity-75"></span>
            </div>
            <span className="text-[10px] text-gray-300 font-bold block bg-slate-800/80 px-1.5 py-0.5 rounded">Receiver</span>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 text-center space-y-1">
            {trackedDonor ? (
              <div className="animate-bounce">
                <div className="h-5 w-5 bg-primary rounded-full mx-auto flex items-center justify-center shadow-lg text-[10px] text-white font-bold">
                  🩸
                </div>
                <span className="text-[10px] text-gray-200 font-bold block bg-slate-800/80 px-1.5 py-0.5 rounded mt-1">Donor: {trackedDonor.name.split(' ')[0]}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500 italic block">Waiting for Donor Acceptance...</span>
            )}
          </div>

          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 text-center space-y-1">
            <div className="h-4 w-4 bg-medical-blue rounded-full mx-auto relative flex items-center justify-center shadow-lg">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-blue opacity-75"></span>
            </div>
            <span className="text-[10px] text-gray-300 font-bold block bg-slate-800/80 px-1.5 py-0.5 rounded">{destName.substring(0, 10)}...</span>
          </div>

          {/* GPS Info Banner overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-gray-800 p-3 rounded-lg flex justify-around text-center">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold block">Donor Status</span>
              <span className="text-xs text-white font-bold">{selectedRequest.status}</span>
            </div>
            <div className="border-l border-gray-800 px-3">
              <span className="text-[10px] text-gray-400 font-semibold block">GPS Distance</span>
              <span className="text-xs text-white font-bold">{distance}</span>
            </div>
            <div className="border-l border-gray-800 px-3">
              <span className="text-[10px] text-gray-400 font-semibold block">Estimated Arrival</span>
              <span className="text-xs text-white font-bold">{eta}</span>
            </div>
          </div>
        </div>

        {/* Directions Panel details */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">GPS Route Directions</h4>
          {trackedDonor ? (
            <div className="space-y-2 text-xs text-gray-600">
              <p className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-life-green mr-2"></span> 
                Start: Donor ({trackedDonor.name}) location at coordinates {donorLat.toFixed(4)}, {donorLng.toFixed(4)}
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-primary mr-2"></span> 
                Current route matches: Fast track along National Highway towards {destName}
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-medical-blue mr-2"></span> 
                End Destination: {destName} Address
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">Route instructions will automatically update once a nearby blood donor accepts the request.</p>
          )}
        </div>
      </div>
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadius = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Blood Request Console</span>
            <h1 className="text-2xl font-bold text-gray-900">Receiver Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Request emergency blood packages and monitor matching volunteers.</p>
          </div>
          <button 
            onClick={loadData}
            disabled={dataLoading}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dynamic Tracking Map Overlay */}
        {selectedRequest && renderMapContainer()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* New Request Creation Form */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-primary" /> Request Blood Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Patient Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Type *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white font-bold text-primary"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Urgency Level *</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">🚨 Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Select Target Hospital *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={hospitalId}
                    required
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  >
                    <option value="">Choose Hospital...</option>
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/5 to-medical-blue/5 p-4 rounded-xl border border-primary/20 flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 heartbeat" />
                <div>
                  <span className="text-xs font-bold text-gray-900">GPS Auto-Coord Mapping</span>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Your request coordinates will map automatically using your browser GPS permission values: {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Resolving GPS...'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-glow text-white font-bold py-2.5 rounded-xl transition-colors shadow-md disabled:opacity-50 text-sm"
              >
                {loading ? 'Submitting Request...' : 'BroadCast Blood Request'}
              </button>
            </form>
          </div>

          {/* Active / Historical Requests Table */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" /> Active Requests Tracker
            </h2>

            {requests.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 text-sm">No Blood Requests Made</h3>
                <p className="text-xs text-gray-500 mt-1">Your blood request history is empty. BroadCast a new emergency request using the form.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                      <th className="py-3 px-2">Patient</th>
                      <th className="py-3 px-2">Group</th>
                      <th className="py-3 px-2">Urgency</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 font-bold text-gray-800">{req.patientName}</td>
                        <td className="py-3 px-2 text-primary font-black text-sm">{req.bloodGroup}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.urgency === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : req.status === 'ACCEPTED' ? 'bg-primary/10 text-primary animate-pulse' : req.status === 'COMPLETED' ? 'bg-life-green/10 text-life-green' : 'bg-gray-100 text-gray-400'}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-400">{new Date(req.requestedAt).toLocaleDateString()}</td>
                        <td className="py-3 px-2 text-right space-x-1.5 whitespace-nowrap">
                          {req.status === 'ACCEPTED' && (
                            <button
                              onClick={() => handleSelectRequest(req)}
                              className="bg-primary/10 hover:bg-primary/20 text-primary font-bold px-2 py-1 rounded"
                            >
                              Track Live Donor
                            </button>
                          )}
                          {(req.status === 'PENDING' || req.status === 'ACCEPTED') && (
                            <button
                              onClick={() => handleCancel(req.id)}
                              className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReceiverDashboard;
