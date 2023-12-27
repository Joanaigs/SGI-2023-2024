import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';


/**
 *  This class contains the contents of out application
 */
class MyVehicle {

    constructor(game, position, target) {

        
        this.game = game
        this.rotation = 0;
        this.rotateScale = 0.3;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1;
        this.minVelocity = -0.5;
        this.keysPressed = {};
        this.car = new MyVehicleObject();
        this.car.position.set(position.x, position.y, position.z);
        this.car.position.add(target);
        this.game.app.scene.add(this.car);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.trackTexture = new THREE.TextureLoader().load('./textures/track.png');
        
        this.renderTarget = new THREE.WebGLRenderTarget(411,700);

    }

    checkCollisions(obstacles, powerUps) {
        
        for (const obstacle of obstacles) {
            const intersection = this.checkIntersection(this.car, obstacle);
            if (intersection) {
                console.log('Collision with obstacle!');
            }
        }

        // Check collisions with power-ups
        for (const powerUp of powerUps) {
            const intersection = this.checkIntersection(this.car, powerUp);
            if (intersection) {
                console.log('Collision with power-up!');
            }
        }
    }

    checkInsideTrack(){
        return false;
    }

    left() {
        this.rotation += this.rotateScale;
    }

    right() {
        this.rotation -= this.rotateScale;
    }

    accelerate() {
        if (this.velocity < this.maxVelocity) {
            this.velocity += this.acceleration;
        }
    }

    brake() {
        if (this.velocity > this.minVelocity) {
            this.velocity -= this.acceleration;
        }
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = true;
        this.handleKeys();
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = false;
        this.handleKeys();
    }

    handleKeys() {
        if (this.keysPressed['a'] || this.keysPressed['arrowleft']) {
            this.left();
        }

        if (this.keysPressed['d'] || this.keysPressed['arrowright']) {
            this.right();
        }

        if (this.keysPressed['w'] || this.keysPressed['arrowup']) {
            this.accelerate();
        }

        if (this.keysPressed['s'] || this.keysPressed['arrowdown']) {
            this.brake();
        }
    }


    update() {

        
        const deltaPosition = new THREE.Vector3(
            this.velocity * Math.sin(this.rotation),
            0,
            this.velocity * Math.cos(this.rotation)
        );
        this.car.position.add(deltaPosition);
        this.car.rotation.y = this.rotation;

        if (this.checkInsideTrack(this.car.position)) {
            console.log("dentro")
        }
        else{
            console.log("fora")
        }
    
        if (this.velocity !== 0) {
            this.checkCollisions(this.game.obstacles.getObstacles(), this.game.powerUps.getPowerUps());
        }
    
        const movementDirection = Math.sign(this.velocity);
        const rotationSpeed = Math.abs(this.velocity) * 0.8;
    
    
        this.car.children[0].children.forEach(wheel => {
            wheel.children.forEach(w => {
                w.rotation.x += (movementDirection * Math.PI / 30) * rotationSpeed;
            });
        });
    }
    
    

    checkIntersection(object1, object2) {

        // Get the bounding boxes of the two objects
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);
        
        if (box1.intersectsBox(box2)) {
            console.log('Intersection detected!');
            return true;
        }
        return false;
    }

    checkCarPosition(carPosition) {
        const textureWidth = 411;
        const textureHeight = 700;
        const threshold = 0.1; // Adjust this threshold as needed
    
        // Normalizar as coordenadas para a textura
        const normalizedX = (carPosition.x - 38);
        const normalizedY = (carPosition.z - 29);// Inverter para corresponder à convenção three.js
    
        console.log('normalizedX:', normalizedX);
        console.log('normalizedY:', normalizedY);
    
        // Criar um canvas temporário
        const canvas = document.createElement('canvas');
        canvas.width = textureWidth;
        canvas.height = textureHeight;
        const context = canvas.getContext('2d');

    
        // Verificar se a imagem foi completamente carregada
        if (this.trackTexture && this.trackTexture.image && this.trackTexture.image.complete) {
            // Desenhar a imagem no canvas
            context.drawImage(this.trackTexture.image, 0, 0, 411, 700);
            document.body.appendChild(canvas);
    
            // Obter os dados da textura
            const imageData = context.getImageData(normalizedX, normalizedY, 1, 1).data;
            
            // Ler a cor da textura na posição (normalizedX, normalizedY)
            const textureColor = new THREE.Color(
                imageData[0] / 255,
                imageData[1] / 255,
                imageData[2] / 255
            );
            console.log(textureColor);
    
            // Compare a cor da textura com a cor esperada, considerando o threshold
            return (
                textureColor.r  < threshold &&
                textureColor.g  < threshold &&
                textureColor.b  < threshold
            );

        } else {
            // A imagem ainda está sendo carregada ou não existe
            console.error('A imagem ainda está sendo carregada ou não existe.');
            return false;
        }
    }
    
    
    
    

    checkInsideTrack(deltaPosition) {
        return this.checkCarPosition(deltaPosition);
    }
}
    
    


export { MyVehicle };