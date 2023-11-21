import * as THREE from 'three';

class MySkybox {
    constructor(primitiveData) {

        this.width = primitiveData.size[0];
        this.height = primitiveData.size[1];
        this.depth = primitiveData.size[2];
        this.center = primitiveData.center;
        this.emissive = primitiveData.emissive;
        this.intensity = primitiveData.intensity;

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

        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.right), side: THREE.BackSide, color: this.emissive, emissiveMap: new THREE.TextureLoader().load(this.up), emissiveIntensity: this.intensity}),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.left), side: THREE.BackSide, color: this.emissive,  emissiveMap: new THREE.TextureLoader().load(this.up), emissiveIntensity: this.intensity}),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.up), side: THREE.BackSide, color: this.emissive, emissiveMap: new THREE.TextureLoader().load(this.up), emissiveIntensity: this.intensity}),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.down), side: THREE.BackSide, color: this.emissive, emissiveMap: new THREE.TextureLoader().load(this.down), emissiveIntensity: this.intensity}),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.back), side: THREE.BackSide, color: this.emissive, emissiveMap: new THREE.TextureLoader().load(this.back), emissiveIntensity: this.intensity}),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.front), side: THREE.BackSide,color: this.emissive, emissiveMap: new THREE.TextureLoader().load(this.front), emissiveIntensity: this.intensity}),
        ];

        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        skybox.position.set(this.center[0], this.center[1], this.center[2]);

        return skybox;
    }
}

export { MySkybox };
