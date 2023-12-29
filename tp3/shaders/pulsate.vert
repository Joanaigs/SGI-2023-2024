uniform float time;
varying vec2 vUv;


void main() {
    vUv = uv;
    float pulse = 0.9 + 0.1 * sin( time );
    vec4 modelViewPosition = modelViewMatrix * vec4( position * pulse, 1.0 );
    gl_Position = projectionMatrix * modelViewPosition;
}