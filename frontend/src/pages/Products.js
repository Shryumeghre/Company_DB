import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    const filteredProducts = search ? products.filter(product => 
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.product_id.toString().includes(search) ||
        product.category_id.toString().includes(search)
    ) : products;

    return (
        <div>
            <h2 style={{display: 'flex', justifyContent:'center'}}>Products</h2>
            <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
                <input 
                    type="text" 
                    placeholder="Search by Title, Product ID, or Category ID" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Title</th>
                            <th>Category ID</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.title}</td>
                                <td>{product.category_id}</td>
                                <td>${product.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
