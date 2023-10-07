import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Candle representation
 */
class MySofa extends THREE.Object3D {

    /**
     * 
     * @param {MySofa} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, size, colorBase, colorPillow, position, sofaLength) {
        super();
        this.app = app;
        this.size = size || 2;

        const materialSofa = new THREE.MeshPhongMaterial( {color: colorBase} );
        const materialPillow = new THREE.MeshPhongMaterial( {color: colorPillow} );

        // Calculate heights and positions based on size
        const baseHeight = 0.8* this.size;
        const sofaWidth = 4 * this.size;
        sofaLength = sofaLength * this.size;
        const backWidth = 0.4 * this.size;
        const backHeight = 3 * this.size;
        const flameHeight = 0.1 * this.size;

        //Sofa base
        const geometryBase = new THREE.BoxGeometry( sofaLength, baseHeight, sofaWidth);
        let sofaBase = new THREE.Mesh(geometryBase, materialSofa);
        sofaBase.position.set(position[0], position[1]  + baseHeight / 2, position[2]);
        this.add(sofaBase);

        //Sofa back
        const geometryBack = new THREE.BoxGeometry(sofaLength, backHeight, backWidth);
        let sofaBack = new THREE.Mesh(geometryBack, materialSofa);
        sofaBack.position.set(position[0], position[1]  + baseHeight + backHeight/2 , position[2]+sofaWidth/2- backWidth/2);
        this.add(sofaBack);

        //Sofa pillow back
        const geometryBackPillow = new THREE.BoxGeometry(sofaLength, backHeight, backWidth);
        let sofaBackPillow = new THREE.Mesh(geometryBackPillow, materialPillow);
        sofaBackPillow.position.set(position[0], position[1]  + baseHeight + backHeight/2 , position[2]+sofaWidth/2- (3*backWidth)/2);
        this.add(sofaBackPillow);
        

        //Sofa pillow
        const sofaPillowWidth = sofaWidth - backWidth*2
        const geometryBasePillow = new THREE.BoxGeometry(sofaLength, baseHeight,sofaPillowWidth);
        let sofabasePillow = new THREE.Mesh(geometryBasePillow, materialPillow);
        sofabasePillow.position.set(position[0], position[1]  + (3*baseHeight)/2 , position[2]-backWidth/2 - backWidth/2);
        this.add(sofabasePillow);

        //Arm rest 1
        const armRestHeight = (baseHeight+1.5) * this.size;
        const armRestWidth = sofaWidth;
        const armRestLength = 0.5 * this.size;
        const geometryArmRest = new THREE.BoxGeometry(armRestLength, armRestHeight, armRestWidth);
        let armRest = new THREE.Mesh(geometryArmRest, materialSofa);
        armRest.position.set(position[0] + sofaLength/2 + armRestLength/2, position[1] + armRestHeight/2 , position[2]);
        this.add(armRest);

        const geometryArmRestPillow = new THREE.CylinderGeometry(armRestLength/2, armRestLength/2, armRestWidth, 32, 1, false, 0, Math.PI);
        let armRestPillow = new THREE.Mesh(geometryArmRestPillow, materialPillow);
        armRestPillow.position.set(position[0] + sofaLength/2 + armRestLength/2, position[1] + armRestHeight  , position[2]);
        armRestPillow.rotateZ(Math.PI/2);
        armRestPillow.rotateX(Math.PI/2);
        this.add(armRestPillow);

        //Arm rest 2
        let armRest2 = new THREE.Mesh(geometryArmRest, materialSofa);
        armRest2.position.set(position[0] - sofaLength/2 - armRestLength/2, position[1] + armRestHeight/2, position[2]);
        this.add(armRest2);

        let armRestPillow2 = new THREE.Mesh(geometryArmRestPillow, materialPillow);
        armRestPillow2.position.set(position[0] - sofaLength/2 - armRestLength/2, position[1] + armRestHeight  , position[2]);
        armRestPillow2.rotateZ(Math.PI/2);
        armRestPillow2.rotateX(Math.PI/2);
        this.add(armRestPillow2);

        






        
    }
}
MySofa.prototype.isGroup = true;
export { MySofa };