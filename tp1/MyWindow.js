import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { MyFrame } from './MyFrame.js';

/**
 * This class contains a Candle representation
 */
class MyWindow extends THREE.Object3D {

    /**
     * 
     * @param {MyFrame} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, contentTexturePath, frameTexturePath) {
        super();
        this.type = 'Group';
        RectAreaLightUniformsLib.init();
        this.height = 10;
        this.length = 13.5
        let position1=[-15+0.10, 0, -2.5+0.25];
        let position2=[-15+0.10, 0, 17.5-0.25];
        this.rightWindow= new MyFrame(this.app, 0.2,this.length, this.height , 0x5d2906, position1,-Math.PI/2, "", frameTexturePath, true);
        this.leftWindow = new MyFrame(this.app, 0.2,this.length, this.height , 0x5d2906, position2,-Math.PI/2,"", frameTexturePath, true);
        this.add(this.leftWindow);
        this.add(this.rightWindow);

        //spotlight light
/*
        this.rectLight1 = new THREE.RectAreaLight( 0xffffff, 1, this.length, this.height );
        this.rectLight1.position.set( position1[0], position1[1]+ this.height/2, position1[2] );
        this.rectLight1.rotateY(-Math.PI/2)
        this.add( this.rectLight1 );

        this.rectLight2 = new THREE.RectAreaLight( 0xffffff, 1, this.length, this.height );
        this.rectLight2.position.set( position2[0], position2[1]+ this.height/2, position2[2] );
        this.rectLight2.rotateY(-Math.PI/2)
        this.add( this.rectLight2 );*/

        //sight


        this.contentTexture =new THREE.TextureLoader().load(contentTexturePath);
            this.diffusePlaneColor = "#FFFFFF";
            this.specularPlaneColor = "#000000";
            this.planeShininess = 100;
            this.contentMaterial = new THREE.MeshBasicMaterial({ color: this.diffusePlaneColor, 
                 map: this.contentTexture });

        this.contentPlane = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), this.contentMaterial);
        this.contentPlane.position.set(-17, 5, 7.5);
        this.contentPlane.rotateY(Math.PI/2);
        this.add(this.contentPlane);


    }
}
MyWindow.prototype.isGroup = true;
export { MyWindow };
