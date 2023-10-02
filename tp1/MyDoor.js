import * as THREE from 'three';

/**
 * This class contains a Door representation
 */
class MyDoor extends THREE.Object3D {

    constructor(app, width, lenght, height , color, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;
        this.width = width;
        this.lenght = lenght;
        this.height = height;
        this.color = color;
        this.position.set(position[0], position[1], position[2]);


        const materialDoor = new THREE.MeshBasicMaterial( {color: color} );
        const materialDoor2 = new THREE.MeshBasicMaterial( {color: 0xffffff} );

        const geometry = new THREE.BoxGeometry( this.lenght, this.height, this.width);
        let door = new THREE.Mesh(geometry, materialDoor);
        door.position.set(position[0],position[1] + this.width + 1 ,position[2]);
        door.rotateZ(-Math.PI/2);
        this.add(door);   
        
        const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.2, 0.2, 32); // Adjust size and segments
        const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Set cylinder color
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.rotateZ(Math.PI/2);
        cylinderMesh.position.set(position[0] - 0.5, position[1] + this.lenght/2, position[2] - this.width/2 + this.width/7);
        this.add(cylinderMesh);
    }
}
MyDoor.prototype.isGroup = true;
export { MyDoor };