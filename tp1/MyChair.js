import * as THREE from 'three';


/**
 * This class contains a Table representation
 */
export class MyChair extends THREE.Object3D {
    constructor(app, size,  position, rotation, color) {
        super();
        this.type = 'Group';
        this.app = app;
        this.size = size;
        this.color = color;

        // Material for the table
        this.materialTexture =new THREE.TextureLoader().load("textures/top.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#ffffff";
        this.planeShininess = 50;
        this.materialWood = new THREE.MeshStandardMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });
        
        this.thinTexture =new THREE.TextureLoader().load("textures/tableLegs.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#ffffff";
        this.planeShininess = 50;
        this.materialThin = new THREE.MeshStandardMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.thinTexture });

        this.createChair(this.materialWood, this.materialThin);
        this.position.set(position[0], position[1], position[2]);
        this.rotateY(rotation);

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
            tableLeg.position.set(
                legSeparation*Math.pow(-1, i),
                legHeight / 2,
                legSeparation*Math.pow(-1, Math.floor(i/2))
            );
            console.log(tableLeg.position, this.position);
            this.add(tableLeg);
        }

        //seat
        const geometrySeat = new THREE.BoxGeometry(seatLength, seatHeight, seatLength);
        const seat = new THREE.Mesh(geometrySeat, materialWood);
        seat.position.set(this.position.x, legHeight + seatHeight/2, this.position.z);
        this.add(seat);

        //back
        const geometryBack = new THREE.BoxGeometry(backLenght, backHeight, backWidth);
        const back1 = new THREE.Mesh(geometryBack, materialWood);
        back1.position.set(this.position.x+seatLength/2-backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2 - backWidth/2);
        this.add(back1);

        const back2 = new THREE.Mesh(geometryBack, materialWood);
        back2.position.set(this.position.x-seatLength/2+backLenght/2, legHeight + seatHeight + backHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(back2);

        const geometryBackHorrizontal = new THREE.BoxGeometry(seatLength, backLinesHeight, backWidth);
        const back3 = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        back3.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2, this.position.z+ seatLength/2-backWidth/2);
        this.add(back3);

        const back4 = new THREE.Mesh(geometryBackHorrizontal, materialWood);
        back4.position.set(this.position.x, legHeight + seatHeight + backHeight - backLinesHeight/2 - space , this.position.z+ seatLength/2-backWidth/2);
        this.add(back4);


        
    }
    
}

MyChair.prototype.isGroup = true;
