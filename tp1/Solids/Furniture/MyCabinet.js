import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a Cabinet representation, it can build a bookshelf or a cabinet base
 */
class MyCabinet extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app  the application object
     * @param {number} length the length of the cabinet
     * @param {number} width the width of the cabinet
     * @param {number} height the height of the cabinet
     * @param {hex} colorBase the color of the base of the cabinet
     * @param {list} position the position of the cabinet
     * @param {boolean} bookshelf if the cabinet is a bookshelf or not
     * @param {number} numShelves the number of shelves of the bookshelf
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

        this.thinTexture =new THREE.TextureLoader().load("Textures/top.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 25;
        const material = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.thinTexture });

        this.materialTexture =new THREE.TextureLoader().load("Textures/tableLegs.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 25;
        const secondaryMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });

        //Cabinet base
        if (this.bookshelf)
            this.createBookShelf(this.length, this.width, this.height, position, material, secondaryMaterial, numShelves);
        else 
            this.createCabinetBase(this.length, this.width, this.height, position, material, secondaryMaterial);
        
    }

    /**
     * Builds the cabinet base
     * @param {number} length 
     * @param {number} width 
     * @param {number} height 
     * @param {list} position 
     * @param {MeshPhongMaterial} material 
     * @param {MeshPhongMaterial} secondaryMaterial 
     */
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

    /**
     * Builds the bookshelf
     * @param {number} length 
     * @param {number} width 
     * @param {number} height 
     * @param {list} position 
     * @param {MeshPhongMaterial} material 
     * @param {MeshPhongMaterial} secondaryMaterial 
     */
    createBookShelf(length, width, height, position, material, secondaryMaterial){

        // Compact side (left side)
        const compactGeometry = new THREE.BoxGeometry(length / 2, height, width);
        const compactCabinet = new THREE.Mesh(compactGeometry, secondaryMaterial);
        compactCabinet.position.set(position[0] - length / 4, position[1] + height / 2, position[2]);
        this.add(compactCabinet);
    
        // Shelves side (right side)

        const shelfWidth = this.width;
        // wall part
        const wallPartGeometry = new THREE.BoxGeometry(length / 2, height, width - width + 0.1);
        const wallPartCabinet = new THREE.Mesh(wallPartGeometry, material);
        wallPartCabinet.position.set(position[0] + length / 4, position[1] + height / 2, position[2] - width/2);
        this.add(wallPartCabinet);

        //right 
        const rightGeometry = new THREE.BoxGeometry(0.3, height, width - width + 0.3);
        const rightLayer = new THREE.Mesh(rightGeometry, material);
        rightLayer.position.set(position[0] + length / 4 + length / 4, position[1] + height / 2, position[2] - width / 4 + 0.3);
        rightLayer.rotateY(-Math.PI / 2);
        this.add(rightLayer);


        // Shelves
        const shelfHeight =  (height/4) / (this.numShelves) ; 
        console.log(shelfHeight, height);
        const shelfSpacing = (height-shelfHeight) / (this.numShelves-1); // Evenly spaced shelves

        for (let i = 0; i < this.numShelves ; i++) {          
            const shelfGeometry = new THREE.BoxGeometry(length / 2, shelfHeight, shelfWidth);
            const shelf = new THREE.Mesh(shelfGeometry, material);
            shelf.position.set(position[0] + length / 4, position[1] + i*shelfSpacing + shelfHeight/2, position[2]  ); // Adjusted position
            this.add(shelf);
        }
    

    }
}
MyCabinet.prototype.isGroup = true;
export { MyCabinet };