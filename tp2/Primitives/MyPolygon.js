import * as THREE from 'three';

class MyPolygon extends THREE.Group {
  constructor(primitiveData) {
    super();

    this.radius = primitiveData.radius;
    this.stacks = primitiveData.stacks;
    this.slices = primitiveData.slices;
    this.color_c = primitiveData.color_c;
    this.color_p =primitiveData.color_p;

    this.createPolygon();
  }

  createPolygon() {
    this.geometry = new THREE.BufferGeometry();
    const vertices = [];
    const normals = [];
    const colors = [];
    const part = this.radius/this.stacks;

    // Calculate vertices and colors
    for (let i = 0; i < this.stacks; i++) {
      for (let j = 0; j < this.slices; j++) {
        const theta1 = (i / this.stacks) * Math.PI;
        const phi1 = (j / this.slices) * 2 * Math.PI;
    
        const theta2 = ((i + 1) / this.stacks) * Math.PI;
        const phi2 = ((j + 1) / this.slices) * 2 * Math.PI;
    
        const x1 = (part*i) * Math.sin(theta1) * Math.cos(phi1);
        const y1 = (part*i) * Math.sin(theta1) * Math.sin(phi1);
        const z1 = 0;
    
        const x2 = (part*i) * Math.sin(theta1) * Math.cos(phi2);
        const y2 = (part*i) * Math.sin(theta1) * Math.sin(phi2);
        const z2 = 0;
    
        const x3 = (part*i) * Math.sin(theta2) * Math.cos(phi1);
        const y3 = (part*i) * Math.sin(theta2) * Math.sin(phi1);
        const z3 = 0;
    
        const normal1 = new THREE.Vector3(x1, y1, z1).normalize();
        const normal2 = new THREE.Vector3(x2, y2, z2).normalize();
        const normal3 = new THREE.Vector3(x3, y3, z3).normalize();
    
        vertices.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
        normals.push(normal1.x, normal1.y, normal1.z, normal2.x, normal2.y, normal2.z, normal3.x, normal3.y, normal3.z);
    
        // Interpolate color radially from center to periphery
        const radialInterpolation = Math.sqrt(x1**2 + y1**2) / (part*i);
        const color1 = new THREE.Color().lerpColors(this.color_c, this.color_p, radialInterpolation);
    
        // Repeat the same for color2 and color3
        const radialInterpolation2 = Math.sqrt(x2**2 + y2**2) / (part*i);
        const color2 = new THREE.Color().lerpColors(this.color_c, this.color_p, radialInterpolation2);
    
        const radialInterpolation3 = Math.sqrt(x3**2 + y3**2) / (part*i);
        const color3 = new THREE.Color().lerpColors(this.color_c, this.color_p, radialInterpolation3);
    
        colors.push(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b, color3.r, color3.g, color3.b);
      }
    }
    console.log(vertices);
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  }

  // createPolygon() {
  //   this.geometry = new THREE.BufferGeometry();
  //   const vertices = [];
  //   const verticesTemp = [];
  //   const normals = [];
  //   const colors = [];
  //   const indices = [];
  //   const part = this.radius/this.stacks;

  //   // Calculate vertices and colors
  //   for (let i = 0; i < this.stacks; i++) {
  //     const theta = (i / this.stacks) * Math.PI;
  //     for (let j = 0; j < this.slices; j++) {
  //       const phi = (j / this.slices) * 2 * Math.PI;

  //       const x = (i*part) * Math.sin(theta) * Math.cos(phi);
  //       const y = (i*part) * Math.sin(theta) * Math.sin(phi);
  //       const z = 0;

  //       const normal1 = new THREE.Vector3(x, y, z).normalize();

  //       verticesTemp.push(x, y, z);
  //       normals.push(normal1.x, normal1.y, normal1.z);

  //       if(i < this.stacks && j < this.slices){
  //         const first = i * this.slices + j;
  //         const second = i * this.slices + j + 1;
  //         const third = (i + 1) * this.slices + j;
  //         const fourth = (i + 1) * this.slices + j + 1;

  //         indices.push(first, second, third);
  //         indices.push(second, fourth, third);
  //       }
  //      }
  //   }

  //   //create vertex list from the indices
  //   for(let i = 0; i < indices.length; i++){
  //     const index = indices[i];
  //     vertices.push(verticesTemp[index * 3], verticesTemp[index * 3 + 1], verticesTemp[index * 3 + 2]);
  //     let n_stack = Math.floor((index) / (this.slices));
  //     console.log(n_stack, index);
  //     const stackInterpolation = n_stack / this.stacks;
  //     const interpolatedColor = new THREE.Color().lerpColors(this.color_c, this.color_p, stackInterpolation);
  //     colors.push(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b);
  //   }



  //   console.log(vertices);
  //   this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  //   this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  //   this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  // }

  addMaterial(material1, castshadow, receiveshadows){
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      vertexColors: true, // Use THREE.VertexColors enum value
      transparent: false
  });
    let object = new THREE.Mesh(this.geometry, material);
    if(castshadow){
      object.castShadow = true;
    }
    if(receiveshadows){
      object.receiveShadow = true;
    }
    return object

  }
}

export { MyPolygon };