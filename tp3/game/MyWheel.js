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
            let geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);

            const textureLoader = new THREE.TextureLoader();
            this.trackTexture = textureLoader.load('./textures/track.png');
            let material = new THREE.MeshBasicMaterial({ map: this.trackTexture });

            let cylinder = new THREE.Mesh(geometry, material);
            if (i % 2 == 0) {
                cylinder.position.x = 2.5;
            } else {
                cylinder.position.x = -2.5;
            }
            if (i < 2) {
                cylinder.position.z = 7;
            } else {
                cylinder.position.z = 0;
            }
            cylinder.position.y = 0.5;
            cylinder.rotateZ(Math.PI / 2);
            groupTires.add(cylinder);
        }
        this.add(groupTires);

        // Save the wheels group reference for animation
        this.wheelsGroup = groupTires;

        return this;
    }

}

export { MyWheel };
