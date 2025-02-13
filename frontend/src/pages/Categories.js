import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5000/api/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const filteredCategories = search ? categories.filter(category => 
        category.category_name.toLowerCase().includes(search.toLowerCase()) ||
        category.category_id.toString().includes(search)
    ) : categories;

    return (
        <div>
            <h2 style={{display: 'flex', justifyContent:'center'}}>Categories</h2>
            <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems: 'center'}}>
                <input 
                    type="text" 
                    placeholder="Search by Category Name or ID" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Category Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(category => (
                            <tr key={category.category_id}>
                                <td>{category.category_id}</td>
                                <td>{category.category_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;