"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var modelViewMatrixLoc;

var modelViewLoc;

var pointsArray = [];

var camera;

var Torso;
var leftArm;


init();

//--------------------------------------------


function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);
    gl.enable(gl.DEPTH_TEST);

    camera = new Camera(gl,program);
    camera.fovy = 45;
    camera.aspect = canvas.width/canvas.height;
    camera.near = 0.1;
    camera.far = 100;
    camera.position= vec3(0,0,-10);
    //camera.rotate(vec3(1,0,0),45);
    var boxSize = 5;
    //camera.projectionMatrix = ortho(-boxSize,boxSize,-boxSize,boxSize,-boxSize,boxSize);

    Torso = new Entity(gl,program);
    Torso.mesh = new Cube(gl,program);
    Torso.mesh._color = vec4(1,0,0,1);
    Torso.mesh.position = vec3(0,0.5,0);
    Torso.mesh.scale = vec3(0.5,1,0.3);

    leftArm = new Entity(gl, program);
    leftArm.mesh = new Cube(gl,program,0.4,1,0.4);
    leftArm.mesh._color = vec4(0,0,1,1);
    Torso.addChild(leftArm);
    leftArm.position = vec3(3,1,0);
    leftArm.mesh.position = vec3(0,-0.5,0);
    render();
}


function render() {
        camera.render();
        Torso.rotate(vec3(0,1,0),1);
        Torso.render(gl,program);
        leftArm.rotate(vec3(1,0,0),1);
        requestAnimationFrame(render);
}
