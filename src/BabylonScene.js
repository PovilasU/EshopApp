import * as BABYLON from "babylonjs";

export const createScene = (canvas, engine, length, width, height) => {
  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 4.5), scene);
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(5, 10, 0), scene);

  // Helper functions
  const corner = (x, y) => new BABYLON.Vector3(x, 0, y);
  const wall = function(corner) { this.corner = corner; };

  const buildFromPlan = function(walls, ply, height, scene) {
    const outerData = [];
    let angle = 0;
    let direction = 0;
    let line = BABYLON.Vector3.Zero();
    walls[1].corner.subtractToRef(walls[0].corner, line);
    let nextLine = BABYLON.Vector3.Zero();
    walls[2].corner.subtractToRef(walls[1].corner, nextLine);
    const nbWalls = walls.length;
    for (let w = 0; w <= nbWalls; w++) {
      angle = Math.acos(BABYLON.Vector3.Dot(line, nextLine) / (line.length() * nextLine.length()));
      direction = BABYLON.Vector3.Cross(nextLine, line).normalize().y;
      const lineNormal = new BABYLON.Vector3(line.z, 0, -1 * line.x).normalize();
      line.normalize();
      outerData[(w + 1) % nbWalls] = walls[(w + 1) % nbWalls].corner.add(lineNormal.scale(ply)).add(line.scale(direction * ply / Math.tan(angle / 2)));
      line = nextLine.clone();
      walls[(w + 3) % nbWalls].corner.subtractToRef(walls[(w + 2) % nbWalls].corner, nextLine);
    }

    const positions = [];
    const indices = [];

    for (let w = 0; w < nbWalls; w++) {
      positions.push(walls[w].corner.x, walls[w].corner.y, walls[w].corner.z); // inner corners base
    }

    for (let w = 0; w < nbWalls; w++) {
      positions.push(outerData[w].x, outerData[w].y, outerData[w].z); // outer corners base
    }

    for (let w = 0; w < nbWalls; w++) {
      indices.push(w, (w + 1) % nbWalls, nbWalls + (w + 1) % nbWalls, w, nbWalls + (w + 1) % nbWalls, w + nbWalls); // base indices
    }

    let currentLength = positions.length; // inner and outer top corners
    for (let w = 0; w < currentLength / 3; w++) {
      positions.push(positions[3 * w]);
      positions.push(height);
      positions.push(positions[3 * w + 2]);
    }

    currentLength = indices.length;
    for (let i = 0; i < currentLength / 3; i++) {
      indices.push(indices[3 * i + 2] + 2 * nbWalls, indices[3 * i + 1] + 2 * nbWalls, indices[3 * i] + 2 * nbWalls); // top indices
    }

    for (let w = 0; w < nbWalls; w++) {
      indices.push(w, w + 2 * nbWalls, (w + 1) % nbWalls + 2 * nbWalls, w, (w + 1) % nbWalls + 2 * nbWalls, (w + 1) % nbWalls); // inner wall indices
      indices.push((w + 1) % nbWalls + 3 * nbWalls, w + 3 * nbWalls, w + nbWalls, (w + 1) % nbWalls + nbWalls, (w + 1) % nbWalls + 3 * nbWalls, w + nbWalls); // outer wall indices
    }

    const normals = [];
    const uvs = [];

    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    BABYLON.VertexData._ComputeSides(BABYLON.Mesh.FRONTSIDE, positions, indices, normals, uvs);

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

    // Apply brick texture to the custom mesh
    const brickMaterial = new BABYLON.StandardMaterial("brickMat", scene);
    brickMaterial.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/88fOIk3.jpg", scene); // Brick texture
    customMesh.material = brickMaterial;

    return customMesh;
  };

  const baseData = [-length / 1000, 0, length / 1000, 0, length / 1000, width / 1000, 2, width / 1000, 2, height / 1000, -length / 1000, height / 1000];

  const corners = [];
  for (let b = 0; b < baseData.length / 2; b++) {
    corners.push(corner(baseData[2 * b], baseData[2 * b + 1]));
  }

  const walls = [];
  for (let c = 0; c < corners.length; c++) {
    walls.push(new wall(corners[c]));
  }

  const ply = 0.3;

  const build = buildFromPlan(walls, ply, height / 1000, scene);

  return scene;
};