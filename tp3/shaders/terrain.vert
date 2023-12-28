uniform float time;
varying vec2 vUv;
uniform sampler2D heightMap;


void main() {
    vUv = uv;
    
    // Sample the height map using UV coordinates
    float heightValue = texture2D( heightMap, uv ).r;

    // Calculate the offset based on the height value
    vec3 offset = normal * heightValue * 50.0;

    // Update the vertex position with the calculated offset
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position + offset, 1.0 );
}