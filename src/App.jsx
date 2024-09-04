import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProductDetails from "./ProductDetails";

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10.0,
      description: "Description of Product 1",
      images: ["/assets/product1.jpg", "/assets/product1-2.jpg"],
    },
    {
      id: 2,
      name: "Product 2",
      price: 20.0,
      description: "Description of Product 2",
      images: ["/assets/product2.jpg", "/assets/product2-2.jpg"],
    },
    {
      id: 3,
      name: "Product 3",
      price: 30.0,
      description: "Description of Product 3",
      images: ["/assets/product3.jpg", "/assets/product3-2.jpg"],
    },
  ];

  return (
    <Router>
      <div>
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <Link className="navbar-brand" to="/">
            eShop
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link">
                  Cart ({cartItems.length})
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route
            exact
            path="/"
            element={
              <div className="container mt-5 pt-5">
                <h1 className="text-center">Featured Products</h1>
                <div className="row">
                  {products.map((product) => (
                    <div key={product.id} className="col-md-4 product-card">
                      <div className="card">
                        <img
                          src={product.images[0]}
                          className="card-img-top"
                          alt={product.name}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">
                            ${product.price.toFixed(2)}
                          </p>
                          <button
                            className="btn btn-primary"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                          <Link
                            to={`/product/${product.id}`}
                            className="btn btn-secondary ml-2"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails products={products} addToCart={addToCart} />
            }
          />
        </Routes>

        {/* Footer */}
        <footer className="footer bg-light mt-5">
          <div className="container">
            <p className="text-muted text-center">
              &copy; 2023 eShop. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
