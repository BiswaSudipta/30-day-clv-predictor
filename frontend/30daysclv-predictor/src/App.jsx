import React, { useState } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  ShoppingBag, 
  Repeat, 
  Calendar, 
  Clock, 
  Activity, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  BarChart3,
  Sparkles,
  Bug,
  Percent,
  DollarSign
} from 'lucide-react';

// --- Configuration ---
const API_URL = 'https://clv30days-h5cjdwchbagfa2f8.southeastasia-01.azurewebsites.net/predict';

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
      <TrendingUp className="w-7 h-7 text-white" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-slate-800 tracking-tight leading-none">
        30Days<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">CLV</span>
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 ml-0.5">
        Predictor
      </span>
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, icon: Icon, placeholder, type = "number", hint }) => (
  <div className="space-y-2 group">
    <div className="flex justify-between items-baseline">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider group-focus-within:text-indigo-600 transition-colors">
        {label}
      </label>
      {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
    </div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        step="any"
        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm hover:bg-white hover:border-slate-300"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function App() {
  const [formData, setFormData] = useState({
    total_orders: 30,
    total_products: 180,
    reorder_rate: 0.65,
    avg_days_between_orders: 7.2,
    recency_days: 3,
    orders_last_5: 4
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Prepare Payload
    const payload = {
        total_orders: Number(formData.total_orders),
        total_products: Number(formData.total_products),
        reorder_rate: Number(formData.reorder_rate),
        avg_days_between_orders: Number(formData.avg_days_between_orders),
        recency_days: Number(formData.recency_days),
        orders_last_5: Number(formData.orders_last_5)
    };

    try {
      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Directly set the data object
      // Expected format: { "buy_probability": 0.99, "expected_spend_if_buy": 8.96, "predicted_30d_clv": 8.87 }
      setResult(response.data);

    } catch (err) {
      console.error("❌ Request Failed:", err);
      let msg = "Unknown error occurred.";
      if (err.code === "ERR_NETWORK") {
        msg = "Connection Blocked. Please check your backend connection.";
      } else if (err.response) {
        msg = `Server Error: ${err.response.status}`;
      } else {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
               <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               </div>
               <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">System Online</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-7 space-y-6">
             <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 overflow-hidden backdrop-blur-sm bg-white/90">
              
              <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Customer Metrics</h2>
                </div>
                <p className="text-slate-500 text-sm ml-1">
                  Enter historical data to generate a machine learning prediction.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <InputField 
                    label="Total Orders" 
                    name="total_orders" 
                    value={formData.total_orders} 
                    onChange={handleChange} 
                    icon={ShoppingBag}
                    placeholder="e.g. 30"
                    hint="Lifetime count"
                  />
                  <InputField 
                    label="Total Products" 
                    name="total_products" 
                    value={formData.total_products} 
                    onChange={handleChange} 
                    icon={BarChart3}
                    placeholder="e.g. 180"
                    hint="Items purchased"
                  />
                  <InputField 
                    label="Reorder Rate" 
                    name="reorder_rate" 
                    value={formData.reorder_rate} 
                    onChange={handleChange} 
                    icon={Repeat}
                    placeholder="0.0 - 1.0"
                    hint="Retention %"
                  />
                  <InputField 
                    label="Avg Days Between" 
                    name="avg_days_between_orders" 
                    value={formData.avg_days_between_orders} 
                    onChange={handleChange} 
                    icon={Clock}
                    placeholder="e.g. 7.2"
                    hint="Purchase frequency"
                  />
                  <InputField 
                    label="Recency" 
                    name="recency_days" 
                    value={formData.recency_days} 
                    onChange={handleChange} 
                    icon={Calendar}
                    placeholder="Days ago"
                    hint="Since last order"
                  />
                  <InputField 
                    label="Recent Activity" 
                    name="orders_last_5" 
                    value={formData.orders_last_5} 
                    onChange={handleChange} 
                    icon={Sparkles}
                    placeholder="Count"
                    hint="Orders last 5 days"
                  />
                </div>

                <div className="mt-10 pt-4 border-t border-slate-50">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-indigo-600/30 transition-all duration-300 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
                          <span>Calculating...</span>
                        </>
                      ) : (
                        <>
                          <span>Run Prediction Model</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* Results Display */}
            {result ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Header Badge */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            Prediction Complete
                        </div>
                    </div>

                    {/* Card 1: 30 Day CLV */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-500/10 border border-indigo-100 p-8 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Predicted CLV (30 Days)
                            </p>
                            <div className="flex items-center justify-center text-slate-900 my-2">
                                <span className="text-6xl font-black tracking-tighter">
                                    ${Number(result.predicted_30d_clv || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Buy Probability */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-500/10 border border-slate-100 p-8 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Percent className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                Buy Probability
                            </p>
                            <div className="flex items-center justify-center text-slate-900 my-2">
                                <span className="text-5xl font-black tracking-tighter">
                                    {/* Convert 0.99 to 99% */}
                                    {(Number(result.buy_probability || 0) * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State Placeholder */
                <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center h-64 bg-slate-50/50">
                  <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No Results Yet</h3>
                  <p className="text-slate-400 text-sm mt-1 max-w-xs">Run the prediction model to see CLV and Buy Probability estimates.</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
               <div className="bg-red-50 border border-red-100 rounded-2xl p-4 animate-in slide-in-from-bottom-2 shadow-sm">
                 <div className="flex gap-3">
                   <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                   <div>
                      <h4 className="text-sm font-bold text-red-800">Request Failed</h4>
                      <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
                   </div>
                 </div>
               </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}