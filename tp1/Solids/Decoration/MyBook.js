import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a book representation
 */
export class MyBook extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width width of the book
     * @param {number} length length of the book
     * @param {number} height height of the book
     * @param {number} numBooks number of books on the pile
     * @param {number[]} position an array with x, y, z coordinates
     */
    constructor(app, width, length, height, numBooks, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.width = width;
        this.length = length;
        this.height = height;
        this.numBooks = numBooks
        this.position.set(position[0], position[1], position[2]);
        this.coverThickness = 0.01;

        this.createBookPile(position);
    }

    createBook(position, color) {
        this.position.set(position[0], position[1], position[2]);

        // Pages
        this.pagesTexture = new THREE.TextureLoader().load("Textures/pages.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 25;
        const materialPages = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.pagesTexture });

        const geometryPages = new THREE.BoxGeometry(this.length, this.height, this.width);
        const pages = new THREE.Mesh(geometryPages, materialPages);
        pages.position.set(position[0], position[1], position[2]);

        // Cover

        // front and back cover
        const geometryCover = new THREE.BoxGeometry(this.length, this.coverThickness, this.width);
        const materialCover = new THREE.MeshPhongMaterial({ color: color });
        
        const frontCover = new THREE.Mesh(geometryCover, materialCover);
        frontCover.position.set(position[0], position[1] + this.height / 2 + this.coverThickness / 2, position[2]);
        const backCover = new THREE.Mesh(geometryCover, materialCover);
        backCover.position.set(position[0], position[1] - this.height / 2 - this.coverThickness / 2, position[2]);

        // spine
        const geometrySpine = new THREE.BoxGeometry(this.length, this.coverThickness, this.height);
        const spine = new THREE.Mesh(geometrySpine, materialCover);
        spine.rotateX(Math.PI / 2);
        spine.position.set(position[0], position[1], position[2] - this.width / 2);
        
        // Create a group to contain the book components
        const book = new THREE.Group(); 
        book.add(pages, frontCover, backCover, spine);
        book.position.set(position[0], position[1], position[2]);
        this.add(book);
        
    }

    getRandomColor() {
        const colors =  ["#D3D3D3", "#C0C0C0", "#DCDCDC", "#808080", "#696969", "#A9A9A9", "#708090", "#778899", "#2F4F4F", "#36454F"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        const randomColor = colors[randomIndex];

        const threeColor = new THREE.Color(randomColor);
        return threeColor;
    }

    createBookPile(startPosition) {
        const spacing = this.height/2 + 0.01;
    
        for (let i = 0; i < this.numBooks; i++) {
            const position = [
                startPosition[0], 
                startPosition[1] + i * spacing, 
                startPosition[2] 
            ];
    
            const color = this.getRandomColor();
            this.createBook(position, color); 
        }
    }
    
}

MyBook.prototype.isGroup = true;
