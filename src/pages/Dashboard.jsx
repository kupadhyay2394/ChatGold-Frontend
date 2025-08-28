import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Simple icon components for better visuals
const GoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-0 w-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [goldAmount, setGoldAmount] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");
  const [message, setMessage] = useState("");

  // Function to temporarily show a message and then clear it
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000); // Message disappears after 3 seconds
  };

  // ✅ Buy Gold Logic (with updated message handling)
  const buyGold = async () => {
    if (!goldAmount || goldAmount <= 0) {
      return showMessage("❌ Please enter a valid gold amount");
    }
    try {
      const res = await fetch("https://chatgold-1.onrender.com/api/v1/gold/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ goldGram: Number(goldAmount) }),
      });
      const data = await res.json();
      if (!res.ok) return showMessage(`❌ ${data.error || "Transaction failed"}`);
      
      const updatedUser = { ...user, userWallet: data.wallet, userGold: data.gold };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      showMessage("✅ Gold purchased successfully!");
      setGoldAmount("");
    } catch (error) {
      console.error("Error buying gold:", error);
      showMessage("❌ Something went wrong");
    }
  };

  // ✅ Sell Gold Logic (with updated message handling)
  const sellGold = async () => {
    if (!goldAmount || goldAmount <= 0) {
      return showMessage("❌ Please enter a valid gold amount");
    }
    try {
      const res = await fetch("https://chatgold-1.onrender.com/api/v1/gold/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({ goldGram: Number(goldAmount) }),
      });
      const data = await res.json();
      if (!res.ok) return showMessage(`❌ ${data.error || "Transaction failed"}`);
      
      const updatedUser = { ...user, userWallet: data.wallet, userGold: data.gold };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showMessage("✅ Gold sold successfully!");
      setGoldAmount("");
    } catch (error) {
      console.error("Error selling gold:", error);
      showMessage("❌ Something went wrong");
    }
  };

  // ✅ Add Money Logic (with updated message handling)
  const addMoney = async () => {
    if (!moneyAmount || moneyAmount <= 0) {
      return showMessage("❌ Please enter a valid amount");
    }
    try {
      const res = await fetch("https://chatgold-1.onrender.com/api/v1/gold/addmoney", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ amount: Number(moneyAmount) }),
      });
      const data = await res.json();
      if (!res.ok) return showMessage(`❌ ${data.error || "Adding money failed"}`);

      const updatedUser = { ...user, userWallet: data.user.userWallet, userGold: data.gold ?? user.userGold };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      showMessage("✅ Money added successfully!");
      setMoneyAmount("");
    } catch (error) {
      console.error("Error adding money:", error);
      showMessage("❌ Something went wrong");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Format numbers to have commas and 2 decimal places
  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* --- Header --- */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400">
              Welcome, {user?.fullName || user?.userName || user?.email}
            </h1>
            <p className="text-slate-400">Here's your financial summary.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* --- Status Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Wallet Balance Card */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start gap-4">
            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-lg"></div>
            <div>
              <p className="text-slate-400 text-sm">Wallet Balance</p>
              <p className="text-3xl font-semibold">₹ {formatNumber(user?.userWallet ?? 0)}</p>
            </div>
          </div>
          {/* Gold Balance Card */}
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex items-start gap-4">
            <div className="bg-amber-500/20 text-amber-400 p-3 rounded-lg"></div>
            <div>
              <p className="text-slate-400 text-sm">Gold Holdings</p>
              <p className="text-3xl font-semibold">{formatNumber(user?.userGold ?? 0)} gm</p>
            </div>
          </div>
        </div>

        {/* --- Action Panels --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buy/Sell Gold Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Manage Your Gold</h3>
            <input
              type="number"
              placeholder="Enter gold amount in grams"
              value={goldAmount}
              onChange={(e) => setGoldAmount(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
            <div className="flex gap-4 mt-4">
              <button onClick={buyGold} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">Buy Gold</button>
              <button onClick={sellGold} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">Sell Gold</button>
            </div>
          </div>

          {/* Add Money Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">Add to Wallet</h3>
            <input
              type="number"
              placeholder="Enter amount to add (₹)"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="flex gap-4 mt-4">
              <button onClick={addMoney} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">Add Money</button>
            </div>
          </div>
        </div>
        
        {/* --- Dynamic Message Toast --- */}
        {message && (
          <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white font-semibold transition-opacity duration-300 ${message.includes("✅") ? 'bg-green-600' : 'bg-red-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;