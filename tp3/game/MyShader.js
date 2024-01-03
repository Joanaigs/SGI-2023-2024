import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyShader {
	constructor(vert_path, frag_path, uniformValues = null) {
		
        this.vert_path = vert_path
        this.frag_path = frag_path
        this.material = null
        this.ready = false
        this.uniformValues = uniformValues
        this.read(vert_path, true)
        this.read(frag_path, false)
    }


    read(theUrl, isVertex) {
        let xmlhttp = null
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        let obj = this
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                
                if (isVertex) { 
                    obj.vertexShader = xmlhttp.responseText 
                }
                else { 
                    obj.fragmentShader = xmlhttp.responseText
                }
                obj.buildShader.bind(obj)()
            }
        }
        xmlhttp.open("GET", theUrl, true)
        xmlhttp.send()
    }

    buildShader() {
        // are both resources loaded? 
        if (this.vertexShader !== undefined && this.fragmentShader !== undefined) {
            // build the shader material
            this.material = new THREE.ShaderMaterial({
                // load uniforms, if any
                uniforms: (this.uniformValues !== null ? this.uniformValues : {}),
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
            }) 
            // report built!
            this.ready = true
        }
        return this.material
    }


    hasUniform(key) {
        return this.uniformValues[key] !== undefined
    }
}
export {MyShader}

