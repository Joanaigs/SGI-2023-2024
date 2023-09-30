import * as THREE from 'three';


/**
 * This class contains a Table representation
 */
export class MyTable extends THREE.Object3D {
    constructor(app, topLength, topWidth, legHeight, color, topColor, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.topLength = topLength;
        this.topWidth = topWidth;
        this.legHeight = legHeight;
        this.color = color;
        this.topColor = topColor;

        this.position.set(position[0], position[1], position[2]);

        // Material for the table
        const materialWood = new THREE.MeshBasicMaterial({ color: this.color });
        const materialThin = new THREE.MeshBasicMaterial({ color: this.topColor });


        this.createTableTop(materialWood, materialThin);
        this.createTableLegs(materialWood);

    }

    createTableLegs(materialWood){
        const legPositions = [
            [-(this.topLength / 2) +0.3, -(this.topWidth / 2) +0.3],
            [-(this.topLength / 2) +0.3, this.topWidth / 2 -0.3 ],
            [this.topLength / 2 -0.3, -(this.topWidth / 2) +0.3],
            [this.topLength / 2 -0.3, this.topWidth / 2 -0.3],
        ];

        for (const [legX, legZ] of legPositions) {
            const geometryLeg = new THREE.CylinderGeometry(0.2, 0.05, this.legHeight, 32);
            const tableLeg = new THREE.Mesh(geometryLeg, materialWood);
            tableLeg.position.set(
                this.position.x + legX,
                this.legHeight / 2,
                this.position.z + legZ
            );
            this.add(tableLeg);
        }
    }

    createTableTop(materialWood, materialThin){
        const geometryTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.2);
        const tableTop = new THREE.Mesh(geometryTop, materialWood);
        tableTop.position.set(this.position.x, this.legHeight - 0.15, this.position.z + 0.05);
        tableTop.rotateX(-Math.PI / 2);
        this.add(tableTop);

        const geometryThinTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.1);
        const thinTop = new THREE.Mesh(geometryThinTop, materialThin);
        thinTop.position.set(this.position.x, this.legHeight, this.position.z + 0.05);
        thinTop.rotateX(-Math.PI / 2);
        this.add(thinTop);
        
    }
    
}

MyTable.prototype.isGroup = true;
