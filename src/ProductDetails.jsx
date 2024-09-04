import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { createScene } from "./BabylonScene";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const canvasRef = useRef(null);
  const [length, setLength] = useState(5000); // Default length in mm
  const [width, setWidth] = useState(3000); // Default width in mm
  const [height, setHeight] = useState(5000); // Default height in mm

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const scene = createScene(canvas, engine, length, width, height);

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, [length, width, height]);

  const handleUpdate = () => {
    setLength(parseFloat(document.getElementById("length").value));
    setWidth(parseFloat(document.getElementById("width").value));
    setHeight(parseFloat(document.getElementById("height").value));
  };

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
          <label htmlFor="length">Length (mm):</label>
          <input
            type="number"
            id="length"
            className="form-control"
            defaultValue={length}
            onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="width">Width (mm):</label>
          <input
            type="number"
            id="width"
            className="form-control"
            defaultValue={width}
            onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="height">Height (mm):</label>
          <input
            type="number"
            id="height"
            className="form-control"
            defaultValue={height}
            onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-12">
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Dimensions
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
