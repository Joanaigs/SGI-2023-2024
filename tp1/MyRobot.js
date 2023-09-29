import * as THREE from 'three';


/**
 * This class contains a Table representation
 */
export class MyRobot extends THREE.Object3D {
    constructor(app,color, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;

        // Material for the table
        const materialRobot = new THREE.MeshBasicMaterial({ color: this.color });
        this.createRobotHead();
        this.createRobotBody();
        this.createRobotLegs();
    }

    createRobotHead(){
        // head
        const cylinder = new THREE.CylinderGeometry(0.6, 0.6,1, 32, 1, false);
        const halfCylinder = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        halfCylinder.position.set(this.position.x + 10, this.position.y + 5, this.position.z);
        this.add(halfCylinder);
        const sphere = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI);
        const halfSphere= new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        halfSphere.position.set(halfCylinder.position.x, halfCylinder.position.y + 0.5, halfCylinder.position.z);
        halfSphere.rotateX(-Math.PI / 2);
        this.add(halfSphere);

        // neck
        const cylinder2 =  new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32, 1, false);
        const topNeck =  new THREE.Mesh(cylinder2, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        topNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.01, halfSphere.position.z);
        this.add(topNeck); 
        const bottomNeck =  new THREE.Mesh(cylinder2, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        bottomNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.3, halfSphere.position.z);
        this.add(bottomNeck); 

        const cylinder3 =  new THREE.CylinderGeometry(0.07, 0.07, 0.5, 32, 1, false);
        const middleNeck =  new THREE.Mesh(cylinder3, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        middleNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.05, halfSphere.position.z);
        this.add(middleNeck);
    }

    createRobotBody(){
        const cylinder = new THREE.CylinderGeometry(0.6, 0.6,0.9, 32, 1, false);
        const chest = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        chest.position.set(this.position.x + 10, this.position.y + 3.7, this.position.z);
        this.add(chest);

        const cylinder2 = new THREE.CylinderGeometry(0.4, 0.4,0.5, 32, 1, false);
        const abdomen = new THREE.Mesh(cylinder2, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        abdomen.position.set(chest.position.x , chest.position.y - 0.6, chest.position.z);
        this.add(abdomen);
        
        // hips
        const boxWidth = 1; // Set the width of the box
        const boxHeight = 0.2; // Set the height of the box
        const boxDepth = 0.4; // Set the depth of the box

        const hipsGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const hips = new THREE.Mesh(hipsGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        hips.position.set(abdomen.position.x, abdomen.position.y - 0.3, abdomen.position.z);
        this.add(hips);

    }

    
}

MyRobot.prototype.isGroup = true;
