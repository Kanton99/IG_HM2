class Cube{
    constructor(gl,program){
        this._parent;
        this._transform = mat4();

        this._vertices = [];
        this._positions = [];
        this._triagles = [];
        this._normals = [];
        this._numPositions = 0;

        this._material = new Material();
        this._texture = new Texture();
        this._color = vec4(1,0,0,1);

        this._posBuffer = gl.createBuffer();
        this._positionLoc;

        this._norBuffer = gl.createBuffer();
        this._normalLoc;

        this.init(gl,program);
    }

    //#region Contruct shape
    genVerticies(){
        for(var x = -1;x<2;x+=2) for(var y = -1;y<2;y+=2) for(var z = -1;z<2;z+=2){
            var vertex = vec4(x,y,z,1);
            this._vertices.push(mult(this._transform,vertex));
            //this._vertices.push(vertex);
        }
    }

    genNormals(){
        for(var t = 0;t<this._triagles.length;t++){
            var a = this._vertices[this._triagles[t][0]];
            var b = this._vertices[this._triagles[t][1]];
            var c = this._vertices[this._triagles[t][2]];
            var ab = subtract(b,a);
            var ac = subtract(c,a);
            var normal = vec4(negate(normalize(cross(ab,ac))));
            this._normals.push(normal);
            this._normals.push(normal);
            this._normals.push(normal);
        }
    }

    quad(a, b, c, d) {
        this.triangle(a,b,c);
        this.triangle(a,c,d);
    }

    triangle(a,b,c){
        this._positions.push(this._vertices[a]);
        this._positions.push(this._vertices[b]);
        this._positions.push(this._vertices[c]);
        this._triagles.push([a,b,c]);
        this._numPositions+=3;
    }

    cube()
    {
        this.quad(2,6,4,0); //front
        this.quad(6,7,5,4); //right
        this.quad(7,3,1,5); //back
        this.quad(3,2,0,1); //left
        this.quad(3,7,6,2); //top
        this.quad(0,4,5,1); //bottom
    }
    //#endregion
    
    render(gl, program){
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
        gl.vertexAttribPointer(this._positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._norBuffer);
        gl.vertexAttribPointer(this._normalLoc,4,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this._normalLoc);

        gl.uniformMatrix4fv(gl.getUniformLocation(program,"objectMatrix"), false, flatten(mult((this._transform),this._parent.worldMatrix)));
        gl.uniform4fv(gl.getUniformLocation(program,"aColor"), this._color);
        gl.drawArrays(gl.LINES, 0, this._numPositions);

        gl.disableVertexAttribArray(this._positionLoc);
        gl.disableVertexAttribArray(this._normalLoc);
    }

    init(gl, program){
        this.genVerticies();
        this.cube();
        this.genNormals();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._positions),gl.STATIC_DRAW);

        this._positionLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(this._positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER,this._norBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._normals),gl.STATIC_DRAW);

        this._normalLoc = gl.getAttribLocation(program,"aNormal");
        gl.vertexAttribPointer(this._normalLoc,4,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this._positionLoc);

        gl.disableVertexAttribArray(this._positionLoc);
        gl.disableVertexAttribArray(this._normalLoc);
    }

    update(){
        for(var i = 0;i<this._vertices.length;i++){
            this._vertices[i] = mult(this._transform,this._vertices[i]);
        }
    }

//#region Getters and Setters
    get position(){
        return vec4(this._transform[0][3],this._transform[1][3],this._transform[2][3],1)
    }

    set position(position){
        if(position.type != "vec3") throw "wrong position type";
        this._transform = mult(translate(position[0],position[1],position[2]),this._transform);
    }

    set scale(scale){
        if(scale.type != 'vec3') throw "scale not vec3 type";
        this._transform[0][0] = scale[0];
        this._transform[1][1] = scale[1];
        this._transform[2][2] = scale[2];
    }
//#endregion
}