import React, { useState } from 'react';
import { Building2, CreditCard, Users, MapPin, Phone, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { mockHospitals, mockTransactions, type Hospital } from '../data/mockData';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const subscribedHospitals = hospitals.filter(h => h.isSubscribed);
  const unsubscribedHospitals = hospitals.filter(h => !h.isSubscribed);

  const handleSubscription = (hospitalId: string) => {
    // Simulate subscription process
    setHospitals(prev => prev.map(hospital => 
      hospital.id === hospitalId 
        ? { 
            ...hospital, 
            isSubscribed: true, 
            subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        : hospital
    ));

    setTransactionResult({
      type: 'success',
      message: '✅ Subscription successful! ₹999 has been charged for monthly access.'
    });

    setTimeout(() => {
      setTransactionResult(null);
      setShowSubscription(false);
    }, 3000);
  };

  const handleBloodRequest = (hospitalId: string) => {
    // Process blood request
    setTransactionResult({
      type: 'success',
      message: '✅ Blood request sent successfully to the hospital!'
    });

    setTimeout(() => {
      setTransactionResult(null);
    }, 3000);
  };

  const isSubscriptionExpired = (hospital: Hospital) => {
    if (!hospital.subscriptionExpiry) return true;
    return new Date(hospital.subscriptionExpiry) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="h-12 w-12 text-hospital-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 <span className="text-gradient-medical">Hospitals & Blood Banks</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partner hospitals and blood banks across India. Subscribe to access our donor network.
          </p>
        </div>

        {/* Transaction Result */}
        {transactionResult && (
          <div className={`mb-8 p-4 rounded-xl border ${
            transactionResult.type === 'success' 
              ? 'bg-life-green/10 border-life-green/20 text-life-green' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center space-x-3">
              {transactionResult.type === 'success' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
              <p className="font-medium">{transactionResult.message}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-hospital text-center">
            <Building2 className="h-12 w-12 text-hospital-primary mx-auto mb-4" />
            <div className="text-3xl font-bold text-hospital-primary mb-2">{hospitals.length}</div>
            <div className="text-gray-600">Total Hospitals</div>
          </div>
          <div className="card-hospital text-center">
            <CheckCircle className="h-12 w-12 text-life-green mx-auto mb-4" />
            <div className="text-3xl font-bold text-life-green mb-2">{subscribedHospitals.length}</div>
            <div className="text-gray-600">Subscribed</div>
          </div>
          <div className="card-hospital text-center">
            <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold text-primary mb-2">₹999</div>
            <div className="text-gray-600">Monthly Subscription</div>
          </div>
        </div>

        {/* Subscription Model Info */}
        <div className="mb-12 bg-gradient-to-r from-hospital-primary/10 to-medical-blue/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            💼 VitaLink Hospital Subscription Model
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-hospital-primary mb-4">Monthly Subscription</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Monthly Fee:</span>
                  <span className="font-bold text-2xl text-primary">₹999</span>
                </div>
                <div className="text-gray-600">
                  • Access to complete donor database
                  • Real-time donor availability
                  • GPS-based donor matching
                  • 24/7 platform access
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-hospital-primary mb-4">Platform Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Free Services:</span>
                  <span className="font-bold text-2xl text-life-green">No Extra Fees</span>
                </div>
                <div className="text-gray-600">
                  • No transaction charges for hospitals
                  • Free donor matching service
                  • Unlimited blood requests
                  • 24/7 platform support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribed Hospitals */}
        {subscribedHospitals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              ✅ <span className="text-gradient-medical">Active Subscribers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscribedHospitals.map(hospital => (
                <div key={hospital.id} className="card-hospital relative">
                  <div className="absolute top-4 right-4">
                    <div className={`p-2 rounded-full ${
                      isSubscriptionExpired(hospital) 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-life-green/10 text-life-green'
                    }`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 pr-12">{hospital.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.city}, {hospital.state}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>Address:</strong> {hospital.address}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{hospital.contactNumber}</span>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Available Blood Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hospital.availableBloodTypes.map(type => (
                          <span key={type} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    {hospital.subscriptionExpiry && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          Expires: {new Date(hospital.subscriptionExpiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleBloodRequest(hospital.id)}
                        className="btn-medical w-full"
                      >
                        Request Blood
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unsubscribed Hospitals */}
        {unsubscribedHospitals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">
              🏥 <span className="text-gradient-medical">Partner Hospitals</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unsubscribedHospitals.map(hospital => (
                <div key={hospital.id} className="card-hospital relative opacity-75">
                  <div className="absolute top-4 right-4">
                    <div className="p-2 rounded-full bg-gray-100 text-gray-400">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 pr-12">{hospital.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.city}, {hospital.state}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>Address:</strong> {hospital.address}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{hospital.contactNumber}</span>
                    </div>

                    <div>
                      <span className="text-gray-600 text-sm">Available Blood Types:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hospital.availableBloodTypes.map(type => (
                          <span key={type} className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>Prototype Mode:</strong> Activate free access to view details and features.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedHospital(hospital);
                          setShowSubscription(true);
                        }}
                        className="btn-hospital w-full font-semibold"
                      >
                        Activate Access (Free)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Modal */}
        {showSubscription && selectedHospital && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🏥 Hospital Activation
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <h4 className="font-semibold text-lg">{selectedHospital.name}</h4>
                  <p className="text-gray-600">{selectedHospital.city}, {selectedHospital.state}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold mb-3">Activation Details (Prototype):</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Activation Fee:</span>
                      <span className="font-bold text-life-green">Free (₹0)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validity:</span>
                      <span>365 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fees:</span>
                      <span className="text-life-green font-semibold">Free</span>
                    </div>
                  </div>
                </div>

                <div className="bg-life-green/10 rounded-lg p-4">
                  <h5 className="font-semibold text-life-green mb-2">Features Included:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Access to complete donor database</li>
                    <li>• Real-time donor availability</li>
                    <li>• GPS-based matching system</li>
                    <li>• 24/7 platform support</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSubscription(selectedHospital.id)}
                  className="flex-1 btn-hospital"
                >
                  Activate Now
                </button>
                <button
                  onClick={() => {
                    setShowSubscription(false);
                    setSelectedHospital(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💳 Recent Transactions
          </h2>
          <div className="space-y-4">
            {mockTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary">₹{transaction.amount}</div>
                  <div className="text-sm text-gray-600 capitalize">{transaction.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;