import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyAutomaticVehicle {


    constructor(game, position, target, route, car, timeScale = 0.6) {


        this.game = game
        this.mixer = null;
        this.mixerWheel1 = null;
        this.mixerWheel2 = null;
        this.mixerWheel1RotX = null;
        this.mixerWheel2RotX = null;
        this.timeInPaused = 0;
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
        this.animations = [];
        this.timeScale = timeScale;
    }

    start() {
        //this.debugKeyFrames()

        let pointsRoute = []
        let times = []

        for (let i = 0; i < this.route.length; i++) {
            pointsRoute.push(...this.route[i])
            times.push(i)

        }


        const positionKF = new THREE.VectorKeyframeTrack('.position', times,
            [
                ...pointsRoute
            ],
            THREE.InterpolateSmooth  /* THREE.InterpolateLinear (default), THREE.InterpolateDiscrete,*/
        )

        let quaternionList = [];
        let quaternionListWheel = [];
        const xAxis = new THREE.Vector3(0, 1, 0)
        let rotationListWheelX = [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, 0)),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, -Math.PI / 2)),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI)),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI / 2)),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, 0)),];
        let rotationTimes = [0, 1, 2, 3, 4];

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

            let angle = Math.atan2(direction.x, direction.z);
            if (angle < -Math.PI / 2) {
                angle = angle + Math.PI
            }
            if (angle > Math.PI / 2) {
                angle = angle - Math.PI
            }
            //limit angle between -0.6 and 0.6
            if (angle > maxRotation) {
                angle = maxRotation;
            } else if (angle < minRotation) {
                angle = minRotation;
            }
            const quaternionWheel = new THREE.Quaternion();
            quaternionWheel.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            quaternionWheel.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2));


            quaternionList.push(...quaternion);
            quaternionListWheel.push(...quaternionWheel);
        }
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', times, quaternionList);
        const quaternionKFWheel = new THREE.QuaternionKeyframeTrack('.quaternion', times, quaternionListWheel);
        const quaternionKFWheelX = new THREE.QuaternionKeyframeTrack('.quaternion', rotationTimes, rotationListWheelX);

        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])
        const rotationClipWheel = new THREE.AnimationClip('rotationAnimationWheel', this.animationMaxDuration, [quaternionKFWheel])
        const rotationClipWheelX = new THREE.AnimationClip('rotationAnimationWheelX', this.animationMaxDuration, [quaternionKFWheelX])

        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.car)
        this.mixerWheel1 = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[0])
        this.mixerWheel1RotX = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[0])
        this.mixerWheel2 = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[1])
        this.mixerWheel2RotX = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[1])
        this.mixerWheel3RotX = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[2])
        this.mixerWheel4RotX = new THREE.AnimationMixer(this.car.children[0].wheelsGroup.children[3])

        this.mixer.timeScale = this.timeScale
        this.mixerWheel1.timeScale = this.timeScale
        this.mixerWheel2.timeScale = this.timeScale
        this.mixerWheel1RotX.timeScale = this.timeScale * 10
        this.mixerWheel2RotX.timeScale = this.timeScale * 10
        this.mixerWheel3RotX.timeScale = this.timeScale * 10
        this.mixerWheel4RotX.timeScale = this.timeScale * 10

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)
        const rotationActionWheel1X = this.mixerWheel1RotX.clipAction(rotationClipWheelX)
        const rotationActionWheel1 = this.mixerWheel1.clipAction(rotationClipWheel)
        const rotationActionWheel2X = this.mixerWheel2RotX.clipAction(rotationClipWheelX)
        const rotationActionWheel2 = this.mixerWheel2.clipAction(rotationClipWheel)
        const rotationActionWheel3X = this.mixerWheel3RotX.clipAction(rotationClipWheelX)
        const rotationActionWheel4X = this.mixerWheel4RotX.clipAction(rotationClipWheelX)
        this.animations.push(positionAction);
        this.animations.push(rotationAction);
        this.animations.push(rotationActionWheel1X);
        this.animations.push(rotationActionWheel1);
        this.animations.push(rotationActionWheel2X);
        this.animations.push(rotationActionWheel2);
        this.animations.push(rotationActionWheel3X);
        this.animations.push(rotationActionWheel4X);



        for (let i = 0; i < this.animations.length; i++) {
            this.animations[i].play();
        }
        this.startTime = Date.now();

    }

    pause() {
        this.mixer.timeScale = 0
        this.mixerWheel1.timeScale = 0
        this.mixerWheel2.timeScale = 0
        this.mixerWheel1RotX.timeScale = 0
        this.mixerWheel2RotX.timeScale = 0
        this.pausedTime = Date.now()
    }

    continue() {
        this.mixer.timeScale = this.timeScale
        this.mixerWheel1.timeScale = this.timeScale
        this.mixerWheel2.timeScale = this.timeScale
        this.mixerWheel1RotX.timeScale = this.timeScale * 10
        this.mixerWheel2RotX.timeScale = this.timeScale * 10
        this.timeInPaused += Date.now() - this.pausedTime
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
        this.gameOver = true;
        this.gameTime = Date.now() - this.startTime - this.timeInPaused;
        this.mixer.timeScale = 0
        this.mixerWheel1.timeScale = 0
        this.mixerWheel2.timeScale = 0
        this.mixerWheel1RotX.timeScale = 0
        this.mixerWheel2RotX.timeScale = 0

        return true;
    }

    update() {
        if (!this.gameOver) {
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
            if (this.mixerWheel1RotX) {
                this.mixerWheel1RotX.update(delta);
            }
            if (this.mixerWheel2RotX) {
                this.mixerWheel2RotX.update(delta);
            }
            if (this.mixerWheel3RotX) {
                this.mixerWheel3RotX.update(delta);
            }
            if (this.mixerWheel4RotX) {
                this.mixerWheel4RotX.update(delta);
            }


            if (this.game.started && !this.game.paused) {
                this.checkCollisions(this.obstacles, this.powerUps);
            }

        }

    }




}

export { MyAutomaticVehicle };