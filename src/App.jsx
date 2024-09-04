import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const products = [
    {
      id: 1,
      name: "Product 1",
      price: 10.0,
      description: "Description of Product 1",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      id: 2,
      name: "Product 2",
      price: 20.0,
      description: "Description of Product 2",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
    {
      id: 3,
      name: "Product 3",
      price: 30.0,
      description: "Description of Product 3",
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
    },
  ];

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
              <button className="btn btn-link nav-link" onClick={toggleCart}>
                Cart ({cartItems.length})
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
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
                  <p className="card-text">${product.price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-secondary ml-2"
                    onClick={() => viewProductDetails(product)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {/* Cart Modal */}
      {cartVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cart</h5>
                <button
                  type="button"
                  className="close"
                  onClick={toggleCart}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul className="list-group">
                    {cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {item.name}
                        <span>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleCart}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProduct.name}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeProductModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={selectedProduct.images[0]}
                      className="img-fluid"
                      alt={selectedProduct.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5>Description</h5>
                    <p>{selectedProduct.description}</p>
                    <h5>Price</h5>
                    <p>${selectedProduct.price.toFixed(2)}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  {selectedProduct.images.slice(1).map((image, index) => (
                    <div key={index} className="col-md-4">
                      <img
                        src={image}
                        className="img-fluid"
                        alt={`${selectedProduct.name} ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeProductModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
