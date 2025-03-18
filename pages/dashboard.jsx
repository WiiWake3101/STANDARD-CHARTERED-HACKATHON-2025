import { Doughnut } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import Navbar from "./components/Navbar";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
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

  // ✅ Transaction Data (More data added for scrolling)
  const transactions = [
    { name: "test transfer", amount: -10.00, status: "Processing", date: "Wed, May 8, 3:51 PM", channel: "Online", category: "Transfer" },
    { name: "Uber 072515 SFPOOL", amount: 6.33, status: "Success", date: "Mon, May 6, 8:00 PM", channel: "Online", category: "Travel" },
    { name: "Uber 063015 SFPOOL", amount: 5.40, status: "Success", date: "Tue, Apr 23, 8:00 PM", channel: "Online", category: "Travel" },
    { name: "United Airlines", amount: -500.00, status: "Success", date: "Sun, Apr 21, 8:00 PM", channel: "In Store", category: "Travel" },
    { name: "Amazon Purchase", amount: -150.00, status: "Success", date: "Sat, Apr 20, 3:45 PM", channel: "Online", category: "Shopping" },
    { name: "Netflix Subscription", amount: -15.99, status: "Success", date: "Fri, Apr 19, 10:30 AM", channel: "Online", category: "Entertainment" },
    { name: "Spotify Premium", amount: -9.99, status: "Success", date: "Thu, Apr 18, 7:00 AM", channel: "Online", category: "Entertainment" },
    { name: "Starbucks Coffee", amount: -5.75, status: "Success", date: "Wed, Apr 17, 9:15 AM", channel: "In Store", category: "Food" },
    { name: "Grocery Store", amount: -120.49, status: "Success", date: "Tue, Apr 16, 6:00 PM", channel: "In Store", category: "Groceries" },
    { name: "Gym Membership", amount: -30.00, status: "Success", date: "Mon, Apr 15, 5:30 PM", channel: "Online", category: "Health" },
    { name: "Movie Ticket", amount: -12.50, status: "Success", date: "Sun, Apr 14, 8:00 PM", channel: "Online", category: "Entertainment" },
    { name: "Electricity Bill", amount: -85.30, status: "Success", date: "Sat, Apr 13, 4:00 PM", channel: "Online", category: "Utilities" },
    { name: "Water Bill", amount: -45.20, status: "Success", date: "Fri, Apr 12, 2:00 PM", channel: "Online", category: "Utilities" },
    { name: "Phone Bill", amount: -60.00, status: "Success", date: "Thu, Apr 11, 3:00 PM", channel: "Online", category: "Utilities" },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-auto">
      {/* Sidebar (Navbar) */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:ml-64">
        {/* ✅ Account Overview Section */}
        <div className="flex items-start">
          <div className="w-1/3">
            <h1 className="text-3xl font-bold text-black text-left">Welcome, Vivek!</h1>
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

          {/* Tabs */}
          <div className="flex space-x-4 mt-4">
            <button className="px-4 py-2 border-b-2 border-green-500 text-green-700 font-semibold">Plaid Checking</button>
            <button className="px-4 py-2 text-gray-500">Paid Saving</button>
          </div>

          {/* Account Summary */}
          <div className="bg-blue-50 p-4 mt-4 rounded-lg flex items-center">
            <div className="text-lg font-bold text-blue-700">Paid Checking</div>
            <div className="ml-4 text-green-600 font-semibold text-xl">$110.00</div>
            <div className="ml-auto bg-green-200 text-green-700 text-xs px-3 py-1 rounded-full">checking</div>
          </div>

          {/* Transactions Table (Scrollable) */}
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
                {transactions.map((txn, index) => (
                  <tr key={index} className="border-b text-black">
                    <td className="p-3">{txn.name}</td>
                    <td className={`p-3 font-semibold ${txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                      {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `$${txn.amount}`}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        txn.status === "Success" ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700"
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