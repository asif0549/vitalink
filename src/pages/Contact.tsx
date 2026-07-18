import React, { useState } from 'react';
import { Phone, Mail, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: User,
      title: 'Project Developer',
      details: ['Shaik Asif'],
      description: 'BTech CSE Student'
    },
    {
      icon: Mail,
      title: 'Email Contact',
      details: ['asif118shaik@gmail.com'],
      description: 'General inquiries and project feedback'
    }
  ];

  const emergencyContacts = [
    { name: 'National Emergency', number: '108', description: 'Medical Emergency Services' },
    { name: 'Ambulance Service', number: '102', description: 'Free Ambulance Service' },
    { name: 'Blood Bank Helpline', number: '104', description: 'National Health Helpline' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📞 <span className="text-gradient-hero">Contact VitaLink</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch for support, suggestions, or project inquiries
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-life-green/10 border border-life-green/20 rounded-xl p-6 text-center">
              <CheckCircle className="h-12 w-12 text-life-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-life-green mb-2">Message Sent Successfully!</h3>
              <p className="text-gray-700">
                Thank you for reaching out. I will get back to you as soon as possible.
              </p>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            🚨 <span className="text-gradient-hero">National Emergency Helpline Contacts</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-gradient-to-br from-emergency/10 to-urgent/10 rounded-xl p-6 text-center border border-emergency/20">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.name}</h3>
                <a 
                  href={`tel:${contact.number}`}
                  className="text-3xl font-bold text-emergency hover:text-urgent transition-colors block mb-2"
                >
                  {contact.number}
                </a>
                <p className="text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💬 Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="donor">Donor Support</option>
                    <option value="hospital">Hospital Partnership</option>
                    <option value="technical">Technical Support</option>
                    <option value="emergency">Emergency Assistance</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject of your message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your inquiry in detail..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-hero group flex items-center justify-center"
                disabled={submitted}
              >
                <Send className="h-5 w-5 mr-3" />
                Send Message
                <MessageSquare className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                📋 Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="card-medical">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                          <div className="space-y-1 mb-2">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="card-medical">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ❓ Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                <div className="text-gray-700">
                  <strong>Q: How do I register as a donor?</strong>
                  <p className="text-gray-600 mt-1">Visit our Donors page and click "Become a Donor" to register your account.</p>
                </div>
                <div className="text-gray-700">
                  <strong>Q: How does the location matching work?</strong>
                  <p className="text-gray-600 mt-1">We use HTML5 Geolocation to match blood seekers with the nearest available donors instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-medical-blue/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need to Find Blood Urgently?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Search for available blood donors and request emergency support
          </p>
          <div className="flex justify-center">
            <a 
              href="/receivers" 
              className="btn-medical text-lg"
            >
              🔍 Find Blood Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;