import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Droplets, MapPin, Building2, User, Phone, Mail, Lock, ShieldAlert, Award } from 'lucide-react';
import { bloodGroups, indianStates } from '../data/mockData';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, isAuthenticated, user } = useAuth();
  
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const initialRole = (searchParams.get('role')?.toUpperCase() as 'DONOR' | 'RECEIVER' | 'HOSPITAL') || 'DONOR';
  
  const [isLogin, setIsLogin] = useState(initialMode);
  const [role, setRole] = useState<'DONOR' | 'RECEIVER' | 'HOSPITAL'>(initialRole);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'register') {
      setIsLogin(false);
    } else if (modeParam === 'login') {
      setIsLogin(true);
    }
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'DONOR' || roleParam === 'RECEIVER' || roleParam === 'HOSPITAL') {
      setRole(roleParam as any);
    }
  }, [searchParams]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');
  const [availableBloodTypes, setAvailableBloodTypes] = useState<string[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      redirectDashboard(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectDashboard = (userRole: string) => {
    const roleUpper = userRole.toUpperCase();
    if (roleUpper === 'DONOR') navigate('/dashboard/donor');
    else if (roleUpper === 'RECEIVER') navigate('/dashboard/receiver');
    else if (roleUpper === 'HOSPITAL') navigate('/dashboard/hospital');
    else if (roleUpper === 'ADMIN') navigate('/dashboard/admin');
    else navigate('/');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    setLocationStatus('idle');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
        setLocationStatus('success');
      },
      (err) => {
        console.error(err);
        setLocationLoading(false);
        setLocationStatus('error');
        alert('Failed to obtain location. Please grant permission in your browser.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleBloodTypeToggle = (type: string) => {
    setAvailableBloodTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      try {
        await login({ email, password });
      } catch (err: any) {
        setError(err.response?.data || err.message || 'Login failed. Please verify credentials.');
        setLoading(false);
      }
    } else {
      // Registration validation
      if (!email || !password || !name || !contactNumber || !city || !state) {
        setError('Please fill in all common required fields.');
        setLoading(false);
        return;
      }

      if (role === 'DONOR') {
        if (!age || parseInt(age) < 18 || parseInt(age) > 65) {
          setError('Donors must be between 18 and 65 years of age.');
          setLoading(false);
          return;
        }
        if (!coords) {
          setError('Location permission is required for donor tracking registration.');
          setLoading(false);
          return;
        }
      }

      if (role === 'HOSPITAL' && !coords) {
        setError('Location registration is required for nearby matching.');
        setLoading(false);
        return;
      }

      try {
        await register({
          email,
          password,
          name,
          role,
          contactNumber,
          city,
          state,
          age: role === 'DONOR' ? parseInt(age) : undefined,
          bloodGroup: role === 'DONOR' ? bloodGroup : undefined,
          address: role === 'HOSPITAL' ? address : undefined,
          availableBloodTypes: role === 'HOSPITAL' ? availableBloodTypes : undefined,
          latitude: coords?.lat,
          longitude: coords?.lng
        });
      } catch (err: any) {
        setError(err.response?.data || err.message || 'Registration failed. Try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-hero-pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-medical-blue/5"></div>
      
      <div className="relative max-w-md w-full space-y-8 bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-red-100 shadow-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-primary heartbeat" fill="currentColor" />
            <Droplets className="h-8 w-8 text-primary-glow blood-drop -ml-2" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back to VitaLink' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Access your dashboard' : 'Join India\'s GPS blood network'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm">
            <ShieldAlert className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Mode Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Register
          </button>
        </div>

        {/* Registration Role Selector */}
        {!isLogin && (
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setRole('DONOR')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${role === 'DONOR' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              Donor
            </button>
            <button
              onClick={() => setRole('RECEIVER')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${role === 'RECEIVER' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              Receiver
            </button>
            <button
              onClick={() => setRole('HOSPITAL')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${role === 'HOSPITAL' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-primary'}`}
            >
              Hospital
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {/* COMMON FIELDS */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Contact Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Guntur"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                    >
                      {indianStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ROLE SPECIFIC FIELDS */}
                {role === 'DONOR' && (
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Age *</label>
                      <input
                        type="number"
                        required
                        min="18"
                        max="65"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 25"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Blood Group *</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      >
                        {bloodGroups.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {role === 'HOSPITAL' && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Address *</label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Full street address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-2">Initial Blood Stock</label>
                      <div className="grid grid-cols-4 gap-2">
                        {bloodGroups.map(type => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => handleBloodTypeToggle(type)}
                            className={`py-1 text-xs font-semibold rounded-md border transition-all ${availableBloodTypes.includes(type) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* LOCATION PERMISSION (For Donor and Hospital) */}
                {(role === 'DONOR' || role === 'HOSPITAL') && (
                  <div className="bg-gradient-to-r from-primary/5 to-medical-blue/5 p-4 rounded-xl border border-primary/20 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary heartbeat" />
                        <span className="text-xs font-bold text-gray-900">GPS Location Registration</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-glow font-semibold transition-colors disabled:opacity-50"
                      >
                        {locationLoading ? 'Fetching...' : 'Share GPS Location'}
                      </button>
                    </div>
                    {locationStatus === 'success' && (
                      <p className="text-xs text-life-green font-medium flex items-center">
                        ✓ Location verified: {coords?.lat.toFixed(4)}, {coords?.lng.toFixed(4)}
                      </p>
                    )}
                    {locationStatus === 'error' && (
                      <p className="text-xs text-red-600 font-medium">
                        ✗ Failed to fetch location. Please reload page and allow browser GPS permissions.
                      </p>
                    )}
                    {locationStatus === 'idle' && !coords && (
                      <p className="text-xs text-gray-500">
                        GPS coordinate authorization is necessary to matching nearby donor requests.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-glow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing request...' : isLogin ? 'Sign In' : 'Register Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
