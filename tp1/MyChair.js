import * as THREE from 'three';
import { MyApp } from './MyApp.js';


/**
 * This class contains a Chair representation
 */
export class MyChair extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis
     * @param {list} position the position of the chair
     * @param {number} rotation the angle of rotation of the chair in y axis
     * @param {hex} color the color of the chair
     * @param {bool} castShadow true if the chair casts shadows
     */
    constructor(app, size,  position, rotation, color, castShadow=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.size = size;
        this.color = color;
        this.castShadow = castShadow;

        // Material for the table
        this.materialTexture =new THREE.TextureLoader().load("textures/top.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 25;
        this.materialWood = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });
        
        this.thinTexture =new THREE.TextureLoader().load("textures/tableLegs.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 25;
        this.materialThin = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.thinTexture });

        this.createChair(this.materialWood, this.materialThin);
        this.rotateY(rotation);
        this.position.set(position[0], position[1], position[2]);

    }


    createChair(materialWood, materialThin){
        let legHeight = 2.5*this.size;
        let legrad = 0.2*this.size;
        let legSeparation = 0.9*this.size;
        let seatHeight = 0.8*this.size;
        let backHeight = (legHeight-0.1)*this.size;
        let seatLength = (legSeparation*2+legrad)*this.size;
        let seatWidth = (seatLength+0.2)*this.size;
        let backWidth = 0.1*this.size;
        let backLenght = 0.4*this.size;
        let backLinesHeight = 0.8*this.size;
        let space = 1*this.size;


        //legs
        for(let i=0; i<4; i++){
            const geometryLeg = new THREE.BoxGeometry(legrad, legHeight, legrad, 32);
            const tableLeg = new THREE.Mesh(geometryLeg, materialWood);
            if(this.castShadow){
                tableLeg.castShadow = true;
                tableLeg.receiveShadow = true;
            }
            tableLeg.position.set(
                legSeparation*Math.pow(-1, i),
                legHeight / 2,
                legSeparation*Math.pow(-1, Math.floor(i/2))
            );
            this.add(tableLeg);
        }

        //seat
        const geometrySeat = new THREE.BoxGeometry(seatLength, seatHeight, seatLength);
        const seat = new THREE.Mesh(geometrySeat, materialWood);
        if(this.castShadow){
            seat.castShadow = true;
            seat.receiveShadow = true;
        }
        seat.position.set(this.position.x, legHeight + seatHeight/2, this.position.z);
        this.add(seat);

        //back
        const geometryBack = new THREE.BoxGeometry(backLenght, backHeight, backWidth);
        const back1 = new THREE.Mesh(geometryBack, materialWood);
        if (this.castShadow) {
            back1.castShadow = true;
            back1.receiveShadow = true;
        }
        back1.position.set(this.position.x+seatLength/2-backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2 - backWidth/2);
        this.add(back1);

        const back2 = new THREE.Mesh(geometryBack, materialWood);
        if(this.castShadow){
            back2.castShadow = true;
            back2.receiveShadow = true;
        }
        back2.position.set(this.position.x-seatLength/2+backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(back2);

        const geometryBackHorrizontal = new THREE.BoxGeometry(seatLength-backLenght*2, backLinesHeight, backWidth);
        const back3 = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        if(this.castShadow){
            back3.castShadow = true;
            back3.receiveShadow = true;
        }
        back3.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(back3);

        const back4 = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        if(this.castShadow){
            back4.castShadow = true;
            back4.receiveShadow = true;
        }
        back4.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2 - space , this.position.z+ seatLength/2-backWidth/2);
        this.add(back4);


        
    }
    
}

MyChair.prototype.isGroup = true;
