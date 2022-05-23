var print = true;
class mesh{
    constructor(gl, program){
        this._parent;
        this._transform = mat4();

        this._vertices = [];
        this._positions = [];
        this._triagles = [];
        this._normals = [];
        this._numPositions = 0;
        
        this._texture = new Texture();
        this._bumpmap = new Texture();
        this._color = vec4(1,0,0,1);

        this._posBuffer = gl.createBuffer();
        this._positionLoc;

        this._norBuffer = gl.createBuffer();
        this._normalLoc;

        this._tBuffer = gl.createBuffer();
        this._textLoc;

        this._material = new Material();
    }

    
    render(gl, program){
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
        gl.vertexAttribPointer(this._positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._norBuffer);
        gl.vertexAttribPointer(this._normalLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._normalLoc);
        if(this._texture._textCoords.length != 0){
            gl.bindBuffer(gl.ARRAY_BUFFER,this.tBuffer);
            gl.vertexAttribPointer(this._textLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this._textLoc);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture._texture);
            gl.uniform1i(gl.getUniformLocation(program,"aTexture"), 0);
        }
        var pos = mult(this._parent.worldMatrix,this._transform);
        gl.uniformMatrix4fv(gl.getUniformLocation(program,"objectMatrix"), false, flatten(pos));
        gl.uniform4fv(gl.getUniformLocation(program,"aColor"), this._color);


        gl.drawArrays(gl.TRIANGLES, 0, this._numPositions);
    

        gl.disableVertexAttribArray(this._positionLoc);
        gl.disableVertexAttribArray(this._normalLoc);
        gl.disableVertexAttribArray(this._textLoc);
    }

    
    init(gl, program){
        this.genNormals();
        this._texture.loadTexture(gl,"./Resources/Textures/kangaroo-fur-texture.jpg");
        this.gen_textCoods();
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

        if(this._texture._textCoords.length != 0){
            gl.bindBuffer(gl.ARRAY_BUFFER, this._tBuffer);
            gl.bufferData(gl.ARRAY_BUFFER,flatten(this._texture._textCoords),gl.STATIC_DRAW);

            this._textLoc = gl.getAttribLocation(program,"aTexCoord");
            gl.vertexAttribPointer(this._textLoc, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this._textLoc);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture._texture);
        gl.uniform1i(gl.getUniformLocation(program,"aTexture"), 0);

        //gl.disableVertexAttribArray(this._positionLoc);
        //gl.disableVertexAttribArray(this._normalLoc);
        //gl.disableVertexAttribArray(this._textLoc);
    }
    //#region generation functions
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
    
    gen_textCoods(){}
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
    //#endregion

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
        this._transform[0][0] *= scale[0];
        this._transform[1][1] *= scale[1];
        this._transform[2][2] *= scale[2];
    }
    //#endregion
}