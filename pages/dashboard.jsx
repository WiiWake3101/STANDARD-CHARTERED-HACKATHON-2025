import { useState, useEffect } from 'react';
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import Navbar from "./components/Navbar";
import { db, auth } from "../firebaseConfig"; // Import Firebase configuration
import { collection, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  // ✅ State for selected account
  const [selectedAccount, setSelectedAccount] = useState("Paid Checking");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(collection(db, "users"), user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name); // Fetch name from Firebase
        }
      }
    });
  }, []);

  // ✅ Account Overview Pie Chart Data
  const accountData = {
    labels: ["Savings Account", "Main Account", "Spent"],
    datasets: [{
      data: [1500, 3000, 2000], // Combined balances & spent amount
      backgroundColor: ["#4CAF50", "#36A2EB", "#F44336"],
      borderWidth: 0,
      cutout: "60%",
    }],
  };

  const transactionsData = {
    "Paid Checking": [
      { name: "Uber Ride", amount: -10.00, status: "Processing", date: "May 8, 3:51 PM", channel: "Online", category: "Travel" },
      { name: "Amazon Purchase", amount: -150.00, status: "Success", date: "Apr 20, 3:45 PM", channel: "Online", category: "Shopping" },
      { name: "Starbucks", amount: -5.75, status: "Success", date: "Apr 15, 8:20 AM", channel: "In-Store", category: "Food & Drinks" },
      { name: "Netflix Subscription", amount: -15.99, status: "Success", date: "Apr 10, 6:00 PM", channel: "Online", category: "Entertainment" },
      { name: "Grocery Store", amount: -120.00, status: "Success", date: "Apr 5, 4:10 PM", channel: "In-Store", category: "Groceries" },
      { name: "Gym Membership", amount: -45.00, status: "Success", date: "Apr 1, 7:30 AM", channel: "Bank", category: "Fitness" },
      { name: "Spotify Premium", amount: -9.99, status: "Success", date: "Mar 25, 9:00 PM", channel: "Online", category: "Entertainment" },
      { name: "Electricity Bill", amount: -65.50, status: "Success", date: "Mar 20, 2:15 PM", channel: "Bank", category: "Utilities" },
      { name: "Gas Station", amount: -40.00, status: "Success", date: "Mar 15, 5:30 PM", channel: "In-Store", category: "Transport" },
      { name: "Hotel Booking", amount: -220.00, status: "Processing", date: "Mar 10, 10:00 AM", channel: "Online", category: "Travel" }
    ],
    "Paid Saving": [
      { name: "Interest Credit", amount: 50.00, status: "Success", date: "May 5, 12:00 PM", channel: "Bank", category: "Savings" },
      { name: "Transfer from Checking", amount: 200.00, status: "Success", date: "Apr 28, 9:00 AM", channel: "Online", category: "Transfer" },
      { name: "Salary Deposit", amount: 3000.00, status: "Success", date: "Apr 25, 5:00 PM", channel: "Bank", category: "Income" },
      { name: "Bonus Payment", amount: 500.00, status: "Success", date: "Apr 20, 11:00 AM", channel: "Bank", category: "Income" },
      { name: "Stock Dividend", amount: 120.00, status: "Success", date: "Apr 18, 3:45 PM", channel: "Bank", category: "Investment" },
      { name: "Emergency Fund Contribution", amount: 300.00, status: "Success", date: "Apr 10, 1:30 PM", channel: "Online", category: "Savings" },
      { name: "Government Tax Refund", amount: 750.00, status: "Success", date: "Apr 5, 8:00 AM", channel: "Bank", category: "Refund" },
      { name: "Gift from Family", amount: 200.00, status: "Success", date: "Apr 1, 12:00 PM", channel: "Bank", category: "Gift" },
      { name: "FD Maturity", amount: 1500.00, status: "Success", date: "Mar 20, 10:30 AM", channel: "Bank", category: "Investment" },
      { name: "Transfer from Brokerage", amount: 800.00, status: "Success", date: "Mar 10, 2:00 PM", channel: "Online", category: "Investment" }
    ]
  };

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-auto">
      {/* Sidebar (Navbar) */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:ml-64">
        {/* ✅ Account Overview Section */}
        <div className="flex items-start">
          <div className="w-1/3">
            <h1 className="text-3xl font-bold text-black text-left">Welcome, {userName}!</h1>
            <p className="text-lg text-black mt-2 text-left">
              Access and manage your account efficiently.
            </p>
            <h2 className="text-lg font-semibold text-black text-left mt-4 mb-4">Account Overview</h2>

            {/* ✅ Account Overview */}
            <div className="p-6 mt-6 rounded-lg shadow-lg bg-transparent">
              <div className="flex flex-row items-center">
                {/* 🎯 Pie Chart */}
                <div className="w-48">
                  <Doughnut
                    data={accountData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                      },
                      elements: {
                        arc: { borderWidth: 0 }
                      }
                    }}
                  />
                </div>

                {/* ✅ Account Balance */}
                <div className="ml-6">
                  <p className="text-lg font-semibold text-black">Total Balance:</p>
                  <p className="text-xl font-bold text-green-600">$4500</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Recent Transactions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-black">Recent Transactions</h2>

          {/* ✅ Tabs (Switch Accounts) */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              className={`px-4 py-2 border-b-2 font-semibold ${selectedAccount === "Paid Checking" ? "border-green-500 text-green-700" : "text-gray-500"
                }`}
              onClick={() => setSelectedAccount("Paid Checking")}
            >
              Paid Checking
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-semibold ${selectedAccount === "Paid Saving" ? "border-green-500 text-green-700" : "text-gray-500"
                }`}
              onClick={() => setSelectedAccount("Paid Saving")}
            >
              Paid Saving
            </button>
          </div>

          {/* ✅ Account Summary */}
          <div className="bg-blue-50 p-4 mt-4 rounded-lg flex items-center">
            <div className="text-lg font-bold text-blue-700">{selectedAccount}</div>
            <div className="ml-4 text-green-600 font-semibold text-xl">
              {selectedAccount === "Paid Checking" ? "$110.00" : "$250.00"}
            </div>
            <div className="ml-auto bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full">
              {selectedAccount === "Paid Checking" ? "checking" : "savings"}
            </div>
          </div>

          {/* ✅ Transactions Table (Scrollable) */}
          <div className="overflow-y-auto bg-white shadow-md rounded-lg mt-4" style={{ maxHeight: "400px" }}>
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-left text-black">
                  <th className="p-3">Transaction</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData[selectedAccount].map((txn, index) => (
                  <tr key={index} className="border-b text-black">
                    <td className="p-3">{txn.name}</td>
                    <td className={`p-3 font-semibold ${txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                      {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `$${txn.amount}`}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${txn.status === "Success" ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700"
                        }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-3">{txn.date}</td>
                    <td className="p-3">{txn.channel}</td>
                    <td className="p-3">{txn.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}