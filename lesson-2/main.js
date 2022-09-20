function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    var vertices = [
        -2.0,0.5, 1.0, 1.0, 0.0,
        0.5,0.5, 0.0, 1.0, 1.0,
        0.5,-0.5, 0.0, 1.0, 0.0,
        -2.0,-0.5, 1.0, 0.0, 0.0,

        0.2,-0.2, 1.0, 1.0, 1.0,
        0.2,0.2, 1.0, 1.0, 1.0,

        -0.2,-0.2, 1.0, 1.0, 1.0,
        -0.35,-0.2, 1.0, 1.0, 1.0,
        -0.35,0.2, 1.0, 1.0, 1.0,
        -0.2,0.2, 1.0, 1.0, 1.0
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // VERTEX SHADER
    var vertexShaderCode = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        uniform float uTheta;
        varying vec3 vColor;

        void main () {
            gl_PointSize = 50.0;
            vec2 position = vec2(aPosition);
            position.x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
            position.y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x;
            gl_Position = vec4(position, 0.0, 1.0);
            vColor = aColor;
        }
    `;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    // FRAGMENT SHADER
    var fragmentShaderCode = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor,1.0);
        }
    `;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);


    var toggle1 = false;
    function onMouseClick (event){
        toggle1 = !toggle1
    }

    document.addEventListener("pointerdown",onMouseClick);
    document.addEventListener("pointerup",onMouseClick);

    var theta = 0.0;
    var left = true;
    var uTheta= gl.getUniformLocation(shaderProgram, "uTheta");

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    var aColor = gl.getAttribLocation(shaderProgram,"aColor");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aColor,3,gl.FLOAT,false,5 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    function render(){
        setTimeout( function() {
            gl.clearColor(0.0, 0.0,   0.0,  1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            //funne rotation
            if(left){
                theta -= 0.05
                if(theta < -2.0){
                    left = false
                }
            }else{
                theta += 0.01
                if(theta > 2.0){
                    left = true
                }
            }

            gl.uniform1f(uTheta,  theta);
            if(toggle1){
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                gl.drawArrays(gl.TRIANGLE_STRIP,6,4)
            }else{
                gl.drawArrays(gl.LINE_LOOP, 0, 4);
                gl.drawArrays(gl.LINE_STRIP,6,4)
            }
            gl.drawArrays(gl.POINTS,4,2);
            render();
        }, 1000/60);
    }

    render();
}
