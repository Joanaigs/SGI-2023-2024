import * as THREE from 'three';

class MyPolygon extends THREE.Group {
  /**
   * The constructor of the class that receives the data of the primitive
   * @param {Dictionary} primitiveData the data of the primitive
   */
  constructor(primitiveData) {
    super();

    this.radius = primitiveData.radius;
    this.stacks = primitiveData.stacks;
    this.slices = primitiveData.slices;
    this.color_c = primitiveData.color_c;
    this.color_p = primitiveData.color_p;

    this.createPolygon();
  }

  /**
   * Creates the polygon
   */
  createPolygon() {

    // function to interpolate between two values
    const interpolate = (startValue, endValue, percentage) =>
      startValue + percentage * (endValue - startValue);
    const interpolateColor = (startColor, endColor, percentage) => [
      interpolate(startColor.r, endColor.r, percentage),
      interpolate(startColor.g, endColor.g, percentage),
      interpolate(startColor.b, endColor.b, percentage),
    ];

    this.geometry = new THREE.BufferGeometry();
    const vertices = [0, 0, 0];
    const normals = [0, 0, 1];
    const colors = [this.color_c.r, this.color_c.g, this.color_c.b];
    const indices = [];
    const uv = [0.5, 0.5];
    const part = this.radius / this.stacks;
    const uvCenterU = 0.5;
    const uvCenterV = 0.5;
    const uvRadius = 0.5;

    let stackPercentage = 1 / this.stacks;
    let stackColor = interpolateColor(this.color_c, this.color_p, stackPercentage);

    // create the first stack by using the the vertex (0,0,0) in all triangles
    for (let currentSlice = 0; currentSlice < this.slices; currentSlice++) {
      const angle = (currentSlice / this.slices) * (2 * Math.PI);
      const x = part * Math.cos(angle);
      const y = part * Math.sin(angle);
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
      const currentSliceIdx = 1 + currentSlice % this.slices;
      const nextSliceIdx = 1 + (currentSlice + 1) % this.slices;
      indices.push(0, currentSliceIdx, nextSliceIdx);
      colors.push(...stackColor);
      uv.push(
        uvCenterU + uvRadius * stackPercentage * Math.cos(angle),
        uvCenterV + uvRadius * stackPercentage * Math.sin(angle)
      );
    }

    // create the remaining stacks by using the previous stack points
    for (let i = 1; i < this.stacks; i++) {
      const currentRadius = (i + 1) * part;
      stackPercentage = (1 + i) / this.stacks;
      let stackColor = interpolateColor(this.color_c, this.color_p, stackPercentage);
      for (let j = 0; j < this.slices; j++) {
        const angle = (j / this.slices) * (2 * Math.PI);
        const x = currentRadius * Math.cos(angle);
        const y = currentRadius * Math.sin(angle);
        vertices.push(x, y, 0);
        normals.push(0, 0, 1);
        colors.push(...stackColor);

        const currentSlicePreviousStackIdx =
          1 + (i - 1) * this.slices + j % this.slices;
        const nextSlicePreviousStackIdx =
          1 + (i - 1) * this.slices + (j + 1) % this.slices;

        const currentSliceIdx = 1 + i * this.slices + j % this.slices;
        const nextSliceIdx = 1 + i * this.slices + (j + 1) % this.slices;

        indices.push(
          currentSliceIdx,
          nextSliceIdx,
          nextSlicePreviousStackIdx
        );
        indices.push(
          currentSliceIdx,
          nextSlicePreviousStackIdx,
          currentSlicePreviousStackIdx
        );
        uv.push(
          uvCenterU + uvRadius * stackPercentage * Math.cos(angle),
          uvCenterV + uvRadius * stackPercentage * Math.sin(angle)
        );
      }
    }

    this.geometry.setIndex(indices);
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  }

  /**
   * Adds the material to the polygon and returns the object
   * @param {MyMaterial} material the material of the polygon
   * @param {boolean} castshadow if the polygon casts shadow or not
   * @param {boolean} receiveshadows if the polygon receives shadow or not
   * @returns the object with the material
   */
  addMaterial(material1, castshadow, receiveshadows) {
    material1.vertexColors = true;
    if(material1.type !== "ShaderMaterial")
      material1.setRepeat(this.radius, this.radius);
    let object = new THREE.Mesh(this.geometry, material1);
    if (castshadow) {
      object.castShadow = true;
    }
    if (receiveshadows) {
      object.receiveShadow = true;
    }
    return object

  }
}

export { MyPolygon };