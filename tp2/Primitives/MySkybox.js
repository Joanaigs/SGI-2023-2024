import * as THREE from 'three';

class MySkybox {
    constructor(primitiveData) {
        console.log("oi");
        console.log(primitiveData);

        this.width = primitiveData.size[0];
        this.height = primitiveData.size[1];
        this.depth = primitiveData.size[2];
        this.center = primitiveData.center;
        this.emissive = primitiveData.emissive;
        this.intensity = primitiveData.intensity;

        console.log(primitiveData.texture_up_ref);
        this.textures = {
            up: primitiveData.up,
            down: primitiveData.down,
            back: primitiveData.back,
            left: primitiveData.left,
            front: primitiveData.front,
            right: primitiveData.right
        };
    }

    addSkybox() {
        // Create a cube geometry for the skybox
        const skyboxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        console.log(this.textures);
        const skyboxMaterials = [
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.right), side: THREE.BackSide, emissive: new THREE.Color(this.emissive), emissiveIntensity: this.intensity }),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.left), side: THREE.BackSide, emissive: new THREE.Color(this.emissive), emissiveIntensity: this.intensity }),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.up), side: THREE.BackSide, emissive: new THREE.Color(this.emissive),    emissiveIntensity: this.intensity }),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.down), side: THREE.BackSide, emissive: new THREE.Color(this.emissive), emissiveIntensity: this.intensity }),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.back), side: THREE.BackSide, emissive: new THREE.Color(this.emissive), emissiveIntensity: this.intensity }),
            new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load(this.textures.front), side: THREE.BackSide, emissive: new THREE.Color(this.emissive), emissiveIntensity: this.intensity }),
        ];

        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        skybox.position.set(this.center[0], this.center[1], this.center[2]);

        return skybox;
    }
}

export { MySkybox };
