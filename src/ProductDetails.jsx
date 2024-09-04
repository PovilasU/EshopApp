import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { createScene } from "./BabylonScene";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const canvasRef = useRef(null);

  const [houseWidth, setHouseWidth] = useState(10000); // in millimeters
  const [houseHeight, setHouseHeight] = useState(5000); // in millimeters
  const [houseDepth, setHouseDepth] = useState(10000); // in millimeters

  const [wellRadius, setWellRadius] = useState(1000); // in millimeters
  const [wellHeight, setWellHeight] = useState(2000); // in millimeters
  const [wellDistance, setWellDistance] = useState(10000); // in millimeters

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    // Convert millimeters to meters
    const houseWidthMeters = houseWidth / 1000;
    const houseHeightMeters = houseHeight / 1000;
    const houseDepthMeters = houseDepth / 1000;
    const wellRadiusMeters = wellRadius / 1000;
    const wellHeightMeters = wellHeight / 1000;
    const wellDistanceMeters = wellDistance / 1000;

    const scene = createScene(
      canvas,
      engine,
      houseWidthMeters,
      houseHeightMeters,
      houseDepthMeters,
      wellRadiusMeters,
      wellHeightMeters,
      wellDistanceMeters
    );

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, [
    houseWidth,
    houseHeight,
    houseDepth,
    wellRadius,
    wellHeight,
    wellDistance,
  ]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images[0]}
            className="img-fluid"
            alt={product.name}
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h3>${product.price.toFixed(2)}</h3>
          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="row mt-3">
        {product.images.slice(1).map((image, index) => (
          <div key={index} className="col-md-4">
            <img
              src={image}
              className="img-fluid"
              alt={`${product.name} ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "400px" }}
          ></canvas>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <label>House Width (mm):</label>
          <input
            type="number"
            value={houseWidth}
            onChange={(e) => setHouseWidth(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label>House Height (mm):</label>
          <input
            type="number"
            value={houseHeight}
            onChange={(e) => setHouseHeight(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label>House Depth (mm):</label>
          <input
            type="number"
            value={houseDepth}
            onChange={(e) => setHouseDepth(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4">
          <label>Well Radius (mm):</label>
          <input
            type="number"
            value={wellRadius}
            onChange={(e) => setWellRadius(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label>Well Height (mm):</label>
          <input
            type="number"
            value={wellHeight}
            onChange={(e) => setWellHeight(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
        <div className="col-md-4">
          <label>Distance from House (mm):</label>
          <input
            type="number"
            value={wellDistance}
            onChange={(e) => setWellDistance(parseFloat(e.target.value))}
            className="form-control"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
