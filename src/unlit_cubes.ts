import * as three from 'three'

export class UnlitCubes {

    meshes:three.InstancedMesh[] = [];

    constructor(cubePos1: three.Vector3, cubePos2: three.Vector3) {
        const matrix = new three.Matrix4();
        const offset = new three.Vector3( 0, 1, 0 );
        

        for (var i = 0; i<20; i++) {
            var cubeGeo = new three.BoxGeometry(20-i, 1, 1);
            var cubeMat = new three.MeshBasicMaterial();
            var cubeMesh = new three.InstancedMesh(cubeGeo, cubeMat, 2);
            this.meshes.push(cubeMesh);

            matrix.setPosition(cubePos1.copy());
            cubePos1.add(offset);
            cubeMesh.setMatrixAt(0, matrix);
            cubeMesh.setColorAt(0, new three.Color(0x6595ED));
        }
    }
}