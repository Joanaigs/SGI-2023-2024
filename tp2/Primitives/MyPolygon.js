import * as THREE from 'three';

class MyPolygon extends THREE.Group {
  constructor(primitiveData) {
    super();

    this.radius = primitiveData.radius;
    this.stacks = primitiveData.stacks;
    this.slices = primitiveData.slices;
    this.color_c = primitiveData.color_c;
    this.color_p = primitiveData.color_p;

    this.createPolygon();
  }

  createPolygon() {
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

    console.log(vertices);
    this.geometry.setIndex(indices);
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  }

  addMaterial(material1, castshadow, receiveshadows) {
    material1.vertexColors = true;
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