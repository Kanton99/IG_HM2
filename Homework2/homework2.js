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
    camera.fovy = 90;
    camera.aspect = canvas.width/canvas.height;
    camera.near = 0.1;
    camera.far = 100;
    camera.position= vec3(0,0,-4);
    //camera.rotate(vec3(1,0,0),45);
    var boxSize = 5;
    //camera.projectionMatrix = ortho(-boxSize,boxSize,-boxSize,boxSize,-boxSize,boxSize);

    Torso = new Entity(gl,program);
    Torso.mesh = new Cube(gl,program);
    Torso.mesh._color = vec4(1,0,0,1);
    Torso.mesh.position = vec3(0,0.5,0);
    //Torso.addChild(leftArm);
    render();
}


function render() {
        camera.render();
        Torso.rotate(vec3(0,1,0),1);
        Torso.render(gl,program);
        requestAnimationFrame(render);
}
