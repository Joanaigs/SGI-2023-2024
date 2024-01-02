varying vec2 vUv;
uniform float time;
uniform vec3 baseColor; 

void main() {
    // Define a pulsating factor using the sine function
    float pulsate = sin(time * 2.0) * 0.1 + 0.9;

    // Create a color with varying intensity based on the pulsate factor
    vec3 color = baseColor * pulsate;

    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}
