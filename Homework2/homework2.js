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

var legs;
var leftLeg1;
var leftLeg2;
var leftLeg3;

var rightLeg1;
var rightLeg2;
var rightLeg3;

var head;

var tail;

var mousePos = vec2();
var mouseDir;
var trakMouse = false;
var mouseIn = false;
var rect;

var deltaTime;

init();

//--------------------------------------------


function init() {

    canvas = document.getElementById( "gl-canvas" );
    rect  = canvas.getBoundingClientRect();
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
    camera.position= vec3(0,-0,-50);
    camera.rotate(vec3(1,0,0),-45);
    //camera._perspective = false;

    world = new Entity(gl, program);
    {//Build kangaroo
        kangaroo = new Entity(gl, program);
        {//torso
            torso = new Entity(gl,program);
            torso.mesh = new Cube(gl,program);
            torso.mesh._color = vec4(1,0,0,1);
            torso.mesh.position = vec3(0,-1,0);
            torso.mesh.scale = vec3(0.5,1,0.2);
            torso.rotate(vec3(1,0,0),-45);

            //torso.mesh._texture.loadTexture(gl, "./Resources/Textures/kangaroo-fur-texture.jpg")
            //torso.mesh.gen_textCoods();
            kangaroo.addChild(torso);
        }
        {//Left Arm
            leftArm = new Entity(gl, program);
            leftArm.position = vec3(0.5,0,0);
            leftArm.mesh = new Cube(gl,program);
            leftArm.mesh._color = vec4(0,0,1,1);
            leftArm.mesh.position = vec3(0,-0.4,0);
            leftArm.mesh.scale = vec3(0.1,0.4,0.1);
            leftArm.rotate(vec3(1,0,0),60)
            torso.addChild(leftArm);
            
            {//Left ForeArm
                leftForeArm = new Entity(gl,program);
                leftForeArm.mesh = new Cube(gl,program);
                leftForeArm.mesh._color = vec4(0,1,0,1);
                leftForeArm.position = vec3(0,-0.8,0);
                leftForeArm.mesh.position = vec3(0,-0.4,0);
                leftForeArm.mesh.scale = vec3(0.1,0.4,0.1);
                leftForeArm.rotate(vec3(1,0,0),45);
                leftArm.addChild(leftForeArm);
            }
        }
        {//right Arm
            rightArm = new Entity(gl, program);
            rightArm.position = vec3(-0.5,0,0);
            rightArm.mesh = new Cube(gl,program);
            rightArm.mesh._color = vec4(0,0,1,1);
            rightArm.mesh.position = vec3(0,-0.4,0);
            rightArm.mesh.scale = vec3(0.1,0.4,0.1);
            rightArm.rotate(vec3(1,0,0),60)
            torso.addChild(rightArm);
            
            {//right ForeArm
                rightForeArm = new Entity(gl,program);
                rightForeArm.position = vec3(0,-0.8,0);
                rightForeArm.rotate(vec3(1,0,0),45);
                rightForeArm.mesh = new Cube(gl,program);
                rightForeArm.mesh._color = vec4(0,1,0,1);
                rightForeArm.mesh.position = vec3(0,-0.4,0);
                rightForeArm.mesh.scale = vec3(0.1,0.4,0.1);
                rightArm.addChild(rightForeArm);
            }
        }
        {//Legs
            legs = new Entity(gl,program);
            legs.position = vec3(0,-2,0);
            torso.addChild(legs);
            {//Left leg1
                leftLeg1 = new Entity(gl,program);
                legs.addChild(leftLeg1);
                leftLeg1.position = vec3(0.4,0,0);
                leftLeg1.mesh = new Cube(gl,program);
                leftLeg1.mesh._color = vec4(1,1,0,1);
                leftLeg1.mesh.scale = vec3(0.2,0.7,0.4);
                leftLeg1.mesh.position = vec3(0,-0.7,0);
                leftLeg1.rotate(vec3(1,0,0),120); 
                {
                    leftLeg2 = new Entity(gl,program);
                    leftLeg1.addChild(leftLeg2);
                    leftLeg2.position = vec3(0,-1.4,0)
                    leftLeg2.mesh = new Cube(gl,program);
                    leftLeg2.mesh._color = vec4(1,0,1,1);
                    leftLeg2.mesh.scale = vec3(0.19,0.7,0.19);
                    leftLeg2.mesh.position = vec3(0,-0.7,0);
                    leftLeg2.rotate(vec3(1,0,0),-120); 
                    {
                        leftLeg3 = new Entity(gl,program);
                        leftLeg2.addChild(leftLeg3);
                        leftLeg3.position = vec3(0,-1.4,0)
                        leftLeg3.mesh = new Cube(gl,program);
                        leftLeg3.mesh._color = vec4(0,1,1,1);
                        leftLeg3.mesh.scale = vec3(0.15,0.7,0.15);
                        leftLeg3.mesh.position = vec3(0,-0.7,0);
                        leftLeg3.rotate(vec3(1,0,0),120); 
                    }
                }
            }
            {//right leg1
                rightLeg1 = new Entity(gl,program);
                legs.addChild(rightLeg1);
                rightLeg1.position = vec3(-0.4,0,0);
                rightLeg1.mesh = new Cube(gl,program);
                rightLeg1.mesh._color = vec4(1,1,0,1);
                rightLeg1.mesh.scale = vec3(0.2,0.7,0.4);
                rightLeg1.mesh.position = vec3(0,-0.7,0);
                rightLeg1.rotate(vec3(1,0,0),120); 
                {
                    rightLeg2 = new Entity(gl,program);
                    rightLeg1.addChild(rightLeg2);
                    rightLeg2.position = vec3(0,-1.4,0)
                    rightLeg2.mesh = new Cube(gl,program);
                    rightLeg2.mesh._color = vec4(1,0,1,1);
                    rightLeg2.mesh.scale = vec3(0.19,0.7,0.19);
                    rightLeg2.mesh.position = vec3(0,-0.7,0);
                    rightLeg2.rotate(vec3(1,0,0),-120); 
                    {
                        rightLeg3 = new Entity(gl,program);
                        rightLeg2.addChild(rightLeg3);
                        rightLeg3.position = vec3(0,-1.4,0)
                        rightLeg3.mesh = new Cube(gl,program);
                        rightLeg3.mesh._color = vec4(0,1,1,1);
                        rightLeg3.mesh.scale = vec3(0.15,0.7,0.15);
                        rightLeg3.mesh.position = vec3(0,-0.7,0);
                        rightLeg3.rotate(vec3(1,0,0),120); 
                    }
                }
            }
        }
        {//head
            head = new Entity(gl, program);
            torso.addChild(head);
            head.mesh = new Cube(gl,program);
            head.mesh._color = vec4(0.5,0.5,0,1);
            head.mesh.scale = vec3(0.3,0.25,0.2);
            head.mesh.position = vec3(0,0.3,0.3);
            head.mesh._texture.loadTexture(gl,"./Resources/Textures/kangaroo-fur-texture-eyes.jpg");
            for(var i = 0;i<head.mesh._texture._textCoords.length;i++){
                var textCoord = head.mesh._texture._textCoords[i];
                if((i<12 || i>17) && textCoord[0]==0){
                    textCoord[0] = 0.5;
                }
                //head.mesh._texture._textCoords[i] = textCoord;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER,head.mesh._tBuffer);
            gl.bufferData(gl.ARRAY_BUFFER,flatten(head.mesh._texture._textCoords),gl.STATIC_DRAW);
            head.rotate(vec3(1,0,0),45);
            {
                var nose = new Entity(gl,program);
                head.addChild(nose);
                nose.mesh = new Cube(gl,program);
                nose.mesh._color = vec4(0.5,0.5,0,1);
                nose.mesh.scale = vec3(0.2,0.15,0.4);
                nose.mesh.position = vec3(0,0.2,0.5);
            }
            {//ears
                {//left ear
                    var leftEar = new Entity(gl,program);
                    head.addChild(leftEar);
                    leftEar.position = vec3(0.2,0.7,0.2)
                    leftEar.mesh = new Cube(gl,program);
                    leftEar.mesh.scale = vec3(0.14,0.3,0.05);
                }
                {//right ear
                    var rightEar = new Entity(gl,program);
                    head.addChild(rightEar);
                    rightEar.position = vec3(-0.2,0.7,0.2);
                    rightEar.mesh = new Cube(gl,program);
                    rightEar.mesh.scale = vec3(0.14,0.3,0.05);
                }
            }
        }
        {//tail
            tail = new Entity(gl,program);
            torso.addChild(tail);
            tail.position = vec3(0,-2,0);
            {//First tail section
                var tSection1 = new Entity(gl,program);
                tail.addChild(tSection1);
                tSection1.mesh = new Cube(gl,program);
                tSection1.mesh.scale = vec3(0.3,0.5,0.3);
                tSection1.mesh.position = vec3(0,-0.6,0);
                tSection1.mesh._color = vec4(0.5,1,0.5,1);
                tSection1.rotate(vec3(1,0,0),-40)
                {// second tail section
                    var tSection2 = new Entity(gl,program);
                    tSection1.addChild(tSection2);
                    tSection2.position = vec3(0,-0.6,0);
                    tSection2.mesh = new Cube(gl,program);
                    tSection2.mesh.scale = vec3(0.2,0.5,0.2);
                    tSection2.mesh.position = vec3(0,-0.6,0);
                    tSection2.mesh._color = vec4(0.3,1,0.5,1);
                    {
                        var tSection3 = new Entity(gl,program);
                        tSection2.addChild(tSection3);
                        tSection3.position = vec3(0,-0.6,0);
                        tSection3.mesh = new Cube(gl,program);
                        tSection3.mesh.scale = vec3(0.1,0.5,0.1);
                        tSection3.mesh.position = vec3(0,-0.6,0);
                        tSection3.mesh._color = vec4(0.3,1,0.3,1);
                    }
                }
            }
        }
    }
    kangaroo.position = vec3(0,3.2,0)
    world.addChild(kangaroo);
    {//#grass plane
        var grassPlane = new Entity(gl, program);
        world.addChild(grassPlane);
        grassPlane.mesh = new Plane(gl,program);
        grassPlane.mesh.scale = vec3(10,1,10);
        grassPlane.mesh._texture.loadTexture(gl,"./Resources/Textures/grass.jpg");
        //grassPlane.mesh._bumpmap.loadTexture(gl,"./Resources/Textures/download.jpg");
        //grassPlane.rotate(vec3(1,0,0),180);
    }
    {//debug cube
    var debug = new Entity(gl,program);
    debug.mesh = new Cube(gl, program);
    //world.addChild(debug);
    debug.position = vec3(0,3,0);
    debug.rotate(vec3(0,1,0),90);
    debug.rotate(vec3(0,0,1),90);
    debug.mesh._texture.loadTexture(gl,"./Resources/Textures/download.jpg")
    }
    {//Events
        {//mouse controls
            canvas.addEventListener("mousedown",function(event){
                trakMouse = true;
            });
            canvas.addEventListener("mouseup",function(event){
                trakMouse = false;
            });
            canvas.addEventListener("mouseenter",function(event){
                mouseIn = true;
            })
            canvas.addEventListener("mouseleave",function(event){
                mouseIn = false;
                mousePos =vec2();
            })
        }

    }
    render();
}

function render(event) {
        var oldTime = time;
        var time = Date.now()/1000;
        deltaTime = time-oldTime;
        gl.clearColor(0.53,0.8,0.98,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // captureMouse()
        // moveCamera();
        camera.render();
        //kangaroo.rotate(vec3(0,1,0),1);
        world.render(gl,program);
        requestAnimationFrame(render);
}

function moveCamera(){
    if(trakMouse && mouseIn){
        if(length(mouseDir)>0){ 
            var mouseDir3 = vec3(mouseDir[0],mouseDir[1],0);
            var cameraForward = camera.forward;
            var rotAxis = vec3(cross(mouseDir3,cameraForward));
            camera.rotate(mult(camera.rotationMatrix,rotAxis),length(rotAxis));
        }
    }
}

function captureMouse(){
    if(trakMouse && mouseIn){
        var oldMouse = mousePos;
        mousePos = vec2((event.x-rect.left)/rect.width,(event.y-rect.top)/rect.height);
        mouseDir = subtract(mousePos,oldMouse);
    }  
}
