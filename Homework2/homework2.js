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

var world;
var kangaroo;
var torso;
var leftArm;
var leftForeArm;
var rightArm;
var rightForeArm;


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
    camera.fovy = 60;
    camera.aspect = canvas.width/canvas.height;
    camera.near = 0.1;
    camera.far = 100;
    camera.position= vec3(0,4,0);
    camera.rotate(vec3(1,0,0),90);
    camera._perspective = false;

    world = new Entity(gl, program);
//Build kangaroo
    {//Build kangaroo
        kangaroo = new Entity(gl, program);
        {//torso
            torso = new Entity(gl,program);
            torso.mesh = new Cube(gl,program);
            torso.mesh._color = vec4(1,0,0,1);
            torso.mesh.position = vec3(0,-1,0);
            torso.mesh.scale = vec3(0.5,1,0.2);
            kangaroo.addChild(torso);
        }
        {//Left Arm
            leftArm = new Entity(gl, program);
            leftArm.position = vec3(3.5,0,0);
            leftArm.mesh = new Cube(gl,program);
            leftArm.mesh._color = vec4(0,0,1,1);
            leftArm.mesh.position = vec3(0,-0.5,0);
            leftArm.mesh.scale = vec3(0.2,0.5,0.2);
            torso.addChild(leftArm);
            
            {//Left ForeArm
                leftForeArm = new Entity(gl,program);
                leftForeArm.mesh = new Cube(gl,program);
                leftForeArm.mesh._color = vec4(0,1,0,1);
                leftForeArm.position = vec3(0,-0.94,0);
                leftForeArm.mesh.position = vec3(0,-1.01,0);
                leftForeArm.mesh.scale = vec3(0.2,0.5,0.2);
                //leftForeArm.rotate(vec3(1,0,0),45);
                leftArm.addChild(leftForeArm);
            }
        }
        {//right Arm
            rightArm = new Entity(gl, program);
            rightArm.position = vec3(-3.5,0,0);
            rightArm.mesh = new Cube(gl,program);
            rightArm.mesh._color = vec4(0,0,1,1);
            rightArm.mesh.position = vec3(0,-0.5,0);
            rightArm.mesh.scale = vec3(0.2,0.5,0.2);
            torso.addChild(rightArm);
            
            {//right ForeArm
                rightForeArm = new Entity(gl,program);
                rightForeArm.mesh = new Cube(gl,program);
                rightForeArm.mesh._color = vec4(0,1,0,1);
                rightForeArm.position = vec3(0,-0.94,0);
                rightForeArm.mesh.position = vec3(0,-1.01,0);
                rightForeArm.mesh.scale = vec3(0.2,0.5,0.2);
                //rightForeArm.rotate(vec3(1,0,0),45);
                rightArm.addChild(rightForeArm);
            }
        }
    }
    world.addChild(kangaroo);
    render();
}


function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        camera.render();
        kangaroo.rotate(vec3(0,1,0),1);
        world.render(gl,program);
        //leftArm.rotate(vec3(1,0,0),1);
        requestAnimationFrame(render);
}
