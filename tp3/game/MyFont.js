import * as THREE from 'three';

/**
 * This class represents a font
 */
class MyFont extends THREE.Object3D {

    /**
     * The constructor of the class. Initializes the font
     * @param {Boolean} center if the font should be centered, default is true
     */
    constructor(center = true) {
        super();
        this.texture = new THREE.TextureLoader().load('textures/font1.png');
        this.center = center;
    }

    /**
     * Returns a mesh with the word
     * @param {String} word the word to be displayed 
     * @param {Hex} color the color of the word, default is white 
     * @returns 
     */
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
            if(this.center)
                sprite.position.set(i*(0.5)+word.length/6, 0, 0);
            else
                sprite.position.set(i*(0.5), 0, 0);
            wordMesh.add(sprite);
        }
        return wordMesh;
    }
    /**
     * Gets a character
     * @param {*} offsetx 
     * @param {*} offsetY 
     * @param {*} color 
     * @returns 
     */
    getChar(offsetx, offsetY, color = 0xffffff){
        let letterTexture = this.texture.clone();
        letterTexture.needsUpdate = true;
        letterTexture.offset.x = offsetx;
        letterTexture.offset.y = offsetY;
        letterTexture.repeat.x = 1/16;
        letterTexture.repeat.y = 1/16;
        let wordMesh = new THREE.Group();
        let plane = new THREE.PlaneGeometry(1, 1);
        let sprite = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: letterTexture, color: color, transparent: true }));
        if(this.center)
            sprite.position.set((0.5)+word.length/6, 0, 0);
        else
            sprite.position.set((0.5), 0, 0);
        wordMesh.add(sprite);
    
        return wordMesh;
    }

    /**
     * Gets the offset of the character
     * @param {Char} c the character
     * @returns the offset of the character
     */
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