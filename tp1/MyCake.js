import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

/**
 * This class contains a Cake representation
 */
class MyCake extends THREE.Object3D {

    /**
     * 
     * @param {MyCake} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, color) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;

        this.plate = new MyPlate(this, 1.2, 0xf5e9dc, [0, 0, 0]);
        this.add(this.plate);
        let plateHeight = this.plate.plateHeight();

        const material = new THREE.MeshBasicMaterial({ color: color });
        const toppingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        let topping = new THREE.SphereGeometry(0.1, 32, 16, 0, Math.PI*2, 0, Math.PI/2);

        // Define cake tiers and heights
        const cakeTiers = [
            { radiusTop: 1, radiusBottom: 1, height: 0.6 },
            { radiusTop: 0.7, radiusBottom: 0.7, height: 0.5 },
            { radiusTop: 0.5, radiusBottom: 0.5, height: 0.4 },
        ];

        let currentHeight = plateHeight;

        // Cake tiers
        for (let i = 0; i < cakeTiers.length; i++) {
            const tier = cakeTiers[i];
            let geometry
            if(i!=cakeTiers.length-1)
                geometry = new THREE.CylinderGeometry(tier.radiusTop, tier.radiusBottom, tier.height, 32);
            else 
                geometry = new THREE.CylinderGeometry(tier.radiusTop, tier.radiusBottom, tier.height, 32, 1, false, 0, (5*Math.PI)/3);

            const cake = new THREE.Mesh(geometry, material);


    
            // Toppings
            for (let j = 0; j < 6; j++) {
                if(i==cakeTiers.length-1 && j==2)
                    continue
                const ang = (j * 2 * Math.PI) / 6;
                const top = new THREE.Mesh(topping, toppingMaterial);
                top.position.set( (tier.radiusBottom-0.1) * Math.cos(ang), currentHeight + tier.height, (tier.radiusBottom-0.1) * Math.sin(ang));
                this.add(top);
            }

            cake.position.set(0, currentHeight + tier.height / 2, 0);
            this.add(cake);

            currentHeight += tier.height;
        }

        let pieceCakeInfo= cakeTiers[cakeTiers.length-1];
         // Add rectangles to close the sides
         const sideGeometry = new THREE.PlaneGeometry(pieceCakeInfo.radiusBottom , pieceCakeInfo.height);
         const sideMaterial = new THREE.MeshBasicMaterial({ color: 0Xffc2d9});
 
        
         const side1 = new THREE.Mesh(sideGeometry, sideMaterial);
         side1.position.set( 0 , currentHeight - pieceCakeInfo.height/2 , pieceCakeInfo.radiusBottom/2  );
         side1.rotateY(-Math.PI / 2); // Rotate to match the angle of the cake slice
         this.add(side1);
 
         const side2 = new THREE.Mesh(sideGeometry, sideMaterial);
         side2.position.set(
            -(pieceCakeInfo.radiusTop/2)* Math.sin(Math.PI/3), // Adjust this value as needed
              + currentHeight - pieceCakeInfo.height / 2,
                (pieceCakeInfo.radiusTop/2)* Math.cos(Math.PI/3) // Adjust this value as needed
         );side2.rotateY( Math.PI/6); // Rotate to match the angle of the cake slice
         this.add(side2);

        // Candle
        this.candle = new MyCandle(this, 1, 0xffffff, [0, currentHeight, 0]);
        this.add(this.candle);
    }
}

MyCake.prototype.isGroup = true;
export { MyCake };
