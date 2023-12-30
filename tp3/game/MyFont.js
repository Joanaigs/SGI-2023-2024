import * as THREE from 'three';

class MyFont extends THREE.Object3D {
    constructor() {
        super();
        this.texture = new THREE.TextureLoader().load('textures/font1.png');
    }


    getWord(word, color = 0xffffff){
        let wordMesh = new THREE.Group();
        for (let i = 0; i < word.length; i++) {
            let letter = this.getCharFrame(word[i]);
            let letterTexture = this.texture.clone();
            letterTexture.needsUpdate = true;
            letterTexture.offset.x = letter.offsetX;
            letterTexture.offset.y = 1-letter.offsetY;
            letterTexture.repeat.x = 1/16;
            letterTexture.repeat.y = 1/16;



            let plane = new THREE.PlaneGeometry(1, 1);
            let sprite = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: letterTexture, color: color, transparent: true }));
            sprite.position.set(i, 0, 0);
            wordMesh.add(sprite);
        }
        return wordMesh;
    }


    getCharFrame(c) {
        // Define the properties for each character frame (adjust as needed)
        const framesX = 16; // Number of frames in the X direction
        const framesY = 16; // Number of frames in the Y direction
        const frameWidth =1/16;
        const frameHeight = 1/16;

        // Calculate the offset for the specified character 'c' (assuming ASCII encoding)
        const charCode = c.charCodeAt(0);
        const offsetX = (charCode % framesX  ) * frameWidth;
        const offsetY = Math.floor(charCode / framesY +1) * frameHeight;

        return { offsetX, offsetY};
    }

}

export { MyFont };
