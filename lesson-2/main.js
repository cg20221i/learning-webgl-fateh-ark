function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    var vertices = [
        -0.5,0.5,
        0.5,0.5,
        0.5,-0.5,
        -0.5,-0.5,
        0.2,-0.2,
        0.2,0.2,
        -0.2,-0.2,
        -0.35,-0.2,
        -0.35,0.2,
        -0.2,0.2
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // VERTEX SHADER
    var vertexShaderCode = `
        attribute vec2 aPosition;
        uniform float uTheta;

        void main () {
            gl_PointSize = 50.0;
            vec2 position = vec2(aPosition);
            position.x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
            position.y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    // FRAGMENT SHADER
    var fragmentShaderCode = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
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

    var theta = 0.0;
    var uTheta= gl.getUniformLocation(shaderProgram, "uTheta");

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    function render(){
        setTimeout( function() {
            gl.clearColor(0.0, 0.0,   0.0,  1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            theta -= 0.1;
            gl.uniform1f(uTheta,  theta);
            gl.drawArrays(gl.LINE_LOOP, 0, 4);
            gl.drawArrays(gl.POINTS,4,2);
            gl.drawArrays(gl.LINE_STRIP,6,4)
            render();
        }, 1000/60);
    }

    render();
}
