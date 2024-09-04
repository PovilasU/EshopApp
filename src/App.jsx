import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a className="navbar-brand" href="#">
          eShop
        </a>
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
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Cart
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <h1 className="text-center">Featured Products</h1>
        <div className="row">
          <div className="col-md-4 product-card">
            <div className="card">
              <img
                src="https://via.placeholder.com/150"
                className="card-img-top"
                alt="Product 1"
              />
              <div className="card-body">
                <h5 className="card-title">Product 1</h5>
                <p className="card-text">$10.00</p>
                <a href="#" className="btn btn-primary">
                  Add to Cart
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 product-card">
            <div className="card">
              <img
                src="https://via.placeholder.com/150"
                className="card-img-top"
                alt="Product 2"
              />
              <div className="card-body">
                <h5 className="card-title">Product 2</h5>
                <p className="card-text">$20.00</p>
                <a href="#" className="btn btn-primary">
                  Add to Cart
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 product-card">
            <div className="card">
              <img
                src="https://via.placeholder.com/150"
                className="card-img-top"
                alt="Product 3"
              />
              <div className="card-body">
                <h5 className="card-title">Product 3</h5>
                <p className="card-text">$30.00</p>
                <a href="#" className="btn btn-primary">
                  Add to Cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-light mt-5">
        <div className="container">
          <p className="text-muted text-center">
            &copy; 2023 eShop. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
