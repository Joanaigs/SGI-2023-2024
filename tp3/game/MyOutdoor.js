import * as THREE from 'three';

class MyOutdoor extends THREE.Object3D {
    constructor(app, position) {
        super();
        this.app = app;
        this.pos = position;
        this.captureImages();
        this.animate();
    }

    captureImages() {
        // Remove the existing planes if they exist
        if (this.planeRGB) {
            this.remove(this.planeRGB);
        }
        if (this.planeLGray) {
            this.remove(this.planeLGray);
        }

        this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.renderTarget.depthTexture = new THREE.DepthTexture(window.innerWidth, window.innerHeight);
        this.renderTarget.depthTexture.type = THREE.UnsignedShortType;
       

        // Create a plane with a custom shader material for LGray visualization
        const planeLGrayGeometry = new THREE.PlaneGeometry(40, 40, 200, 200);
        this.lGrayMaterial = new THREE.ShaderMaterial({
            vertexShader: `
            #include <packing>

			varying vec2 vUv;
			uniform sampler2D tDiffuse;
			uniform sampler2D tDepth;
			uniform float cameraNear;
			uniform float cameraFar;


			float readDepth( sampler2D depthSampler, vec2 coord ) {
				float fragCoordZ = texture2D( depthSampler, coord ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			}


			void main() {
                vUv = uv;
    
                // Sample the height map using UV coordinates
                float heightValue = 1.0-readDepth( tDepth, vUv );
            
                // Calculate the offset based on the height value
                vec3 offset = normal * heightValue * 5.0;
            
                // Update the vertex position with the calculated offset
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position + offset, 1.0 );
			}
            `,
            fragmentShader: `
            #include <packing>

			varying vec2 vUv;
			uniform sampler2D tDiffuse;
			uniform sampler2D tDepth;
			uniform float cameraNear;
			uniform float cameraFar;


			float readDepth( sampler2D depthSampler, vec2 coord ) {
				float fragCoordZ = texture2D( depthSampler, coord ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			}

			void main() {
				//vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
				// float depth = readDepth( tDepth, vUv );

				// gl_FragColor.rgb = 1.0 - vec3( depth );
				// gl_FragColor.a = 1.0;
                vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
				gl_FragColor = vec4( diffuse, 1.0 );
			}
            `,
            uniforms: {
                cameraNear: { value: this.app.activeCamera.near },
                cameraFar: { value: 500.0 },
                tDiffuse: { type: 'sampler2D', value: this.renderTarget.texture },
                tDepth: { type: 'sampler2D', value: this.renderTarget.depthTexture }
            }
        });

        this.plane = new THREE.Mesh(planeLGrayGeometry, this.lGrayMaterial);

        // Set the position and rotation of the LGray plane
        this.plane.position.set(this.pos.x + 100, this.pos.y+20, this.pos.z);
        this.plane.rotateY(Math.PI);

        // Add the LGray plane to the scene
        this.add(this.plane);

    }

    animate() {

         // Set the render target for rendering
         this.app.renderer.setRenderTarget(this.renderTarget);

         // Render the scene to the render target
         this.app.renderer.render(this.app.scene, this.app.activeCamera);

         this.lGrayMaterial.uniforms.tDiffuse.value = this.renderTarget.texture;
            this.lGrayMaterial.uniforms.tDepth.value = this.renderTarget.depthTexture;

        // Reset the render target
        this.app.renderer.setRenderTarget(null);

        setTimeout(() => {
            this.animate();
        }, 60000);

        
    }

    update() {
        // Update the rotation of the LGray plane
        this.plane.quaternion.copy(this.app.activeCamera.quaternion);
    }
}

export { MyOutdoor };
