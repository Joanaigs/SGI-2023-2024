import * as THREE from 'three';

/**
 * This class creates a Triangle
 */
class MyTriangle extends THREE.BufferGeometry {

	constructor(x1, y1, z1, x2, y2, z2, x3, y3, z3, material, castshadow, receiveshadows) {
		super();

		this.p1 = new THREE.Vector3(x1, y1, z1)
		this.p2 = new THREE.Vector3(x2, y2, z2)
		this.p3 = new THREE.Vector3(x3, y3, z3)
		this.material = material
		this.castShadow = castshadow
		this.receiveShadow = receiveshadows
		this.initBuffers();
	}

	initBuffers() {

		//CALCULATING NORMALS 
		var vectorAx = this.p2.x - this.p1.x
		var vectorAy = this.p2.y - this.p1.y
		var vectorAz = this.p2.z - this.p1.z

		var vectorBx = this.p3.x - this.p1.x
		var vectorBy = this.p3.y - this.p1.y
		var vectorBz = this.p3.z - this.p1.z

		var crossProductX = vectorAy * vectorBz - vectorBy * vectorAz
		var crossProductY = vectorBx * vectorAz - vectorAx * vectorBz
		var crossProductZ = vectorAx * vectorBy - vectorBx * vectorAy

		var normal = new THREE.Vector3(crossProductX, crossProductY, crossProductZ)
		normal.normalize()

		//TEXTURE COORDINATES
		let a = this.p1.distanceTo(this.p2);
		let b = this.p2.distanceTo(this.p3);
		let c = this.p1.distanceTo(this.p3);


		let cos_ac = (a * a - b * b + c * c) / (2 * a * c)
		let sin_ac = Math.sqrt(1 - cos_ac * cos_ac)

		const vertices = new Float32Array([
			...this.p1.toArray(),	//0
			...this.p2.toArray(),	//1
			...this.p3.toArray(),	//2

		]);

		const indices = [
			0, 1, 2
		];

		const normals = [
			...normal.toArray(),
			...normal.toArray(),
			...normal.toArray(),
		];

		/* 		const uvs = [
					0, 0,
					a , 0,
					c * cos_ac, c * sin_ac
				] */
		let width = a/this.material.texlength_s;
		const uvs = [
			0, 0,
			width, 0,
			(c * cos_ac)/this.material.texlength_t, (c * sin_ac)/this.material.texlength_t
		]

		this.setIndex(indices);
		this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
		this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	}


	addMaterial() {
		let object = new THREE.Mesh(this, this.material);
		if (this.castshadow) {
			object.castShadow = true;
		}
		if (this.receiveshadows) {
			object.receiveShadow = true;
		}
		return object;
	}
}

export { MyTriangle };