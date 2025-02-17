import { useNavigate } from 'react-router-dom';
import './Timeline.css';

const Timeline = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Navbar */}
            <div className="navbar">
                {/* <a href="/">Home</a> */}
                <a href="/products">Products</a>
                <a href="/categories">Categories</a>
                <a href="/transactions">Transactions</a>
                {/* <a href="/experience">Experience</a> */}
            </div>

            {/* Timeline Container */}
            <div className="timeline-container">
                
                <div className="timeline">
                    <div className="timeline-item" onClick={() => navigate('/products')}>
                        <h3>Product Table</h3>
                        <p className="company">These table contains: ProductID, Product name, CategoryID and Price of an item.</p>
                    </div>
                    
                    <div className="timeline-item" onClick={() => navigate('/categories')}>
                        <h3>Category Table</h3>
                        <p className="company">These table contains CategoryID and Category name.</p>
                    </div>

                    <div className="timeline-item" onClick={() => navigate('/transactions')}>
                        <h3>Transaction Table</h3>
                        <p className="company">These table contains TransactionID, ProductID, Store, Sales, Commission, Status, Added at, Last updated.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline; 