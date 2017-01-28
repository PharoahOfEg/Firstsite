/// <reference path="sylvester.src.js" />
/// <reference path="glUtils.js" />

var Object3D = function (options) {
    /// <field name='gl' type='WebGLRenderingContext'>gl context</field> 
    options = options || {};
    this.gl = options.gl || document.getElementById("gl").getContext("webgl");
    this.program = options.program|| new ShaderProgram(this.gl,"vShader","fShader");
    this.vertcies = options.vertcies || [];
    this.color = options.color || [1, 1, 1, 1];
    this.gl.useProgram(this.program);
    this.childs = [];
    var mVMatrix = Matrix.I(4);
    var pMatrix = Matrix.I(4);
    var mVMatrixUniform = this.program.getUniform("mVMatrix");
    var pMatrixUniform = this.program.getUniform("pMatrix");
    var verticesAttributeLocation = this.program.getAttribute("pos");
    var vBuffer = new Buffer(this.gl, this.vertcies);
    this.add=function(obj){
        this.childs[length] = obj;
        console.log(this.childs.length)
    }
    this.translate = function (v) {
        /// <param name="v" Type="Vector">
        mVMatrix = mVMatrix.multiply(Matrix.Translation(v).ensure4x4()).ensure4x4();
        for (var i = 0; i < this.childs.length; i++) {
            this.childs.translate(v);
        }
    }
    this.rotate = function (x,y,z) {

        mVMatrix = mVMatrix.multiply(Matrix.RotationX(x).ensure4x4());
        mVMatrix = mVMatrix.multiply(Matrix.RotationY(y).ensure4x4());
        mVMatrix = mVMatrix.multiply(Matrix.RotationZ(z).ensure4x4());
        for (var i = 0; i < this.childs.length; i++) {
            console.log(this.childs)
        }
    }
    this.draw = function (camera) {
        camera = camera || pMatrix;
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(mVMatrixUniform, false, new Float32Array(mVMatrix.flatten()));
        this.gl.uniformMatrix4fv(pMatrixUniform, false, new Float32Array(camera.flatten()));
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        this.gl.vertexAttribPointer(verticesAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertcies.length / 3);
        for (var i = 0; i < this.childs.length; i++) {
            this.childs[i].draw(camera);
        }

    }

}



//2
function Shader(gl, shaderID, type) {
    ///<param name="gl" type="WebGLRenderingContext">
    var element = document.getElementById(shaderID);
    if (!element) {
        alert("no element");
        return null;
    }
    var shader = gl.createShader(type); //gl.VERTEX_SHADER; gl.FRAGMENT_SHADER;
    gl.shaderSource(shader, element.innerText);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("shader error:" + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

//3 Program
function ShaderProgram(gl, vsID, fsID) {
    ///<param name="gl" type="WebGLRenderingContext">
    vShader = new Shader(gl, vsID, gl.VERTEX_SHADER);
    fShader = new Shader(gl, fsID, gl.FRAGMENT_SHADER);

    var _program = gl.createProgram();
    gl.attachShader(_program, vShader);
    gl.attachShader(_program, fShader);
    gl.linkProgram(_program);
    if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
        alert("error");
        return null;
    }
    _program.getAttribute = function (attribName) {
        var attrib = gl.getAttribLocation(_program, attribName);
        gl.enableVertexAttribArray(attrib);
        return attrib;
    }
    _program.getUniform = function (uniform) {
        var uniform = gl.getUniformLocation(_program, uniform);
        return uniform;
    }
    return _program;
}

function Buffer(gl, vertices) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    console.log(vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
}