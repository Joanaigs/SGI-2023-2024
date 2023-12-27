
varying vec2 vUv;
uniform sampler2D uSampler;
uniform float time;


void main() {
    float pulsate = sin(time * 2.0) * 0.1 + 0.9;
    gl_FragColor = texture2D(uSampler, vUv) * pulsate;
}