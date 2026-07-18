import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, RefreshCw, X } from 'lucide-react';

interface LocationServiceProps {
  onLocationReceived: (location: { lat: number; lng: number }) => void;
  className?: string;
}

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const LocationService: React.FC<LocationServiceProps> = ({ onLocationReceived, className = '' }) => {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser.',
        loading: false
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationState({
          latitude,
          longitude,
          error: null,
          loading: false
        });
        onLocationReceived({ lat: latitude, lng: longitude });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }

        setLocationState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const clearLocation = () => {
    setLocationState({
      latitude: null,
      longitude: null,
      error: null,
      loading: false
    });
  };

  useEffect(() => {
    // Automatically get location on component mount
    getCurrentLocation();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Status */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            locationState.latitude && locationState.longitude 
              ? 'bg-life-green/10 text-life-green' 
              : locationState.error 
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-500'
          }`}>
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Your Location</h3>
            {locationState.latitude && locationState.longitude ? (
              <p className="text-sm text-gray-600">
                {locationState.latitude.toFixed(4)}, {locationState.longitude.toFixed(4)}
              </p>
            ) : locationState.error ? (
              <p className="text-sm text-red-600">{locationState.error}</p>
            ) : (
              <p className="text-sm text-gray-500">Getting your location...</p>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {(locationState.latitude && locationState.longitude) && (
            <button
              onClick={clearLocation}
              className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
              title="Clear location"
            >
              <X className="h-4 w-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
          <button
            onClick={getCurrentLocation}
            disabled={locationState.loading}
            className="btn-medical flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${locationState.loading ? 'animate-spin' : ''}`} />
            <span>{locationState.loading ? 'Getting...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {locationState.error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Location Error</h4>
            <p className="text-sm text-red-700 mt-1">{locationState.error}</p>
            <p className="text-sm text-red-600 mt-2">
              To use VitaLink's location features, please:
            </p>
            <ul className="text-sm text-red-600 mt-1 list-disc list-inside space-y-1">
              <li>Enable location permissions in your browser</li>
              <li>Make sure GPS is turned on</li>
              <li>Check your internet connection</li>
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {locationState.latitude && locationState.longitude && (
        <div className="flex items-center space-x-3 p-4 bg-life-green/10 border border-life-green/20 rounded-lg">
          <div className="p-2 bg-life-green/20 rounded-full">
            <MapPin className="h-4 w-4 text-life-green" />
          </div>
          <div>
            <h4 className="font-medium text-life-green">Location Found!</h4>
            <p className="text-sm text-gray-600">
              We can now show you nearby donors and hospitals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationService;