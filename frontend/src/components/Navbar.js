import React from 'react';

const Navbar = () => {
    return (
        <header style={{ 
            background: '#333', 
            color: '#fff', 
            padding: '1px', 
            paddingLeft:'10px',
            textAlign: 'center', 
             
            marginTop: '10px' // Adds space between the page top and header
        }}>
            <p style={{fontWeight: 'bold', fontSize:'30px'}}>Company Dashboard</p>
        </header>
    );
};

export default Navbar;
