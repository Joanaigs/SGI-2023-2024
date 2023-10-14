import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Vase representation
 */
class MyVase extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {hex} color the color of the vase
     * @param {list} position the position of the vase
     *
     */
    constructor(app, size, color, position, shadows=false) {
        super();
        this.app = app;
        this.size = size || 2;
        this.color = color
 

        this.texture = this.app.textureVase;
        this.texture.repeat.set(2, 1);

        const material = new THREE.MeshPhongMaterial({
            specular: 0xffffff,  // Specular color
            shininess: 2,       // Shininess (higher values make it shinier)
            map: this.app.textureVase,
            side: THREE.DoubleSide,
        });
        

        //vase base
        const baseHeight = 1 * this.size;
        const geometryVaseBase = new THREE.CylinderGeometry( 1*this.size, this.size*0.5, baseHeight, 32, 1, true );

        let base = new THREE.Mesh( geometryVaseBase, material ); 
        if(shadows){
            base.castShadow = true;
            //base.receiveShadow = true;
        }
        base.position.set(position[0],position[1] + baseHeight/2,position[2]);
        this.add( base );

        //vase middle

        const middleHeight = 1.5 * this.size;
        const geometryVaseMiddle = new THREE.CylinderGeometry( this.size*0.5, this.size*1, middleHeight, 32,  1, true  );
        let middle = new THREE.Mesh( geometryVaseMiddle, material );
        if(shadows){
            middle.castShadow = true;
            //middle.receiveShadow = true;
        }
        middle.position.set(position[0],position[1]  + baseHeight + middleHeight/2,position[2]);
        this.add( middle );

        //vase top
        this.texture.repeat.set(3, 1);

        const topHeight = 0.5 * this.size;
        const geometryVaseTop = new THREE.CylinderGeometry( 0.7*this.size, this.size * 0.5, topHeight, 32, 1, true ); 
        let top = new THREE.Mesh( geometryVaseTop, material ); 
        if(shadows){
            top.castShadow = true;
            //top.receiveShadow = true;
        }
        top.position.set(position[0],position[1]  + baseHeight + middleHeight + topHeight/2,position[2]);
        this.add( top );

        //flowers
        const materialStem = new THREE.MeshPhongMaterial( {color: 0xbdecb6} );
        const flowerRadius = 0.2 * this.size;
        const flowerHeight = 0.35 * this.size;
        for (let i = 0; i < 6; i++) {
            const randomColor = Math.random() * 0xffffff; // Random color
            const flowerMaterial = new THREE.MeshPhongMaterial({ color: randomColor });

            const stemHeight = (0.2 + Math.random() * 1) * this.size;
            const geometryStem = new THREE.CylinderGeometry(0.02 * this.size, 0.02 * this.size, stemHeight, 32);
            let stem = new THREE.Mesh(geometryStem, materialStem);

            // Distribute flowers evenly around the top of the vase
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * flowerRadius;
            const z = Math.sin(angle) * flowerRadius;

            stem.position.set(
                position[0] + x,
                position[1] + baseHeight + middleHeight + topHeight + stemHeight / 2,
                position[2] + z
            );
            this.add(stem);

            const flowerGeometry = new THREE.ConeGeometry(flowerRadius, flowerHeight, 32);
            let flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            flower.position.set(stem.position.x, stem.position.y + stemHeight / 2, stem.position.z);
            flower.rotateX(-Math.PI); // Rotate the flower to be upright
            this.add(flower);
        }




        
    }

}
MyVase.prototype.isGroup = true;
export { MyVase };