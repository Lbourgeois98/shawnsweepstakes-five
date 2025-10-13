subscriptions.push(subscription);
    });

    return () => {
      subscriptions.forEach((sub) => supabase.removeSubscription(sub));
    };
  }, []);

  const filteredTransactions = allTransactions.filter((tx) => {
    const nameMatch = tx.player_name?.toLowerCase().includes(filter.toLowerCase()) ||
                     tx.username?.toLowerCase().includes(filter.toLowerCase());
    const methodMatch = paymentFilter === "all" || tx.payment_method === paymentFilter;
    return nameMatch && methodMatch;
  });

  const totalDeposits = filteredTransactions.reduce((sum, tx) => sum + (parseFloat(tx.deposit_amount) || 0), 0);
  const completedDeposits = filteredTransactions.filter(tx => tx.status === "completed").length;

  const getStatusColor = (status) => {
    switch(status) {
      case "completed":
        return "bg-green-600 text-white";
      case "failed":
      case "canceled":
        return "bg-red-600 text-white";
      case "pending":
      case "initiated":
      case "processing":
      case "transfer_started":
        return "bg-yellow-600 text-black";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Shawn Sweeps</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-400">Admin Dashboard</h1>
            <a href="/" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">Back to Home</a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Deposits</p>
              <p className="text-3xl font-bold text-yellow-400">${totalDeposits.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-yellow-400">{filteredTransactions.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-400">{completedDeposits}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by player name or username..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              <option value="Wert">Wert</option>
              <option value="TierLock">TierLock</option>
              <option value="FNUPAY">FNUPAY</option>
              <option value="Bitcoin">Bitcoin</option>
            </select>
          </div>

          {/* Transactions Table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Player Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Game</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={`${tx.table}-${tx.id}`} className="border-b border-gray-700 hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm">{tx.player_name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{tx.username || "N/A"}</td>
                        <td className="px-6 py-4 text-sm">{tx.game_name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-400">${parseFloat(tx.deposit_amount || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                            {tx.payment_method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                            {tx.status || "unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
