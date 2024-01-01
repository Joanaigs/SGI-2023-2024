import * as THREE from 'three';

class MyWheel extends THREE.Object3D {
    constructor() {
        super();
        this.rotationSpeed = 0; // Added rotationSpeed property
        this.clock = new THREE.Clock();
    }

    build() {
        let groupTires = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            let geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);

            const textureLoader = new THREE.TextureLoader();
            this.trackTexture = textureLoader.load('./textures/track.png');
            let material = new THREE.MeshBasicMaterial({ map:this.trackTexture});

            let cylinder = new THREE.Mesh(geometry, material);
            if (i % 2 == 0) {
                cylinder.position.x = 3.0;
            } else {
                cylinder.position.x = -3.0;
            }
            if (i < 2) {
                cylinder.position.z = 4.2;
            } else {
                cylinder.position.z = -4.1;
            }
            cylinder.position.y = 0.9;
            cylinder.rotateZ(Math.PI / 2);
            cylinder.rotation.order = "YXZ";
            groupTires.add(cylinder);
        }
        this.add(groupTires);

        // Save the wheels group reference for animation
        this.wheelsGroup = groupTires;

        return this;
    }


    buildTruckWheels() {
        let groupTires = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            let geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32);

            const textureLoader = new THREE.TextureLoader();
            this.trackTexture = textureLoader.load('./textures/track.png');
            let material = new THREE.MeshBasicMaterial({ map:this.trackTexture});

            let cylinder = new THREE.Mesh(geometry, material);
            if (i % 2 == 0) {
                cylinder.position.x = 3.0;
            } else {
                cylinder.position.x = -3.0;
            }
            if (i < 2) {
                cylinder.position.z = 4.2;
            } else {
                cylinder.position.z = -4.1;
            }
            cylinder.position.y = 0.9;
            cylinder.rotateZ(Math.PI / 2);
            cylinder.rotation.order = "YXZ";
            groupTires.add(cylinder);
        }
        this.add(groupTires);

        // Save the wheels group reference for animation
        this.wheelsGroup = groupTires;

        return this;
    }

}

export { MyWheel };
