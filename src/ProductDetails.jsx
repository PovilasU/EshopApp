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
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    const createScene = function () {
      const scene = new BABYLON.Scene(engine);

      // Camera
      const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        -Math.PI / 2,
        Math.PI / 3,
        25,
        new BABYLON.Vector3(0, 0, 4.5),
        scene
      );
      camera.attachControl(canvas, true);

      // Light
      const light = new BABYLON.HemisphericLight(
        "hemiLight",
        new BABYLON.Vector3(5, 10, 0),
        scene
      );

      // Helper functions
      const corner = (x, y) => new BABYLON.Vector3(x, 0, y);
      const wall = function (corner) {
        this.corner = corner;
      };

      const buildFromPlan = function (walls, ply, height, scene) {
        const outerData = [];
        let angle = 0;
        let direction = 0;
        let line = BABYLON.Vector3.Zero();
        walls[1].corner.subtractToRef(walls[0].corner, line);
        let nextLine = BABYLON.Vector3.Zero();
        walls[2].corner.subtractToRef(walls[1].corner, nextLine);
        const nbWalls = walls.length;
        for (let w = 0; w <= nbWalls; w++) {
          angle = Math.acos(
            BABYLON.Vector3.Dot(line, nextLine) /
              (line.length() * nextLine.length())
          );
          direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
          const lineNormal = new BABYLON.Vector3(
            line.z,
            0,
            -1 * line.x
          ).normalize();
          line.normalize();
          outerData[(w + 1) % nbWalls] = walls[(w + 1) % nbWalls].corner
            .add(lineNormal.scale(ply))
            .add(line.scale((direction * ply) / Math.tan(angle / 2)));
          line = nextLine.clone();
          walls[(w + 3) % nbWalls].corner.subtractToRef(
            walls[(w + 2) % nbWalls].corner,
            nextLine
          );
        }

        const positions = [];
        const indices = [];

        for (let w = 0; w < nbWalls; w++) {
          positions.push(
            walls[w].corner.x,
            walls[w].corner.y,
            walls[w].corner.z
          ); // inner corners base
        }

        for (let w = 0; w < nbWalls; w++) {
          positions.push(outerData[w].x, outerData[w].y, outerData[w].z); // outer corners base
        }

        for (let w = 0; w < nbWalls; w++) {
          indices.push(
            w,
            (w + 1) % nbWalls,
            nbWalls + ((w + 1) % nbWalls),
            w,
            nbWalls + ((w + 1) % nbWalls),
            w + nbWalls
          ); // base indices
        }

        let currentLength = positions.length; // inner and outer top corners
        for (let w = 0; w < currentLength / 3; w++) {
          positions.push(positions[3 * w]);
          positions.push(height);
          positions.push(positions[3 * w + 2]);
        }

        currentLength = indices.length;
        for (let i = 0; i < currentLength / 3; i++) {
          indices.push(
            indices[3 * i + 2] + 2 * nbWalls,
            indices[3 * i + 1] + 2 * nbWalls,
            indices[3 * i] + 2 * nbWalls
          ); // top indices
        }

        for (let w = 0; w < nbWalls; w++) {
          indices.push(
            w,
            w + 2 * nbWalls,
            ((w + 1) % nbWalls) + 2 * nbWalls,
            w,
            ((w + 1) % nbWalls) + 2 * nbWalls,
            (w + 1) % nbWalls
          ); // inner wall indices
          indices.push(
            ((w + 1) % nbWalls) + 3 * nbWalls,
            w + 3 * nbWalls,
            w + nbWalls,
            ((w + 1) % nbWalls) + nbWalls,
            ((w + 1) % nbWalls) + 3 * nbWalls,
            w + nbWalls
          ); // outer wall indices
        }

        const normals = [];
        const uvs = [];

        BABYLON.VertexData.ComputeNormals(positions, indices, normals);
        BABYLON.VertexData._ComputeSides(
          BABYLON.Mesh.FRONTSIDE,
          positions,
          indices,
          normals,
          uvs
        );

        // Create a custom mesh
        const customMesh = new BABYLON.Mesh("custom", scene);

        // Create a vertexData object
        const vertexData = new BABYLON.VertexData();

        // Assign positions and indices to vertexData
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;

        // Apply vertexData to custom mesh
        vertexData.applyToMesh(customMesh);

        return customMesh;
      };

      const baseData = [-5, 0, 5, 0, 5, 6, 2, 6, 2, 9, -5, 9];

      const corners = [];
      for (let b = 0; b < baseData.length / 2; b++) {
        corners.push(corner(baseData[2 * b], baseData[2 * b + 1]));
      }

      const walls = [];
      for (let c = 0; c < corners.length; c++) {
        walls.push(new wall(corners[c]));
      }

      const ply = 0.3;
      const height = 5;

      const build = buildFromPlan(walls, ply, height, scene);

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
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
