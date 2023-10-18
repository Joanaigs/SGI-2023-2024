import * as THREE from 'three';
import { MyFrame } from '../Decoration/MyFrame.js';
import { MyCurtain } from '../../Curves_&_Surfaces/MyCurtain.js';

/**
 * This class contains a Window representation
 */
class MyWindow extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {string} contentTexturePath the path to the place texture 
     */
    constructor(app, contentTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        this.height = 10;
        this.length = 13.5
        let position1 = [-15 + 0.10, 0, -2.5 + 0.25];
        let position2 = [-15 + 0.10, 0, 17.5 - 0.25];

        this.rightWindow = new MyFrame(this.app, 0.2, this.length, this.height, position1, -Math.PI / 2, this.app.materialLightMetal, this.app.materialLightMetal, true, false);
        this.curtainRight = new MyCurtain(this.app,this.height, this.length,[position1[0], position1[1] + this.height + 0.5, position1[2]],[position1[0] + 1.5, position1[1] + this.height * 0.5 + 0.5, position1[2] - this.length / 2 + 1], -Math.PI / 3);
        this.leftWindow = new MyFrame(this.app, 0.2, this.length, this.height, position2, -Math.PI / 2, this.app.materialLightMetal, this.app.materialLightMetal, true, false);
        this.curtainLeft = new MyCurtain(this.app,this.height, this.length,[position2[0], position2[1] + this.height + 0.5, position2[2]], [position2[0] + 1.5, position2[1] + this.height * 0.5 + 0.5, position2[2] + this.length / 3 - 0.3], -Math.PI / 3);

        this.add(this.leftWindow);
        this.add(this.rightWindow);
        this.add(this.curtainRight);
        this.add(this.curtainLeft);



        this.contentTexture = new THREE.TextureLoader().load(contentTexturePath);
        this.diffusePlaneColor = "#aaaaaa";
        this.contentMaterial = new THREE.MeshBasicMaterial({
            color: this.diffusePlaneColor,
            map: this.contentTexture
        });
        let ratio = 4589/3092   ;
        this.contentPlane = new THREE.Mesh(new THREE.PlaneGeometry(ratio * 25, 25 / ratio), this.contentMaterial);
        this.contentPlane.rotateY(Math.PI / 2);
        this.contentPlane.position.set(-16, 5, 7.5);
        this.add(this.contentPlane);

    }
}
MyWindow.prototype.isGroup = true;
export { MyWindow };
