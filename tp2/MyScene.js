import * as THREE from 'three';

class MyScene extends THREE.Scene{
    constructor(app) {
        super();
    }
    updateGlobals(globalData) {
        if(globalData.fog !== undefined){
            this.fog = new THREE.Fog(globalData.fog.color, globalData.fog.near, globalData.fog.far);
        }
        this.background = new THREE.Color(globalData.background);
    }

}
export { MyScene };