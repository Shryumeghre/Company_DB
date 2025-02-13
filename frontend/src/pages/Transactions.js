import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/transactions')
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching transactions:", error));
    }, []);

    const filteredTransactions = search ? transactions.filter(transaction => 
        transaction.store.toLowerCase().includes(search.toLowerCase()) ||
        transaction.txid.toString().includes(search)
    ) : transactions;

    return (
        <div>
            <h2 style={{display: 'flex', justifyContent:'center'}}>Transactions</h2>
            <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
                <input 
                    type="text" 
                    placeholder="Search by Store or Transaction ID" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Product ID</th>
                            <th>Store</th>
                            <th>Sales</th>
                            <th>Commission</th>
                            <th>Status</th>
                            <th>Added At</th>
                            <th>Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(transaction => (
                            <tr key={transaction.txid}>
                                <td>{transaction.txid}</td>
                                <td>{transaction.product_id}</td>
                                <td>{transaction.store}</td>
                                <td>${transaction.sales}</td>
                                <td>${transaction.commission}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.added_at}</td>
                                <td>{transaction.last_updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;