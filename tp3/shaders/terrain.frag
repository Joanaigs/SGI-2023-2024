varying vec2 vUv;
uniform sampler2D terrain;


void main() {
    // Sample the color from the terrain texture
    vec3 terrainColor = texture2D(terrain, vUv).rgb;
    vec3 finalColor = mix(vec3(0.59, 0.24, 0.62), terrainColor, 0.7);

    gl_FragColor = vec4(finalColor, 1.0);
}
