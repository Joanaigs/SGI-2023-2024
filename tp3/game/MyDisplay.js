import * as THREE from 'three';
import { MyFont } from './MyFont.js';


/**
 *  This class contains the contents of out application
 */
class MyDisplay{


    constructor(game, camera) {
        this.game = game;
        this.lasTime = 0;
        this.lastLaps = 0;
        this.lastVelocity = 0;
        this.lastPenalty = 0;
        this.timeObstacle = 0;
        this.timePowerUp = 0;
        this.pause = false;
        this.font =new MyFont();
        this.camera = this.game.app.cameras[camera];
        this.buildDisplayCamera(this.camera);


    }

    // Inside the buildDisplayCamera method
    buildDisplayCamera(camera) {
        this.hudGroup = new THREE.Group();

        let height = 2 * Math.tan(camera.fov * Math.PI / 360)*5;
        let width = height * camera.aspect;
        console.log(width, height);
        // Create the time object
        this.timeGroup = new THREE.Group();
        this.time = this.font.getWord("Timer:");
        this.timeGroup.add(this.time);
        this.hudGroup.add(this.timeGroup);

        // Create the laps object
        this.lapsGroup = new THREE.Group();
        this.laps = this.font.getWord("Laps:");
        this.lapsValue = this.font.getWord("0");
        this.lapsValue.position.set(5, 0, 0);
        this.lapsGroup.add(this.laps);
        this.lapsGroup.add(this.lapsValue);
        this.lapsGroup.position.set(0, -1, 0);
        this.hudGroup.add(this.lapsGroup);

        // Create the velocity object
        this.velocityGroup = new THREE.Group();
        this.velocity = this.font.getWord("Velocity:");
        this.velocityValue = this.font.getWord("0");
        this.velocityValue.position.set(9, 0, 0);
        this.velocityGroup.add(this.velocity);
        this.velocityGroup.add(this.velocityValue);
        this.velocityGroup.position.set(0, -2, 0);
        this.hudGroup.add(this.velocityGroup);

        this.hudGroup.position.set(-width/2+0.5, height/2-0.5, -5);
        this.hudGroup.scale.set(0.15, 0.15, 0.15);

        //PowerUps
        this.powerUpsGroup = new THREE.Group();
        this.powerUps = this.font.getWord("PowerUps");
        this.powerUpsGroup.add(this.powerUps);
        this.powerUpsVelocity = this.font.getWord("Velocity Timer:");
        this.powerUpsVelocity.position.set(1, -1, 0);
        this.powerUpsGroup.add(this.powerUpsVelocity);
        this.powerUpsGroup.position.set(-width/2+0.5, -height/2+0.5, -5);
        this.powerUpsGroup.scale.set(0.12, 0.12, 0.12);
        this.powerUpsGroup.visible=false;
        // Obstacles
        this.obstaclesGroup = new THREE.Group();
        this.obstacles = this.font.getWord("Obstacles");
        this.obstaclesGroup.position.set(width/2-4,-height/2+0.5, -5);
        this.obstaclesGroup.scale.set(0.12, 0.12, 0.12);
        this.obstaclesGroup.add(this.obstacles);
        this.obstaclesOffset = 1;

        // Add the group to the scene (assuming your scene is accessible from this.game.app)
        camera.add(this.hudGroup);
        camera.add(this.powerUpsGroup);
        camera.add(this.obstaclesGroup);

    }

    update(time, laps, velocity, penalty) {
        if(this.game.paused)
            return;
        if (time != this.lasTime) {
            this.timeGroup.remove(this.timeValue);
            this.timeValue = this.font.getWord(time.toString());
            this.timeValue.position.set(6, 0, 0);
            this.timeGroup.add(this.timeValue)
            this.time = time;
            if(penalty==0){
                this.timeGroup.remove(this.penalty);
                this.lastPenalty=0;
            }
            if(penalty>0){
                this.timeGroup.remove(this.penalty);
                this.penalty = this.font.getWord("+"+penalty.toString(), 0xff0000);
                this.penalty.position.set(6+time.toString().length+1, 0, 0);
                this.timeGroup.add(this.penalty);
            }
            if(penalty<0){
                this.timeGroup.remove(this.penalty);
                this.penalty = this.font.getWord(penalty.toString(), 0x00ff00);
                this.penalty.position.set(6+time.toString().length+1, 0, 0);
                this.timeGroup.add(this.penalty);
            }
        }

        if (laps != this.lastLaps) {
            this.lapsGroup.remove(this.lapsValue);
            this.lapsValue = this.font.getWord(laps.toString());
            this.lapsValue.position.set(5, 0, 0);
            this.lapsGroup.add(this.lapsValue)
            this.laps = laps;
        }
        if (velocity != this.lastVelocity) {
            this.velocityGroup.remove(this.velocityValue);
            this.velocityValue = this.font.getWord(velocity.toString());
            this.velocityValue.position.set(9, 0, 0);
            this.velocityGroup.add(this.velocityValue)
            this.velocity = velocity;
        }
        console.log(this.game.powerUps)
        if(this.game.powerUps.velovityTimeout){
            this.powerUpsGroup.visible="true"
            this.powerUpsGroup.remove(this.powerUpsVelocityValue);
            this.powerUpsVelocityValue = this.font.getWord(((this.game.powerUps.velovityTimeout-Date.now())/1000).toString());
            this.powerUpsVelocityValue.position.set(16, -1, 0);
            this.powerUpsGroup.add(this.powerUpsVelocityValue)
        }
        else if(this.powerUpsGroup.visible){
            this.powerUpsGroup.visible=false
        }

        if(this.game.obstacles.velocityTimeout){
            this.obstaclesGroup.visible=true
            if(!this.obstacleVelocity){
                this.obstacleVelocity = this.font.getWord("Decreased Velocity:");
                this.obstaclesGroup.add(this.obstacleVelocity);
                this.obstacleVelocity.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleVelocityOffset=this.obstaclesOffset;
                this.obstaclesOffset+=1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueVelocity);
            this.obstaclesValueVelocity = this.font.getWord(((this.game.obstacles.velocityTimeout-Date.now())/1000).toString());
            this.obstaclesValueVelocity.position.set(20, -this.obstacleVelocityOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueVelocity)
        }
        else if(this.obstaclesValueVelocity){
            this.obstaclesGroup.remove(this.obstacleVelocity)
            this.obstaclesGroup.remove(this.obstaclesValueVelocity)
            this.obstacleVelocity=null;
            this.obstaclesOffset-=1;
            this.obstaclesValueVelocity=null;
        }
        if(this.game.obstacles.confusedTimeout){
            console.log("asss")
            this.obstaclesGroup.visible=true
            if(this.obstacleConfused == null){
                this.obstacleConfused = this.font.getWord("Confused:");
                this.obstaclesGroup.add(this.obstacleConfused);
                this.obstacleConfused.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleConfusedOffset=this.obstaclesOffset;
                this.obstaclesOffset+=1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueConfused);
            this.obstaclesValueConfused = this.font.getWord(((this.game.obstacles.confusedTimeout-Date.now())/1000).toString());
            this.obstaclesValueConfused.position.set(11, -this.obstacleConfusedOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueConfused)
        }else if(this.obstaclesValueConfused){
            this.obstaclesGroup.remove(this.obstacleConfused)
            this.obstaclesGroup.remove(this.obstaclesValueConfused)
            this.obstacleConfused=null;
            this.obstaclesOffset-=1;
            this.obstaclesValueConfused=null;
        }
        if(this.game.obstacles.slipperyTimeout){
            this.obstaclesGroup.visible=true
            if(!this.obstacleSlippery){
                this.obstacleSlippery = this.font.getWord("Slippery:");
                this.obstaclesGroup.add(this.obstacleSlippery);
                this.obstacleSlippery.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleSlipperyOffset=this.obstaclesOffset;
                this.obstaclesOffset+=1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueSlippery);
            this.obstaclesValueSlippery = this.font.getWord(((this.game.obstacles.slipperyTimeout-Date.now())/1000).toString());
            this.obstaclesValueSlippery.position.set(11, -this.obstacleSlipperyOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueSlippery)
        }
        else if(this.obstaclesValueSlippery){
            this.obstaclesGroup.remove(this.obstacleSlippery)
            this.obstaclesGroup.remove(this.obstaclesValueSlippery)
            this.obstacleSlippery=null;
            this.obstaclesOffset-=1;
            this.obstaclesValueSlippery=null;
        }
        if(this.obstaclesOffset==1 && this.obstaclesGroup.visible){
            this.obstaclesGroup.visible=false
        }
    
    }

    reset(){
        this.camera.remove(this.hudGroup);
        this.camera.remove(this.powerUpsGroup);
        this.camera.remove(this.obstaclesGroup);
    }








}

export { MyDisplay };