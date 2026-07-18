import React from 'react';
import { Heart, MapPin, Users, Building2, Award, Shield, Clock, Smartphone } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: MapPin,
      title: 'GPS-Based Matching',
      description: 'Advanced geolocation technology to find the nearest donors and hospitals instantly'
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'All donors and hospitals are verified with proper documentation and contact details'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Emergency blood requests can be made anytime, ensuring help is always available'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your personal information is protected with enterprise-level security measures'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Responsive design optimized for smartphones and tablets for easy access anywhere'
    },
    {
      icon: Award,
      title: 'Recognition System',
      description: 'Donors earn badges and recognition for their life-saving contributions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Heart className="h-16 w-16 text-primary mx-auto mb-6 heartbeat" fill="currentColor" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-gradient-hero">VitaLink</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            India's first GPS-based blood donation platform connecting donors, receivers, and hospitals 
            to save lives across the nation. Every drop counts, every second matters.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-primary/10 via-transparent to-medical-blue/10 rounded-3xl p-12 mb-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-2xl text-gray-700 font-medium mb-8 leading-relaxed">
            "To bridge the gap between blood donors and those in need through technology, 
            creating a seamless network that saves lives across India."
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <p className="text-lg text-gray-600 italic">
              "Every drop counts. Every donation matters. Every life saved is a victory."
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Why <span className="text-gradient-hero">VitaLink</span>?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Advanced technology meets compassionate healthcare to create India's most trusted blood donation platform
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-medical text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-blue/10 rounded-full mb-6 group-hover:bg-medical-blue/20 transition-colors">
                    <Icon className="h-8 w-8 text-medical-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How VitaLink Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-life-green rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Register & Verify</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Donors register with their details and blood group. Hospitals subscribe to access the platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">GPS Matching</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                When blood is needed, our system uses GPS to find the nearest available donors and hospitals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Save Lives</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Instant connection between donors and receivers saves precious time and ultimately saves lives.
              </p>
            </div>
          </div>
        </div>

        {/* Creator Profile */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Project Creator & Developer</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Developed and conceptualized as an independent project
          </p>
          
          <div className="max-w-xl mx-auto card-medical text-center border-t-4 border-primary">
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-glow rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              SA
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Shaik Asif</h3>
            <p className="text-primary font-semibold mb-4 text-lg">BTech CSE Student</p>
            <p className="text-gray-600 leading-relaxed">
              VitaLink was developed by Shaik Asif as an independent project born out of a personal vision to bridge the gap in emergency blood availability. Using modern full-stack web technologies and GPS matching, the platform ensures that help is always reachable in the shortest time.
            </p>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-white rounded-3xl p-12 mb-20 shadow-xl">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Technology Stack</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gradient-medical">Frontend Technologies</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-medical-blue rounded-full"></div>
                  <span>React.js with TypeScript for robust UI</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-medical-blue rounded-full"></div>
                  <span>Tailwind CSS for responsive design</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-medical-blue rounded-full"></div>
                  <span>Vite for fast development and builds</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-medical-blue rounded-full"></div>
                  <span>Progressive Web App capabilities</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gradient-donor">Core Features</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-life-green rounded-full"></div>
                  <span>Real-time GPS location tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-life-green rounded-full"></div>
                  <span>Advanced matching algorithms</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-life-green rounded-full"></div>
                  <span>Secure data encryption</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-life-green rounded-full"></div>
                  <span>Mobile-first responsive design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-primary-glow text-white rounded-3xl p-12">
          <Heart className="h-20 w-20 mx-auto mb-6 heartbeat" fill="currentColor" />
          <h2 className="text-4xl font-bold mb-6">Join the VitaLink Community</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of India's largest blood donation network. Together, we can save more lives and make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/donors" 
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Become a Donor
            </a>
            <a 
              href="/hospitals" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary transition-colors text-lg"
            >
              Hospital Partnership
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;