import * as THREE from 'three';


/**
 * This class contains a Table representation
 */
export class MyTable extends THREE.Object3D {
    constructor(app, topLength, topWidth, legHeight, color, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.topLength = topLength;
        this.topWidth = topWidth;
        this.legHeight = legHeight;
        this.color = color;

        // Material for the table
        const materialWood = new THREE.MeshBasicMaterial({ color: this.color });
        
        this.createTableTop(materialWood)
        this.createTableLegs(materialWood);
    }

    createTableLegs(materialWood){
        const legPositions = [
            [-(this.topLength / 2), -(this.topWidth / 2)],
            [-(this.topLength / 2), this.topWidth / 2 ],
            [this.topLength / 2, -(this.topWidth / 2)],
            [this.topLength / 2, this.topWidth / 2],
        ];

        for (const [legX, legY] of legPositions) {
            const geometryLeg = new THREE.CylinderGeometry(0.2, 0.05, this.legHeight, 32);
            const tableLeg = new THREE.Mesh(geometryLeg, materialWood);
            tableLeg.position.set(
                this.position.x + legX,
                this.legHeight / 2,
                this.position.z + legY
            );
            this.add(tableLeg);
        }
    }

    createTableTop(materialWood){
        const geometryTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.1);
        const tableTop = new THREE.Mesh(geometryTop, materialWood);
        tableTop.position.set(this.position.x, this.legHeight, this.position.z + 0.05);
        tableTop.rotateX(-Math.PI / 2);
        this.add(tableTop);
    }
    
}

MyTable.prototype.isGroup = true;
