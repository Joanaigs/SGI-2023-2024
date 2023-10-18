import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';


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
        this.materialTexture =new THREE.TextureLoader().load("Textures/top.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialWood = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });
        
        this.thinTexture =new THREE.TextureLoader().load("Textures/tableLegs.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialThin = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.thinTexture });

        this.createChair(this.materialWood);
        this.rotateY(rotation);
        this.position.set(position[0], position[1], position[2]);

    }


    createChair(materialWood){
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
        const backSideRight = new THREE.Mesh(geometryBack, materialWood);
        if (this.castShadow) {
            backSideRight.castShadow = true;
            backSideRight.receiveShadow = true;
        }
        backSideRight.position.set(this.position.x+seatLength/2-backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2 - backWidth/2);
        this.add(backSideRight);

        const backSideLeft = new THREE.Mesh(geometryBack, materialWood);
        if(this.castShadow){
            backSideLeft.castShadow = true;
            backSideLeft.receiveShadow = true;
        }
        backSideLeft.position.set(this.position.x-seatLength/2+backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(backSideLeft);

        const geometryBackHorrizontal = new THREE.BoxGeometry(seatLength-backLenght*2, backLinesHeight, backWidth);
        const backMiddleTop = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        if(this.castShadow){
            backMiddleTop.castShadow = true;
            backMiddleTop.receiveShadow = true;
        }
        backMiddleTop.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(backMiddleTop);

        const backMiddleBottom = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        if(this.castShadow){
            backMiddleBottom.castShadow = true;
            backMiddleBottom.receiveShadow = true;
        }
        backMiddleBottom.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2 - space , this.position.z+ seatLength/2-backWidth/2);
        this.add(backMiddleBottom);
    }
}

MyChair.prototype.isGroup = true;
