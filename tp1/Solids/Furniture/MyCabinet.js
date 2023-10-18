import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a Cabinet representation, it can build a bookshelf or a simple cabinet
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
     * @param {boolean} shadows if the cabinet has shadows or not
     */
    constructor(app, length, width, height, primaryMaterial, secondaryMaterial, position, bookshelf, numShelves, shadows=false) {
        super();
        this.app = app;
        this.length = length;
        this.width = width;
        this.height = height;
        this.material = primaryMaterial;
        this.secondaryMaterial = secondaryMaterial;
        this.bookshelf = bookshelf;
        this.numShelves = numShelves + 2;
        this.shadows = shadows;

        if (this.bookshelf)
            this.createBookShelf(position);
        else 
            this.createCabinetBase(position);
        
    }

    /**
     * Builds the simple cabinet
     * @param {list} position  of the cabinet
     */
    createCabinetBase(position) {
        const geometryBase = new THREE.BoxGeometry(this.length, this.height, this.width);
        let cabinetBase = new THREE.Mesh(geometryBase, this.material);
        if(this.shadows){
            cabinetBase.castShadow = true;
            cabinetBase.receiveShadow = true;
        }
        cabinetBase.position.set(position[0], position[1] + this.height / 2, position[2]);
        this.add(cabinetBase);

        const geometryThinLayer = new THREE.BoxGeometry(this.length + 0.1, 0.2, this.width + 0.1);
        let thinLayer = new THREE.Mesh(geometryThinLayer, this.secondaryMaterial);
        if(this.shadows){
            thinLayer.castShadow = true;
            thinLayer.receiveShadow = true;
        }
        thinLayer.position.set(position[0], position[1] + this.height / 2, position[2]);
        this.add(thinLayer);

        let thinTopLayer = new THREE.Mesh(geometryThinLayer, this.secondaryMaterial);
        if(this.shadows){
            thinTopLayer.castShadow = true;
            thinTopLayer.receiveShadow = true;
        }
        thinTopLayer.position.set(position[0], position[1] + this.height, position[2]);
        this.add(thinTopLayer);
    }

    /**
     * Builds the bookshelf
     * @param {list} position of the cabinet
     */
    createBookShelf(position) {
        const compactGeometry = new THREE.BoxGeometry(this.length / 2, this.height, this.width);
        const compactCabinet = new THREE.Mesh(compactGeometry, this.secondaryMaterial);
        compactCabinet.position.set(position[0] - this.length / 4, position[1] + this.height / 2, position[2]);
        if(this.shadows){
            compactCabinet.castShadow = true;
            compactCabinet.receiveShadow = true;
        }
        this.add(compactCabinet);

        const shelfWidth = this.width;

        const wallPartGeometry = new THREE.BoxGeometry(this.length / 2, this.height, this.width - this.width + 0.1);
        const wallPartCabinet = new THREE.Mesh(wallPartGeometry, this.material);
        wallPartCabinet.position.set(position[0] + this.length / 4, position[1] + this.height / 2, position[2] - this.width / 2);
        if(this.shadows){
            wallPartCabinet.castShadow = true;
            wallPartCabinet.receiveShadow = true;
        }
        this.add(wallPartCabinet);

        const rightGeometry = new THREE.BoxGeometry(0.3, this.height, this.width - this.width + 0.3);
        const rightLayer = new THREE.Mesh(rightGeometry, this.material);
        rightLayer.position.set(position[0] + this.length / 4 + this.length / 4, position[1] + this.height / 2, position[2] - this.width / 4 + 0.3);
        rightLayer.rotateY(-Math.PI / 2);
        if(this.shadows){
            rightLayer.castShadow = true;
            rightLayer.receiveShadow = true;
        }
        this.add(rightLayer);

        const shelfHeight = (this.height / 4) / (this.numShelves);
        const shelfSpacing = (this.height - shelfHeight) / (this.numShelves - 1);

        for (let i = 0; i < this.numShelves; i++) {
            const shelfGeometry = new THREE.BoxGeometry(this.length / 2, shelfHeight, shelfWidth);
            const shelf = new THREE.Mesh(shelfGeometry, this.material);
            shelf.position.set(position[0] + this.length / 4, position[1] + i * shelfSpacing + shelfHeight / 2, position[2]);
            if(this.shadows){
                shelf.castShadow = true;
                shelf.receiveShadow = true;
            }
            this.add(shelf);
        }
    }
}
MyCabinet.prototype.isGroup = true;
export { MyCabinet };