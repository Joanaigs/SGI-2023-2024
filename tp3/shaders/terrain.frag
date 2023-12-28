varying vec2 vUv;
uniform sampler2D terrain;


void main() {
    // Sample the color from the terrain texture
    vec3 terrainColor = texture2D(terrain, vUv).rgb;

    gl_FragColor = vec4(terrainColor, 1.0);
}
