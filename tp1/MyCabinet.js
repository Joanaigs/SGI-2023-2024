import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Cabinet representation
 */
class MyCabinet extends THREE.Object3D {

    /**
     * 
     *
     */
    constructor(app, length, width, height, colorBase,  position, bookshelf, numShelves) {
        super();
        this.app = app;
        this.length = length;
        this.width = width;
        this.height = height;
        this.colorBase = colorBase;
        this.bookshelf = bookshelf;
        this.numShelves = numShelves + 2;
        console.log(this.numShelves);

        const material = new THREE.MeshBasicMaterial( {color: colorBase} );
        const secondaryMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );

        //Cabinet base
        if (this.bookshelf)
            this.createBookShelf(this.length, this.width, this.height, position, material, secondaryMaterial, numShelves);
        else 
            this.createCabinetBase(this.length, this.width, this.height, position, material, secondaryMaterial);
        
    }

    createCabinetBase(length, width, height, position, material, secondaryMaterial){
        const geometryBase = new THREE.BoxGeometry( length, height, width);
        let cabinetBase = new THREE.Mesh(geometryBase, material);
        cabinetBase.position.set(position[0], position[1]+height/2, position[2]);
        this.add(cabinetBase);

        const geometryThinLayer = new THREE.BoxGeometry( length+0.1, 0.2, width + 0.1);
        let thinLayer = new THREE.Mesh(geometryThinLayer, secondaryMaterial);
        thinLayer.position.set(position[0], position[1]+height/2, position[2]);
        this.add(thinLayer);

        let thinTopLayer = new THREE.Mesh(geometryThinLayer, secondaryMaterial);
        thinTopLayer.position.set(position[0], position[1]+height, position[2]);
        this.add(thinTopLayer);
    }

    createBookShelf(length, width, height, position, material, secondaryMaterial){

        // Compact side (left side)
        const compactGeometry = new THREE.BoxGeometry(length / 2, height, width);
        const compactCabinet = new THREE.Mesh(compactGeometry, secondaryMaterial);
        compactCabinet.position.set(position[0] - length / 4, position[1] + height / 2, position[2]);
        this.add(compactCabinet);
    
        // Shelves side (right side)

        // wall part
        const wallPartGeometry = new THREE.BoxGeometry(length / 2, height, width - width + 0.1);
        const wallPartCabinet = new THREE.Mesh(wallPartGeometry, secondaryMaterial);
        wallPartCabinet.position.set(position[0] + length / 4, position[1] + height / 2, position[2] - width/2);
        this.add(wallPartCabinet);

        //right 
        const rightGeometry = new THREE.BoxGeometry(0.3, height, width - width + 0.3);
        const rightLayer = new THREE.Mesh(rightGeometry, material);
        rightLayer.position.set(position[0] + length / 4 + length / 4, position[1] + height / 2, position[2] - width / 4 + 0.3);
        rightLayer.rotateY(-Math.PI / 2);
        this.add(rightLayer);


        // Shelves
        const shelfSpacing = height / (this.numShelves - 1); // Evenly spaced shelves

        for (let i = 1; i < this.numShelves +1 ; i++) {            
            const shelfGeometry = new THREE.BoxGeometry(length / 2, height / 8 + 0.5, width - width + 0.3);
            const shelf = new THREE.Mesh(shelfGeometry, material);
            shelf.position.set(position[0] + length / 4, position[1] + height / 4 + i*shelfSpacing - 2.4, position[2] - width / 4); // Adjusted position
            shelf.rotateX(-Math.PI / 2);
            this.add(shelf);
        }
    

    }
}
MyCabinet.prototype.isGroup = true;
export { MyCabinet };