import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hospitalApi, requestApi } from '../../services/api';
import { Heart, Droplets, CreditCard, Award, CheckCircle, RefreshCw, Plus, Minus, Wallet, Clock, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { bloodGroups } from '../../data/mockData';

const HospitalDashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [bloodTypes, setBloodTypes] = useState<string[]>(profile?.availableBloodTypes || []);
  const [payments, setPayments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Checkout Modal State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('500');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Stats
  const [totalDeducted, setTotalDeducted] = useState(0);

  const loadData = async () => {
    try {
      const p = await hospitalApi.getPayments();
      setPayments(p);

      // Calculate total deductions
      const deducted = p
        .filter((pay: any) => pay.type === 'MAINTENANCE' || pay.type === 'SUBSCRIPTION')
        .reduce((sum: number, pay: any) => sum + pay.amount, 0);
      setTotalDeducted(deducted);

      const r = await requestApi.getHospitalRequests();
      setRequests(r);

      if (profile) {
        setBloodTypes(profile.availableBloodTypes || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile]);

  const handleBloodToggle = async (type: string) => {
    const nextList = bloodTypes.includes(type)
      ? bloodTypes.filter(t => t !== type)
      : [...bloodTypes, type];
    
    setBloodTypes(nextList);
    try {
      await hospitalApi.updateInventory(nextList);
      refreshProfile();
      toast.success(`Updated inventory listing.`);
    } catch (err) {
      toast.error("Failed to update inventory.");
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid recharge amount.");
      return;
    }
    // Skip credit card validation for the prototype
    setLoading(true);
    try {
      await hospitalApi.rechargeWallet(amt);
      toast.success(`Wallet successfully recharged by Rs.${amt}!`);
      setShowRechargeModal(false);
      setCardNumber('');
      setCardCvv('');
      setCardExpiry('');
      refreshProfile();
    } catch (err) {
      toast.error("Wallet recharge failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: string) => {
    const prices: Record<string, number> = { BASIC: 500, PREMIUM: 1200, ENTERPRISE: 3000 };
    const price = prices[plan];

    if ((profile?.walletBalance || 0) < price) {
      toast.error("Insufficient wallet balance. Recharge your wallet first!");
      return;
    }

    if (!confirm(`Subscribe to ${plan} Plan for Rs.${price}/month?`)) return;

    try {
      await hospitalApi.buySubscription(plan);
      toast.success(`Successfully subscribed to ${plan} Plan!`);
      refreshProfile();
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to purchase subscription.");
    }
  };

  const handleConfirmDonation = async (requestId: string) => {
    if (!confirm("Confirm blood arrangement completion? Maintenance Fee of Rs.150 will be deducted from your wallet.")) return;
    try {
      await requestApi.confirmRequest(requestId);
      toast.success("Blood donation completed and logged! Maintenance fee deducted.");
      refreshProfile();
    } catch (err: any) {
      toast.error(err.response?.data || "Deduction failed. Ensure sufficient wallet balance.");
    }
  };

  const activeSubscription = profile?.subscribed && profile?.subscriptionPlan;
  const pendingConfirmations = requests.filter((r: any) => r.status === 'ACCEPTED');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header summary info */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-medical-blue/10 rounded-2xl text-medical-blue">
              <Plus className="h-10 w-10 text-primary-glow" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Hospital Portal</span>
              <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{profile?.address}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Wallet Widget */}
            <div className="bg-gradient-to-br from-medical-blue/5 to-medical-blue/10 border border-medical-blue/20 p-4 rounded-xl flex items-center space-x-4">
              <div className="p-2 bg-medical-blue/20 rounded-lg text-medical-blue">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Wallet Balance</span>
                <span className="text-lg font-black text-gray-900">Rs. {profile?.walletBalance?.toFixed(2) || '0.00'}</span>
              </div>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="bg-medical-blue hover:bg-medical-blue/90 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Recharge</span>
              </button>
            </div>

            {/* Active Subscription status */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-4 rounded-xl flex items-center space-x-4">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Plan Status</span>
                <span className="text-sm font-bold text-gray-800">
                  {activeSubscription ? `${profile.subscriptionPlan} Plan` : 'Unsubscribed'}
                </span>
                {profile?.subscriptionExpiry && (
                  <span className="text-[9px] text-gray-400 block">Exp: {new Date(profile.subscriptionExpiry).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Blood Inventory Listing */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-primary" /> Blood Bank Stock Registry
              </h2>
              <p className="text-xs text-gray-500 mt-1">Select blood types currently available in your storage bank.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {bloodGroups.map(type => {
                const hasType = bloodTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => handleBloodToggle(type)}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${hasType ? 'bg-primary/5 border-primary text-primary font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <span>{type} Stock</span>
                    <span className={`h-3 w-3 rounded-full ${hasType ? 'bg-primary heartbeat' : 'bg-gray-300'}`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pending Confirmations & Verify System */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" /> Pending Donation Verification Logs
            </h2>

            {pendingConfirmations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <CheckCircle className="h-10 w-10 text-life-green mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 text-sm">No Pending Confirmations</h3>
                <p className="text-xs text-gray-500 mt-1">Donors have not matched requests at your hospital today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingConfirmations.map((req) => (
                  <div key={req.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/20 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xxs font-bold uppercase">
                          Donor Confirmed
                        </span>
                        <span className="text-xxs text-gray-400">Request: {req.id.substring(0, 8)}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm mt-1.5">
                        Patient: {req.patientName} (Required: <span className="text-primary">{req.bloodGroup}</span>)
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Deducts Maintenance Fee of Rs.150 from hospital wallet on confirmation.
                      </p>
                    </div>

                    <button
                      onClick={() => handleConfirmDonation(req.id)}
                      className="bg-life-green hover:bg-life-green/95 text-white font-bold text-xs px-4 py-2 w-full sm:w-auto text-center rounded-lg"
                    >
                      Confirm Successful Donation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Subscription Plan upgrades */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" /> Hospital Subscription Center
            </h2>
            <p className="text-xs text-gray-500 mt-1">Upgrade your portal membership to access advanced dashboard analytics and GPS request listings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Basic Plan */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${profile?.subscriptionPlan === 'BASIC' ? 'bg-primary/5 border-primary' : 'bg-white border-gray-200'}`}>
              <div>
                <span className="text-xs font-bold text-primary tracking-widest block uppercase">Basic Plan</span>
                <span className="text-3xl font-black text-gray-900 block mt-2">Rs. 500<span className="text-xs font-semibold text-gray-500">/mo</span></span>
                <p className="text-xs text-gray-500 mt-3">Provides basic GPS tracking and registry access features.</p>
              </div>
              <button
                onClick={() => handleSubscribe('BASIC')}
                disabled={profile?.subscriptionPlan === 'BASIC'}
                className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition-all ${profile?.subscriptionPlan === 'BASIC' ? 'bg-primary/20 text-primary cursor-default' : 'bg-primary text-white hover:bg-primary-glow'}`}
              >
                {profile?.subscriptionPlan === 'BASIC' ? 'Active Membership' : 'Subscribe Now'}
              </button>
            </div>

            {/* Premium Plan */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${profile?.subscriptionPlan === 'PREMIUM' ? 'bg-primary/5 border-primary shadow-lg ring-1 ring-primary' : 'bg-white border-gray-200'}`}>
              <div className="absolute -top-3 right-6 bg-primary text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Popular</div>
              <div>
                <span className="text-xs font-bold text-primary tracking-widest block uppercase">Premium Plan</span>
                <span className="text-3xl font-black text-gray-900 block mt-2">Rs. 1,200<span className="text-xs font-semibold text-gray-500">/mo</span></span>
                <p className="text-xs text-gray-500 mt-3">Full nearby active request lists and custom GPS boundary settings alerts.</p>
              </div>
              <button
                onClick={() => handleSubscribe('PREMIUM')}
                disabled={profile?.subscriptionPlan === 'PREMIUM'}
                className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition-all ${profile?.subscriptionPlan === 'PREMIUM' ? 'bg-primary/20 text-primary cursor-default' : 'bg-primary text-white hover:bg-primary-glow'}`}
              >
                {profile?.subscriptionPlan === 'PREMIUM' ? 'Active Membership' : 'Subscribe Now'}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${profile?.subscriptionPlan === 'ENTERPRISE' ? 'bg-primary/5 border-primary' : 'bg-white border-gray-200'}`}>
              <div>
                <span className="text-xs font-bold text-primary tracking-widest block uppercase">Enterprise Plan</span>
                <span className="text-3xl font-black text-gray-900 block mt-2">Rs. 3,000<span className="text-xs font-semibold text-gray-500">/mo</span></span>
                <p className="text-xs text-gray-500 mt-3">Priority patient listings, custom maps integration, and priority emergency routing.</p>
              </div>
              <button
                onClick={() => handleSubscribe('ENTERPRISE')}
                disabled={profile?.subscriptionPlan === 'ENTERPRISE'}
                className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition-all ${profile?.subscriptionPlan === 'ENTERPRISE' ? 'bg-primary/20 text-primary cursor-default' : 'bg-primary text-white hover:bg-primary-glow'}`}
              >
                {profile?.subscriptionPlan === 'ENTERPRISE' ? 'Active Membership' : 'Subscribe Now'}
              </button>
            </div>

          </div>
        </div>

        {/* Transaction History log */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" /> Wallet Statement & Transactions
          </h2>

          {payments.length === 0 ? (
            <p className="text-xs text-gray-500 italic text-center py-6">Your transaction statements are empty.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                    <th className="py-2.5 px-2">Transaction ID</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-right">Amount</th>
                    <th className="py-2.5 px-2 text-right">Receipt #</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-gray-500">{p.id.substring(0, 8)}...</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${p.type === 'RECHARGE' ? 'bg-life-green/10 text-life-green' : p.type === 'MAINTENANCE' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">{p.description}</td>
                      <td className={`py-3 px-2 text-right font-bold ${p.type === 'RECHARGE' ? 'text-life-green' : 'text-red-500'}`}>
                        {p.type === 'RECHARGE' ? '+' : '-'} Rs. {p.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-400">{p.receiptNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Credit Card Recharge Modal Overlay */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/70 flex items-center justify-center p-4">
          <form onSubmit={handleRecharge} className="bg-white max-w-sm w-full p-6 rounded-xl border border-gray-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-primary" /> Wallet Recharge Portal
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Enter Recharge Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Credit Card Number (Optional - Prototype)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Card number not required"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Expiry Date (Optional)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">CVV Code (Optional)</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="CVV"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowRechargeModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                {loading ? 'Validating...' : 'Submit Payment'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default HospitalDashboard;
