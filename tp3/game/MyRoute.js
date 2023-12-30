import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyRoute {


    constructor(scale, position) {
        let i=scale;
        this.route1 = [
            new THREE.Vector3(7.8*i, 0, i*5), //start
            new THREE.Vector3(8*i, 0, i*7),
            new THREE.Vector3(8*i, 0, i*9),
            new THREE.Vector3(8*i, 0, i*12),
            new THREE.Vector3(8*i, 0, i*13),
            new THREE.Vector3(7*i, 0, i*13.5),
            new THREE.Vector3(5.5*i, 0, i*12),
            new THREE.Vector3(5*i, 0, i*10),
            new THREE.Vector3(4*i, 0, i*9.8),
            new THREE.Vector3(3*i, 0, i*10),
            new THREE.Vector3(3*i, 0, i*12),
            new THREE.Vector3(3*i, 0, i*14),
            new THREE.Vector3(3*i, 0, i*15),
            new THREE.Vector3(1.5*i, 0, i*16),
            new THREE.Vector3(0*i, 0, i*15),
            new THREE.Vector3(-0.5*i, 0, i*13),
            new THREE.Vector3(-0.5*i, 0, i*11),
            new THREE.Vector3(-0.5*i, 0, i*9),
            new THREE.Vector3(0*i, 0, i*6),
            new THREE.Vector3(2*i, 0, i*5),
            new THREE.Vector3(4*i, 0, i*6),
            new THREE.Vector3(5*i, 0, i*4.5),
            new THREE.Vector3(4*i, 0, i*3),
            new THREE.Vector3(2*i, 0, i*2.5),
            new THREE.Vector3(0, 0, i*2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2*i, 0, 0),
            new THREE.Vector3(4*i, 0, 0.5*i),
            new THREE.Vector3(6*i, 0, i*1),
            new THREE.Vector3(8*i, 0, i*2),
            new THREE.Vector3(7.8*i, 0, i*5), //start


        ]
        this.route2 = [
            new THREE.Vector3(7.8*i, 0, i*5), //start
            new THREE.Vector3(7.7*i, 0, i*7),
            new THREE.Vector3(7.7*i, 0, i*9),
            new THREE.Vector3(8.2*i, 0, i*12),
            new THREE.Vector3(8*i, 0, i*13),
            new THREE.Vector3(7*i, 0, i*13.3),
            new THREE.Vector3(5.8*i, 0, i*12),
            new THREE.Vector3(5*i, 0, i*9.7),
            new THREE.Vector3(4*i, 0, i*9.3),
            new THREE.Vector3(3*i, 0, i*10),
            new THREE.Vector3(3.2*i, 0, i*12),
            new THREE.Vector3(3.4*i, 0, i*14),
            new THREE.Vector3(3.1*i, 0, i*15),
            new THREE.Vector3(1.5*i, 0, i*15.8),
            new THREE.Vector3(0.3*i, 0, i*15),
            new THREE.Vector3(-0.7*i, 0, i*13),
            new THREE.Vector3(-0.5*i, 0, i*11),
            new THREE.Vector3(-0.5*i, 0, i*9),
            new THREE.Vector3(0.3*i, 0, i*6),
            new THREE.Vector3(2*i, 0, i*4.8),
            new THREE.Vector3(4*i, 0, i*6.2),
            new THREE.Vector3(4.8*i, 0, i*4.5),
            new THREE.Vector3(4*i, 0, i*2.8),
            new THREE.Vector3(2*i, 0, i*2.5),
            new THREE.Vector3(0, 0, i*1.8),
            new THREE.Vector3(0.1*i, 0, 0.1*i),
            new THREE.Vector3(2*i, 0, 0.2*i),
            new THREE.Vector3(4*i, 0, 0.5*i),
            new THREE.Vector3(6*i, 0, i*1),
            new THREE.Vector3(8.3*i, 0, i*2),
            new THREE.Vector3(7.8*i, 0, i*5), //start


        ]
        this.route3 = [
            new THREE.Vector3(7.8*i, 0, i*5), //start
            new THREE.Vector3(8.2*i, 0, i*7),
            new THREE.Vector3(8.2*i, 0, i*9),
            new THREE.Vector3(8.2*i, 0, i*12),
            new THREE.Vector3(8*i, 0, i*13),
            new THREE.Vector3(7*i, 0, i*13.5),
            new THREE.Vector3(5.5*i, 0, i*12),
            new THREE.Vector3(5*i, 0, i*10),
            new THREE.Vector3(4*i, 0, i*9.8),
            new THREE.Vector3(3*i, 0, i*10),
            new THREE.Vector3(3*i, 0, i*12),
            new THREE.Vector3(3*i, 0, i*14),
            new THREE.Vector3(3*i, 0, i*15),
            new THREE.Vector3(1.5*i, 0, i*16),
            new THREE.Vector3(0*i, 0, i*15),
            new THREE.Vector3(-0.5*i, 0, i*13),
            new THREE.Vector3(-0.5*i, 0, i*11),
            new THREE.Vector3(-0.5*i, 0, i*9),
            new THREE.Vector3(0*i, 0, i*6),
            new THREE.Vector3(2*i, 0, i*5),
            new THREE.Vector3(4*i, 0, i*6),
            new THREE.Vector3(5*i, 0, i*4.5),
            new THREE.Vector3(4*i, 0, i*3),
            new THREE.Vector3(2*i, 0, i*2.5),
            new THREE.Vector3(0, 0, i*2),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2*i, 0, 0),
            new THREE.Vector3(4*i, 0, 0.5*i),
            new THREE.Vector3(6*i, 0, i*1),
            new THREE.Vector3(8*i, 0, i*2),
            new THREE.Vector3(7.8*i, 0, i*5), //start


        ]
        for(let i=0;i<this.route1.length;i++){
            this.route1[i].add(position);
            this.route2[i].add(position);
            this.route3[i].add(position);
        }
    }

    getRoutes (indice) {
        switch (indice) {
            case 1:
                return this.route1;
            case 2:
                return this.route2;
            case 3:
                return this.route3;
            default:
                return this.route1;
        }
    }

    

    
}

export { MyRoute };