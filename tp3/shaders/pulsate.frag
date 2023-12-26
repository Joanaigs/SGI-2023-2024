uniform float time;
varying vec2 vUv;

void main() {
    float pulsate = 0.5 + 0.5 * sin(time);
    gl_FragColor = vec4(vec3(pulsate), 1.0);
}