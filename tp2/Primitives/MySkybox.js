import * as THREE from 'three';

class MySkybox {
    constructor(primitiveData) {
        this.width = primitiveData.width;
        this.height = primitiveData.height;
        this.depth = primitiveData.depth;

        this.textures = {
            up: primitiveData.texture_up_ref,
            down: primitiveData.texture_dn_ref,
            back: primitiveData.texture_bk_ref,
            left: primitiveData.texture_lt_ref,
            front: primitiveData.texture_ft_ref,
            right: primitiveData.texture_rt_ref,
        };
    }

    createSkybox(castShadow, receiveShadows) {
        // Create a cube geometry for the skybox
        const skyboxGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

        // Create materials for each face of the cube using textures
        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.right), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.left), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.up), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.down), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.back), side: THREE.BackSide }),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(this.textures.front), side: THREE.BackSide }),
        ];

        // Create the skybox mesh
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);

        // Apply cast and receive shadow properties
        if (castShadow) {
            skybox.castShadow = true;
        }
        if (receiveShadows) {
            skybox.receiveShadow = true;
        }

        return skybox;
    }
}

export { MySkybox };
