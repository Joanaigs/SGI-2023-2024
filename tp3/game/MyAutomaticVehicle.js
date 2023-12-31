import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';


/**
 *  This class contains the contents of out application
 */
class MyAutomaticVehicle {


    constructor(game, position, target, route, car) {


        this.game = game
        this.mixer = null;
        this.mixerWheel1 = null;
        this.mixerWheel2 = null;
        this.route = route;
        this.clock = new THREE.Clock()
        this.rotation = 0;
        this.rotateScale = 0.3;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1;
        this.animationMaxDuration = -1;
        this.car = car
        this.car.position.set(position.x, position.y, position.z);
        this.car.position.add(target);
        this.game.app.scene.add(this.car);

        this.checkPoints = this.game.checkpoints.getCheckpoints();
        this.checkpointsCount = new Map();
        this.checkPointCollided = false;
        this.lastCheckpoint = null;
        for (let i = 0; i < this.checkPoints.length; i++) {
            this.checkpointsCount.set(this.checkPoints[i], 0);
        }
    }

    start() {
        //this.debugKeyFrames()

        let pointsRoute = []
        let times = []

        for (let i = 0; i < this.route.length; i++) {
            pointsRoute.push(...this.route[i])
            times.push(i)

        }
        console.log(pointsRoute)


        const positionKF = new THREE.VectorKeyframeTrack('.position', times,
            [
                ...pointsRoute
            ],
            THREE.InterpolateSmooth  /* THREE.InterpolateLinear (default), THREE.InterpolateDiscrete,*/
        )

        let quaternionList = [];
        let quaternionListWheel = [];
        const maxRotation = 0.6;
        const minRotation = -0.6;

        for (let i = 0; i < this.route.length; i++) {
            let direction;
            // Calculate the direction vector from the current point to the next point in the route
            if (i === this.route.length - 1) {
                direction = new THREE.Vector3().subVectors(this.route[(i) % this.route.length], this.route[i - 1]).normalize();
            } else {
                direction = new THREE.Vector3().subVectors(this.route[(i + 1) % this.route.length], this.route[i]).normalize();
            }
            // Calculate the quaternion based on the direction
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
            console.log(direction);

            let angle = Math.atan2( direction.x, direction.z);
            console.log(angle)
            if(angle < -Math.PI/2){
                angle = angle + Math.PI
            }
            if(angle > Math.PI/2){
                angle = angle - Math.PI
            }
            //limit angle between -0.6 and 0.6
            if (angle > maxRotation) {
                angle = maxRotation;
            } else if (angle < minRotation) {
                angle = minRotation;
            }
            console.log(angle)
            const quaternionWheel = new THREE.Quaternion();
            quaternionWheel.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            quaternionWheel.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2));

            console.log(quaternionWheel)

            quaternionList.push(...quaternion);
            quaternionListWheel.push(...quaternionWheel);
        }
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', times, quaternionList);
        const quaternionKFWheel = new THREE.QuaternionKeyframeTrack('.quaternion', times, quaternionListWheel);

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])
        const rotationClipWheel = new THREE.AnimationClip('rotationAnimationWheel', this.animationMaxDuration, [quaternionKFWheel])

        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.car)
        console.log(this.car.children[0])
        this.mixerWheel1 = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[0])
        this.mixerWheel2 = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[1])

        console.log(this.car)
        this.mixer.timeScale = 0.6
        this.mixerWheel1.timeScale = 0.6
        this.mixerWheel2.timeScale = 0.6

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)
        const rotationActionWheel1 = this.mixerWheel1.clipAction(rotationClipWheel)
        const rotationActionWheel2 = this.mixerWheel2.clipAction(rotationClipWheel)


        // Play both animations
        positionAction.play()
        rotationAction.play()
        rotationActionWheel1.play()
        rotationActionWheel2.play()
    }

    pause() {
        this.mixer.timeScale = 0
        this.mixerWheel1.timeScale = 0
        this.mixerWheel2.timeScale = 0
    }

    continue() {
        this.mixer.timeScale = 0.6
        this.mixerWheel1.timeScale = 0.6
        this.mixerWheel2.timeScale = 0.6
    }

    debugKeyFrames() {

        let spline = new THREE.CatmullRomCurve3([...this.route])

        // Setup visual control points

        for (let i = 0; i < this.route.length; i++) {
            const geometry = new THREE.SphereGeometry(5, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.route[i])

            this.game.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        this.game.app.scene.add(tubeMesh)
    }

    checkCollisions() {
        // Check collisions with checkpoints
        for (const checkpoint of this.checkPoints) {
            const intersection = this.checkIntersection(this.car, checkpoint);
            if (intersection && this.lastCheckpoint !== checkpoint) {
                let n = this.checkpointsCount.get(checkpoint);
                this.checkpointsCount.set(checkpoint, n + 1);
                this.checkPointCollided = true;
                this.lastCheckpoint = checkpoint;
                this.checkEndGame();
            }
        }

    }

    checkIntersection(object1, object2) {

        // Get the bounding boxes of the two objects
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);

        if (box1.intersectsBox(box2)) {
            return true;
        }
        return false;
    }

    checkEndGame() {
        for (let i = 0; i < this.checkPoints.length; i++) {
            let checkpoint = this.checkPoints[i];
            if (i === 0 && this.checkpointsCount.get(checkpoint) < this.game.numberOfLaps + 1) {
                return false;

            } else if (this.checkpointsCount.get(this.checkPoints[i]) < this.game.numberOfLaps) {
                return false;
            }
        }
        this.game.gameOver = true;
        return true;
    }

    update() {
        let delta = this.clock.getDelta()
        if (this.mixer) {
            this.mixer.update(delta);
        }
        if (this.mixerWheel1) {
            this.mixerWheel1.update(delta);
        }
        if (this.mixerWheel2) {
            this.mixerWheel2.update(delta);
        }


        if (this.game.started || this.game.paused) {
            this.checkCollisions(this.obstacles, this.powerUps);
        }

    }




}

export { MyAutomaticVehicle };