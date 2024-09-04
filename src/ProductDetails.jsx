import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );

    const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

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
    </div>
  );
}

export default ProductDetails;
