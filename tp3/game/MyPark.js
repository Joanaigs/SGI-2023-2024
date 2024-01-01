import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyPark extends THREE.Object3D {

    constructor() {
        super();
        this.groupBody = new THREE.Group();
    }

    buildPlayerPark() {
        // walls
        let wallGeometry = new THREE.BoxGeometry(40, 30, 40);
        let wallMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.walls = new THREE.Mesh(wallGeometry, wallMaterial);
        this.walls.position.set(-2500, 138, -2500);
    
        let windowGeometry = new THREE.PlaneGeometry(12, 12); // Adjust dimensions as needed
        let windowMaterial = new THREE.MeshBasicMaterial({ color: 0x82F3F7, side: THREE.DoubleSide }); // Adjust color as needed
        let window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(-2509, 138, -2520.2);

        // Parapet
        let parapetGeometry = new THREE.BoxGeometry(12.5, 1, 3); // Adjust dimensions as needed
        let parapetMaterial = new THREE.MeshBasicMaterial({ color: 0xEC5DBD });
        let parapet = new THREE.Mesh(parapetGeometry, parapetMaterial);
        parapet.position.set(-2509, 132, -2520.5);


        let upperParapetGeometry = new THREE.BoxGeometry(12.5, 0.5, 0.5); // Adjust dimensions as needed
        let upperParapetMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let upperParapet = new THREE.Mesh(upperParapetGeometry, upperParapetMaterial);
        upperParapet.position.set(-2509, 144, -2520.5);

        let rectangleGeometry = new THREE.PlaneGeometry(12.5, 9);
        let rectangleTexture = new THREE.TextureLoader().load('./textures/stripes.png');
        let rectangleMaterial = new THREE.MeshBasicMaterial({ map: rectangleTexture, side: THREE.DoubleSide });
        let rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        rectangle.position.set(-2509, 143.5, -2520.5);
        rectangle.rotation.x = Math.PI / 4; // Rotação de 30 graus (em radianos)
        
        // Foundation
        let baseGeometry = new THREE.BoxGeometry(41, 4, 41);
        let baseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.base.position.set(-2500, 122, -2500);

        // Ceilling
        this.ceiling = new THREE.Mesh(baseGeometry, baseMaterial);
        this.ceiling.position.set(-2500, 153, -2500);

        // Donut on top
        let donutGeometry = new THREE.TorusGeometry(10, 4, 64, 100); // Adjust parameters as needed
        let donutMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        let donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.set(-2509, 149, -2520.5);

        let donutGeometry2 = new THREE.TorusGeometry(10, 4, 64, 100); // Adjust parameters as needed
        let donutMaterial2 = new THREE.MeshBasicMaterial({ color: 0xEC5DBD });
        let donut2 = new THREE.Mesh(donutGeometry2, donutMaterial2);
        donut2.position.set(-2509, 149, -2522.5);

        // shopName
        let shopNameGeometry = new THREE.BoxGeometry(37, 10, 4);
        let shopNameMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.shopName = new THREE.Mesh(shopNameGeometry, shopNameMaterial);
        this.shopName.position.set(-2500, 160, -2515.5);

        let shopNameLogoGeometry = new THREE.PlaneGeometry(34, 8);
        let shopNameLogoTexture = new THREE.TextureLoader().load('./textures/donut.png'); // new THREE.MeshBasicMaterial({ color: 0xFFC0CB, side: THREE.DoubleSide });
        let shopNameLogoMaterial = new THREE.MeshBasicMaterial({ map: shopNameLogoTexture, side: THREE.DoubleSide});
        this.shopNameLogo = new THREE.Mesh(shopNameLogoGeometry, shopNameLogoMaterial);
        this.shopNameLogo.position.set(-2500, 160, -2518); // Adjust the position as need

        let doorGeometry = new THREE.PlaneGeometry(4, 10); // Adjust dimensions as needed
        let doorMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.DoubleSide }); // Brown color for the door
        let door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(-2500
            .toExponential, 138, -2520.2);

        this.groupDonut = new THREE.Group();
        this.groupDonut.add(donut, donut2);
        this.groupDonut.translateY(18);
        this.groupDonut.translateZ(19);
        this.groupDonut.translateX(7);
    
        this.groupBody.add(this.walls);
        this.groupBody.add(window); 
        this.groupBody.add(parapet);
        this.groupBody.add(upperParapet);
        this.groupBody.add(rectangle);
        this.groupBody.add(this.ceiling);
        this.groupBody.add(this.base);
        this.groupBody.add(this.groupDonut);
        this.groupBody.add(this.shopName);
        this.groupBody.add(this.shopNameLogo);
        
        this.groupBody.translateY(10);
        return this.groupBody;
    }
    
    
    


}

export { MyPark };