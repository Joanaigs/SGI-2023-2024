
varying vec2 vUv;
uniform sampler2D uSampler;
uniform float time;
uniform vec3 baseColor;
uniform float scale;


void main() {
    float pulsate = sin(time * 2.0) * 0.1 + 0.9;
    vec3 color = baseColor * pulsate;
    vec3 textureColor = texture2D(uSampler, vUv).rgb;
    vec3 finalColor = mix(textureColor, color, scale);
    gl_FragColor = vec4(finalColor, 1.0);
}