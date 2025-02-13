import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Transactions from './pages/Transactions';
import Timeline from './pages/Timeline';
import Navbar from './components/Navbar';

const App = () => {
    return (

        <div>
            <Navbar />
            <div style={{ display: 'flex' }}>
                {/* <Sidebar /> */}
                <div style={{ marginLeft: '8px', padding: '20px', width: '100%' }}>
                    <Routes>
                        <Route path="/" element={<Timeline />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/timeline" element={<Timeline />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;
