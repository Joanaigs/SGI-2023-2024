import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';


/**
 *  This class contains the contents of out application
 */
class MyAutomaticVehicle {


    constructor(game, position, target, route) {


        this.game = game
        this.mixer = null;
        this.route = route;
        this.clock = new THREE.Clock()
        this.rotation = 0;
        this.rotateScale = 0.3;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1;
        this.animationMaxDuration = 2000;
        this.car = new MyVehicleObject();
        this.car.position.set(position.x, position.y, position.z);
        this.car.position.add(target);
        this.game.app.scene.add(this.car);
    }

    start() {
        this.debugKeyFrames()

        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })


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

        let quaternionList = []
        for (let i = 0; i < this.route.length; i++) {
             // Calculate the direction vector from the current point to the next point in the route
             const direction = new THREE.Vector3().subVectors(this.route[(i + 1) % this.route.length], this.route[i]).normalize();

             // Calculate the quaternion based on the direction
             const quaternion = new THREE.Quaternion();
             quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
 
             // Add the quaternion to the list
             quaternionList.push(...quaternion);
        }
        console.log(quaternionList)
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', times, quaternionList);




        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])

        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.car)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)


        // Play both animations
        positionAction.play()
        rotationAction.play()
    }

    debugKeyFrames() {

        let spline = new THREE.CatmullRomCurve3([...this.route])

        // Setup visual control points

        for (let i = 0; i < this.route.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
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

    update() {
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }
    }

    findNextPointOnRoute(position, route) {
        let nextPointIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < route.length; i++) {
            const distance = position.distanceTo(route[i]);
            if (distance < minDistance) {
                nextPointIndex = i;
                minDistance = distance;
            }
        }

        // Move to the next point (use modulo to wrap around to the start if at the end)
        return (nextPointIndex + 1) % route.length;
    }




}

export { MyAutomaticVehicle };