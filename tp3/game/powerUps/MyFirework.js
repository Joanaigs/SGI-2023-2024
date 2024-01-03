import * as THREE from 'three'

class MyFirework {

    constructor(app, scene) {
        this.app = app
        this.scene = scene

        this.done = false
        this.dest = []

        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null

        this.material = new THREE.PointsMaterial({
            size: 0.2,
            color: 0xffffff,
            opacity: 1,
            vertexColors: true,
            transparent: true,
            depthTest: false,
        })

        this.height = 100;
        this.speed = 20;

        this.launch()
        this.gravity=9.8;
        this.timeY=0;

        // -1970, 249, -3000
    }

    /**
     * compute particle launch
     */

    launch() {
        let color = new THREE.Color()
        color.setHSL(THREE.MathUtils.randFloat(0.1, 0.9), 1, 0.9)
        let colors = [color.r, color.g, color.b]
        this.colors = colors

        let x = THREE.MathUtils.randFloat(-1965, -1975);
        let y = THREE.MathUtils.randFloat(this.height * 0.9, this.height * 1.3)
        let z = -3000;
        this.dest.push(x, y, z)
        this.timeRange= (this.dest[1]-y)/30
        //random vertices between 0 and 1 in x and z

        //let vertices = [THREE.MathUtils.randFloat(-5, 5), 0, THREE.MathUtils.randFloat(-5, 5)]
        let vertices = [THREE.MathUtils.randFloat(-1965, -1975), 229 , -3000]
        //let vertices = [THREE.MathUtils.randFloat(-1965, -1975), THREE.MathUtils.randFloat(249, 253), THREE.MathUtils.randFloat(-2990, 3010)];
        this.startPosition = vertices

        this.geometry = new THREE.BufferGeometry()
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.points = new THREE.Points(this.geometry, this.material)
        this.app.scene.add(this.points)
        this.startTime = Date.now();
    }

    /**
     * compute explosion
     * @param {*} vector 
     */
    explode(origin, n, rangeBegin, rangeEnd) {



        let positions = []
        let colors = []

        for (let i = 1; i < n; i++) {
            let anglex = THREE.MathUtils.randFloat(0, 360)
            let angley = THREE.MathUtils.randFloat(0, 360)
            let anglez = THREE.MathUtils.randFloat(0, 360)
            let x = origin[0] + Math.cos(THREE.MathUtils.degToRad(anglex)) * THREE.MathUtils.randFloat(rangeBegin, rangeEnd)
            let y = origin[1] + Math.sin(THREE.MathUtils.degToRad(angley)) * THREE.MathUtils.randFloat(rangeBegin, rangeEnd)
            let z = origin[2] + Math.sin(THREE.MathUtils.degToRad(anglez)) * THREE.MathUtils.randFloat(rangeBegin, rangeEnd)
            this.dest.push(x, y, z)
            positions.push(origin[0], origin[1], origin[2])
            colors.push(this.colors[0], this.colors[1], this.colors[2])
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    }

    /**
     * cleanup
     */
    reset() {
        this.app.scene.remove(this.points)
        this.dest = []
        this.vertices = null
        this.colors = null
        this.geometry = null
        this.points = null
    }

    /**
     * update firework
     * @returns 
     */
    update() {

        // do only if objects exist
        if (this.points && this.geometry) {
            let verticesAtribute = this.geometry.getAttribute('position')
            let vertices = verticesAtribute.array
            let count = verticesAtribute.count

            // balistic trajectory with gravity
            if (count === 1) {
                const currentTime = Date.now();
                const timeElapsed = (currentTime - this.startTime) / 1000; // Convert milliseconds to seconds
                vertices[0] += (this.dest[0] - vertices[0]) / this.speed
                vertices[1] =  this.startPosition[1] + this.speed*timeElapsed - 0.5 * this.gravity * timeElapsed ** 2;
                vertices[2] += (this.dest[2] - vertices[2]) / this.speed
                this.timeY += this.timeRange
            }
            else {
                for (let i = 0; i < vertices.length; i += 3) {
                    vertices[i] += (this.dest[i] - vertices[i]) / this.speed
                    vertices[i + 1] += (this.dest[i + 1] - vertices[i + 1]) / this.speed
                    vertices[i + 2] += (this.dest[i + 2] - vertices[i + 2]) / this.speed
                }
            }
            verticesAtribute.needsUpdate = true

            // only one particle?
            if (count === 1) {
                //is YY coordinate higher close to destination YY? 
                if (Math.ceil(vertices[1]) > (this.dest[1] * 0.95)) {
                    // add n particles departing from the location at (vertices[0], vertices[1], vertices[2])
                    this.explode(vertices, 80, this.height * 0.05, this.height * 0.8)
                    return
                }
            }

            // are there a lot of particles (aka already exploded)?
            if (count > 1) {
                // fade out exploded particles 
                this.material.opacity -= 0.015
                this.material.needsUpdate = true
            }

            // remove, reset and stop animating 
            if (this.material.opacity <= 0) {
                this.reset()
                this.done = true
                return
            }
        }
    }
}

export { MyFirework }

