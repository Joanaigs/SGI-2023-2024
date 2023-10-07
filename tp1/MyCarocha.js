import * as THREE from 'three';
import { MyFrame } from './MyFrame.js';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Frame with a Carocha drawing eith cuves
 */
class MyCarocha extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {string} frameTexturePath the path to the frame texture
     * @param {list} position the position of the carocha
     * @param {number} rotation the angle of rotation of the carocha in y axis
     * @param {number} scale the scale of the carocha 
     */
    constructor(app, frameTexturePath, position, rotation, scale) {
        super();
        this.type = 'Group';
        this.app = app;
        this.frameTexturePath = frameTexturePath;
        this.positionL=position;
        this.rotationA=rotation;
        this.width=0.5;
        this.height=3;
        this.length=5.5;
        this.numPoints=20
        this.buildCar();
        this.buildFrame();
        this.position.set(position[0],position[1],position[2]);
        this.rotateY(rotation);
        this.scale.set(scale,scale,scale);
       
    }

    buildCar(){
        const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

        //weels
        // imagem tp 1 unidade 4 quadrados
        const weel = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0, 0),        // Start point
            new THREE.Vector3(0, 1, 0),        // Control point 1
            new THREE.Vector3(6/4, 1, 0),        // Control point 2
            new THREE.Vector3(6/4, 0, 0)         // End point
        );
        const pointsWeel = weel.getPoints( this.numPoints );
        const geometryweel = new THREE.BufferGeometry().setFromPoints( pointsWeel );
        
        const weelObject1 = new THREE.Line( geometryweel, material );
        weelObject1.position.set(0.8,0.5,0);
        this.add(weelObject1);

        const weelObject2 = new THREE.Line( geometryweel, material );
        weelObject2.position.set(2.5+0.8,0.5,0);
        this.add(weelObject2);

        //half sphere
        const halfSphere = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0, 0),        // Start point
            new THREE.Vector3(0, 2, 0),        // Control point 1
            new THREE.Vector3(2, 2, 0)   
        );
        const pointsHalfSphere = halfSphere.getPoints( this.numPoints );
        const geometryHalfSphere= new THREE.BufferGeometry().setFromPoints( pointsHalfSphere );
        const topLeftObject = new THREE.Line( geometryHalfSphere, material );
        topLeftObject.position.set(0+0.8,0.5,0);
        this.add(topLeftObject);

        const topRightObject = new THREE.Line( geometryHalfSphere, material );
        topRightObject.position.set(2+0.8,2.5,0);
        topRightObject.rotateZ(-Math.PI/2);
        topRightObject.scale.set(0.5,0.5,0.5);
        this.add(topRightObject);

        const bottomLeftObject = new THREE.Line( geometryHalfSphere, material );
        bottomLeftObject.position.set(3+0.8,1.5,0);
        bottomLeftObject.rotateZ(-Math.PI/2);
        bottomLeftObject.scale.set(0.5,0.5,0.5);
        this.add(bottomLeftObject);
    }

    buildFrame(){
        this.frame= new MyFrame(this.app, this.width ,this.length, this.height , 0x5d2906, this.position,-Math.PI/2, this.frameTexturePath, this.frameTexturePath);
        this.frame.rotateY(-Math.PI/2);
        this.frame.position.set(this.length/2,0,0);
        this.add(this.frame);
    }
}
MyCarocha.prototype.isGroup = true;
export { MyCarocha };
