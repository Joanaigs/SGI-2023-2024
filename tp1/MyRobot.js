import * as THREE from 'three';
import { MyApp } from './MyApp';


/**
 * This class contains a robot representation
 */
export class MyRobot extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     * @param {hex} color the color of the robot
     * @param {list} position the position of the robot
     */
    constructor(app,color, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;
        this.position.set(position[0], position[1], position[2]);

        // Material for the table
        const materialRobot = new THREE.MeshPhongMaterial({ color: this.color });
        this.createRobotHead();
        this.createRobotFace();
        this.createRobotBody();
        this.createRobotLegs();
    }

    createRobotHead(){
        // Head
        const cylinder = new THREE.CylinderGeometry(0.6, 0.6,1, 32, 1, false);
        const halfCylinder = new THREE.Mesh(cylinder, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        halfCylinder.position.set(this.position.x + 10, this.position.y + 5, this.position.z);
        this.add(halfCylinder);
        const sphere = new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI);
        const halfSphere= new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        halfSphere.position.set(halfCylinder.position.x, halfCylinder.position.y + 0.5, halfCylinder.position.z);
        halfSphere.rotateX(-Math.PI / 2);
        this.add(halfSphere);

        // Neck
        const cylinder2 =  new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32, 1, false);
        const topNeck =  new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        topNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.01, halfSphere.position.z);
        this.add(topNeck); 
        const bottomNeck =  new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        bottomNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.3, halfSphere.position.z);
        this.add(bottomNeck); 

        const cylinder3 =  new THREE.CylinderGeometry(0.07, 0.07, 0.5, 32, 1, false);
        const middleNeck =  new THREE.Mesh(cylinder3, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        middleNeck.position.set(halfSphere.position.x, halfSphere.position.y - 1.05, halfSphere.position.z);
        this.add(middleNeck);


        // Antennas
        const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const antenna1 = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32);
        const meshAntenna1 = new THREE.Mesh(antenna1, antennaMaterial);
        meshAntenna1.position.set(halfCylinder.position.x - 0.2, halfCylinder.position.y + 1.2, halfCylinder.position.z);
        meshAntenna1.rotateZ(Math.PI / 4);
        this.add(meshAntenna1);
        
        const antenna2 = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 32);
        const meshAntenna2 = new THREE.Mesh(antenna2, antennaMaterial);
        meshAntenna2.position.set(halfCylinder.position.x + 0.2, halfCylinder.position.y + 1.2, halfCylinder.position.z);
        meshAntenna2.rotateZ(-Math.PI / 4); 
        this.add(meshAntenna2);
    }

    createRobotFace(){

        const glassesMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        // Geometry of half cylinder 
        const halfCylinderShape = new THREE.Shape();
        halfCylinderShape.moveTo(-0.18, 0);
        halfCylinderShape.absarc(0, 0, 0.18, 0, Math.PI, false);

        const extrudeSettings = {
            steps: 32,
            depth: 0.5,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 2,
        };

        // Mouth
        const halfCylinderGeometry = new THREE.ExtrudeGeometry(halfCylinderShape, extrudeSettings);
        const mouth = new THREE.Mesh(halfCylinderGeometry , glassesMaterial);
        mouth.position.set(this.position.x + 10, this.position.y + 4.8, this.position.z - 0.6);
        this.add(mouth);

        // Glasses
        const glasses = new THREE.Mesh(halfCylinderGeometry , glassesMaterial);
        glasses.position.set(this.position.x + 10, this.position.y + 5.3, this.position.z - 0.6);
        glasses.scale.set(2,2.8,2)
        const rectangleGeometry = new THREE.BoxGeometry(0.7, 0.2, 0.1); 
        const glasses2 = new THREE.Mesh(rectangleGeometry, new THREE.MeshPhongMaterial({ color: 0x000000 }))
        glasses2.position.set(this.position.x + 10, this.position.y + 5.2, this.position.z - 0.55);

        this.add(glasses);
        this.add(glasses2);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.08, 32, 32); 
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); 
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(this.position.x + 9.9, this.position.y + 5.4, this.position.z - 0.6);
        rightEye.position.set(this.position.x + 10.1, this.position.y + 5.4, this.position.z - 0.6);

        this.add(leftEye);
        this.add(rightEye);

    }

    createRobotBody(){
        const cylinder = new THREE.CylinderGeometry(0.6, 0.6,0.9, 32, 1, false);
        const chest = new THREE.Mesh(cylinder, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        chest.position.set(this.position.x + 10, this.position.y + 3.7, this.position.z);
        this.add(chest);

        const cylinder2 = new THREE.CylinderGeometry(0.4, 0.4,0.5, 32, 1, false);
        const abdomen = new THREE.Mesh(cylinder2, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        abdomen.position.set(chest.position.x , chest.position.y - 0.6, chest.position.z);
        this.add(abdomen);
        
        // hips
        const hipsGeometry = new THREE.BoxGeometry(1, 0.7, 0.4);
        const hips = new THREE.Mesh(hipsGeometry, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        hips.position.set(abdomen.position.x, abdomen.position.y - 0.5, abdomen.position.z);
        this.add(hips);

        // shoulders
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32); 
        const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 }); 
        const leftSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const rightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        leftSphere.position.set(chest.position.x - 0.7, chest.position.y + 0.2, chest.position.z);
        rightSphere.position.set(chest.position.x + 0.7, chest.position.y + 0.2, chest.position.z);
        this.add(leftSphere);
        this.add(rightSphere);

        // arms 
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 }); 

        const armRadius = 0.1; 
        const armHeight = 1; 
        const armGeometry = new THREE.CylinderGeometry(armRadius, armRadius, armHeight, 32);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(leftSphere.position.x, leftSphere.position.y - 0.4, leftSphere.position.z);
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(rightSphere.position.x, rightSphere.position.y - 0.4, rightSphere.position.z + 0.3);
        leftArm.rotateX(-Math.PI/4);
        this.add(leftArm);
        this.add(rightArm);

        // forearm
        const forearmHeight = 1;
        const forearmGeometry = new THREE.CylinderGeometry(armRadius, armRadius, forearmHeight, 32);

        const leftForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        leftForearm.position.set(leftArm.position.x, leftArm.position.y - 0.7, leftArm.position.z);
        leftForearm.rotateX(Math.PI/4);
        this.add(leftForearm);

        const rightForearm = new THREE.Mesh(forearmGeometry, armMaterial);
        rightForearm.position.set(rightArm.position.x, rightArm.position.y - 0.5, rightArm.position.z - 0.4);
        rightForearm.rotateX(-Math.PI/2);
        this.add(rightForearm);

        // Hands
        const handRadius = 0.15; 
        const handGeometry = new THREE.SphereGeometry(handRadius, 32, 32);
        const handMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const leftHand = new THREE.Mesh(handGeometry, handMaterial);
        leftHand.position.set(leftForearm.position.x, leftForearm.position.y - 0.35, leftForearm.position.z - 0.4);
        this.add(leftHand);

        const rightHand = new THREE.Mesh(handGeometry, handMaterial);
        rightHand.position.set(rightForearm.position.x, rightForearm.position.y, rightForearm.position.z -0.4);
        this.add(rightHand);

        // Elbows
        const elbowRadius = 0.15; 
        const elbowGeometry = new THREE.SphereGeometry(elbowRadius, 32, 32);

        const leftElbow = new THREE.Mesh(elbowGeometry, handMaterial);
        leftElbow.position.set(leftArm.position.x, leftArm.position.y - 0.3, leftArm.position.z + 0.3);
        this.add(leftElbow);

        const rightElbow = new THREE.Mesh(elbowGeometry, handMaterial);
        rightElbow.position.set(rightArm.position.x, rightArm.position.y- 0.4, rightArm.position.z);
        this.add(rightElbow);
    }

    createRobotLegs() {
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const legMaterial2 = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
        // Create leg
        const leg = new THREE.CylinderGeometry(0.2, 0.18, 1, 32);
        const meshLeftLeg = new THREE.Mesh(leg, legMaterial);
        meshLeftLeg.position.set(this.position.x + 10.25, this.position.y + 2.5, this.position.z - 0.5);
        meshLeftLeg.rotateX(-Math.PI/2);
        this.add(meshLeftLeg);

        const meshRightLeg = new THREE.Mesh(leg, legMaterial);
        meshRightLeg.position.set(this.position.x + 9.75, this.position.y + 2.5, this.position.z - 0.5);
        meshRightLeg.rotateX(-Math.PI/2);
        this.add(meshRightLeg);

        // Create joints
        const jointGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const meshJointLeft = new THREE.Mesh(jointGeometry, legMaterial2);
        meshJointLeft.position.set(this.position.x + 10.25, this.position.y + 2.5, this.position.z - 1.1);
        this.add(meshJointLeft);

        const meshJointRight = new THREE.Mesh(jointGeometry, legMaterial2);
        meshJointRight.position.set(this.position.x + 9.75, this.position.y + 2.5, this.position.z - 1.1);
        this.add(meshJointRight);

        // Create ankles
        const ankle = new THREE.CylinderGeometry(0.2, 0.18, 1.8, 32);
        const meshLeftAnkle = new THREE.Mesh(ankle, legMaterial);
        meshLeftAnkle.position.set(this.position.x + 10.25, this.position.y + 1.6, this.position.z - 1.1);
        this.add(meshLeftAnkle);

        const meshRightAnkle = new THREE.Mesh(ankle, legMaterial);
        meshRightAnkle.position.set(this.position.x + 9.75, this.position.y + 1.6, this.position.z - 1.1);
        this.add(meshRightAnkle);

        // Create feet
        const footShape = new THREE.Shape();
        footShape.moveTo(-0.18, 0);
        footShape.absarc(0, 0, 0.18, 0, Math.PI, false);

        const extrudeSettings = {
            depth: 0.5,
            bevelEnabled: false,
            bevelThickness: 0.2,
            bevelSize: 0.1,
            bevelSegments: 1,
        };

        const footGeometry = new THREE.ExtrudeGeometry(footShape, extrudeSettings);
        const meshLeftFoot = new THREE.Mesh(footGeometry, legMaterial2);
        meshLeftFoot.position.set(this.position.x + 10.25, this.position.y + 0.6, this.position.z - 1.4);
        this.add(meshLeftFoot);

        const meshRightFoot = new THREE.Mesh(footGeometry, legMaterial2);
        meshRightFoot.position.set(this.position.x + 9.75, this.position.y + 0.6, this.position.z - 1.4);
        this.add(meshRightFoot);

    }
}

MyRobot.prototype.isGroup = true;
