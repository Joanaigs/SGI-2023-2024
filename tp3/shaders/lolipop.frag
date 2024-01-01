varying vec2 vUv;
uniform vec4 color;
uniform sampler2D heightMap;



void main() {
    vec4 height = texture2D(heightMap, vUv);
    float h = height.r;
    vec4 heightcolor = vec4(h, h, h, 1.0);
    vec3 newcolor = mix(color.rgb, heightcolor.rgb, 0.3);

    gl_FragColor = vec4(newcolor, 1.0);
}
