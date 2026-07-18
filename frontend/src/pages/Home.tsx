import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  MapPin, 
  Users, 
  Building2, 
  Search, 
  Droplets, 
  Shield, 
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  const features = [
    {
      icon: MapPin,
      title: 'GPS Location Matching',
      description: 'Automatically calculates nearby available donors using coordinates'
    },
    {
      icon: Clock,
      title: '24/7 Emergency Requests',
      description: 'Enables quick emergency requests and sends notifications to matches'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Partners',
      description: 'Connects verified hospitals and blood donors under a secure framework'
    },
    {
      icon: Award,
      title: 'Hero Rewards System',
      description: 'Awards badges and certificate templates for verified blood donations'
    }
  ];

  const getDashboardPath = () => {
    if (!user) return '/auth';
    const role = user.role.toUpperCase();
    if (role === 'DONOR') return '/dashboard/donor';
    if (role === 'RECEIVER') return '/dashboard/receiver';
    if (role === 'HOSPITAL') return '/dashboard/hospital';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/auth';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      
      {/* Hero Section */}
      <section className="relative bg-hero-pattern py-24 px-4 overflow-hidden flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-medical-blue/5"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Heart className="h-16 w-16 text-primary mx-auto mb-2 heartbeat" fill="currentColor" />
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none">
              India's GPS-Powered <br />
              <span className="text-primary font-black">Blood Donation Network</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting blood donors, hospitals, and receivers in real-time. Instantly matching locations to verify arrangements, save lives, and record rewards.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="btn-hero px-8 py-4 text-base font-bold flex items-center space-x-2 shadow-lg">
                <span>Access Dashboard Console</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link to="/receivers" className="btn-hero px-6 py-3.5 text-sm font-bold flex items-center space-x-2 shadow-md">
                  <Search className="h-4.5 w-4.5" />
                  <span>Request Blood</span>
                </Link>
                <Link to="/auth?mode=register&role=DONOR" className="btn-donor px-6 py-3.5 text-sm font-bold flex items-center space-x-2 shadow-md">
                  <Droplets className="h-4.5 w-4.5" />
                  <span>Become a Donor</span>
                </Link>
                <Link to="/auth?mode=register&role=HOSPITAL" className="btn-hospital px-6 py-3.5 text-sm font-bold flex items-center space-x-2 shadow-md">
                  <Building2 className="h-4.5 w-4.5" />
                  <span>Hospital Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Core Matching Explanation */}
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur border border-red-100 p-6 rounded-2xl shadow-sm text-left space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center">
              <Activity className="h-4 w-4 mr-2 text-primary heartbeat" />
              Real-time Matching System
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When a request is posted by a receiver or emergency console, VitaLink uses MongoDB 2D-Sphere calculations to notify online available blood group matches within a 50KM radius. Donors share their coordinates dynamically, allowing hospitals to confirm receipt and deduct transaction maintenance fees from digital wallets securely.
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why use <span className="text-primary font-black">VitaLink?</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              A comprehensive directory system built to remove human friction and manual coordinate checking during medical emergencies in India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-medical p-6 border border-gray-100 rounded-2xl hover:shadow-md hover:border-primary/10 transition-all flex flex-col justify-between">
                  <div>
                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl inline-block mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Section Callout */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50/50 border-y border-red-100 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🚨 Immediate Emergency Blood Request Needed?
          </h2>
          <p className="text-xs text-gray-600">
            Click below to access our urgent blood dispatch dashboard. Allows creating high-urgency alerts without registering full profile details first.
          </p>
          <Link to="/emergency" className="btn-emergency inline-block text-xs font-bold px-6 py-3 shadow-md">
            Trigger Emergency Dispatch
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;