import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyCheckpoints {


    constructor(app, scale, position, width) {
        this.app = app;
        this.width = width;
        this.checkpoint1 = [
            new THREE.Vector3(8 * scale + position.x, 0, 5.5 * scale + position.z),//start
            new THREE.Vector3(8 * scale + position.x, 0, 8 * scale + position.z),
            new THREE.Vector3(7* scale + position.x, 0, 13.5* scale + position.z),
            new THREE.Vector3(1.5* scale + position.x, 0, 16* scale + position.x),
            new THREE.Vector3(-0.6* scale + position.x, 0, 10* scale + position.x),
            new THREE.Vector3(2* scale + position.x, 0, 5.3* scale + position.x),
            new THREE.Vector3(5* scale + position.x, 0, 4.5* scale + position.x),
            new THREE.Vector3(3* scale + position.x, 0, 2.8* scale + position.x),
            new THREE.Vector3(0* scale + position.x, 0, 0* scale + position.x),
            new THREE.Vector3(6* scale + position.x, 0, 1* scale + position.x),
            new THREE.Vector3(8* scale + position.x, 0, 2* scale + position.x),

        ]
        this.checkpoint1Rotation = [
            0,
            0,
            Math.PI / 2,
            Math.PI / 2,
            0,
            Math.PI / 2, 
            0,
            Math.PI / 2,
            -Math.PI / 4,
            Math.PI / 2,
            Math.PI / 4,
        ];
        this.checkpointObjcts=[];
    }

    drawCheckpoints() {
        for (let i = 0; i < this.checkpoint1.length; i++) {
            const geometry = new THREE.BoxGeometry(this.width+20, this.width, 20);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(this.checkpoint1[i].x, this.checkpoint1[i].y+this.width/2, this.checkpoint1[i].z);
            plane.rotation.y = this.checkpoint1Rotation[i];
            plane.visible = false;
            this.app.scene.add(plane);
            this.checkpointObjcts.push(plane);
            
        }
    }

    getCheckpoints() {
        return this.checkpointObjcts;
    }

    

    
}

export { MyCheckpoints };