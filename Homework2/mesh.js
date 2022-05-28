var print = true;
class mesh{
    constructor(gl, program){
        this._parent;
        this._transform = mat4();

        this._vertices = [];
        this._positions = [];
        this._triagles = [];
        this._normals = [];
        this._tangents = [];
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

        this._tanBuffer = gl.createBuffer();
        this._tanLoc;

    }

    
    render(gl, program){
        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
        gl.vertexAttribPointer(this._positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._positionLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._norBuffer);
        gl.vertexAttribPointer(this._normalLoc, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._normalLoc);

        gl.bindBuffer(gl.ARRAY_BUFFER,this._tBuffer);
        gl.vertexAttribPointer(this._textLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this._textLoc);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture._texture);
        gl.uniform1i(gl.getUniformLocation(program,"aTexture"), 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._bumpmap._texture);
        gl.uniform1i(gl.getUniformLocation(program,"bumpmap"), 1);
        
        var pos = mult(this._parent.worldMatrix,this._transform);
        gl.uniformMatrix4fv(gl.getUniformLocation(program,"objectMatrix"), false, flatten(pos));
        gl.uniformMatrix4fv(gl.getUniformLocation(program,"inverseObjectMatrix"), false, flatten(inverse(pos)));
        gl.uniform4fv(gl.getUniformLocation(program,"aColor"), this._color);

        gl.bindBuffer(gl.ARRAY_BUFFER,this._tanBuffer);
        gl.vertexAttribPointer(this._tanLoc,3,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(this._tanLoc);


        gl.drawArrays(gl.TRIANGLES, 0, this._numPositions);
    

        gl.disableVertexAttribArray(this._positionLoc);
        gl.disableVertexAttribArray(this._normalLoc);
        gl.disableVertexAttribArray(this._textLoc);
        gl.disableVertexAttribArray(this._tanLoc);
    }

    
    init(gl, program){
        this.genNormals();
        this._texture.loadTexture(gl,"./Resources/Textures/kangaroo-fur-texture.jpg");
        this._bumpmap.loadTexture(gl,"./Resources/Textures/Seamless_Fur_Coat_Texture_NORMAL.jpg");
        this.gen_textCoods();
        this.genTangents();

        gl.bindBuffer(gl.ARRAY_BUFFER, this._posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._positions),gl.STATIC_DRAW);
        this._positionLoc = gl.getAttribLocation(program, "aPosition");

        gl.bindBuffer(gl.ARRAY_BUFFER,this._norBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._normals),gl.STATIC_DRAW);
        this._normalLoc = gl.getAttribLocation(program,"aNormal");

        gl.bindBuffer(gl.ARRAY_BUFFER, this._tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._texture._textCoords),gl.STATIC_DRAW);
        this._textLoc = gl.getAttribLocation(program,"aTexCoord");

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture._texture);
        gl.uniform1i(gl.getUniformLocation(program,"aTexture"), 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._bumpmap._texture);
        gl.uniform1i(gl.getUniformLocation(program,"bumpmap"), 1);

        gl.bindBuffer(gl.ARRAY_BUFFER,this._tanBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,flatten(this._tangents),gl.STATIC_DRAW);
        this._tanLoc = gl.getAttribLocation(program,"aTangent");

    }
    //#region generation functions
    genNormals(){
        for(var t = 0;t<this._triagles.length;t++){
            var a = this._vertices[this._triagles[t][0]];
            var b = this._vertices[this._triagles[t][1]];
            var c = this._vertices[this._triagles[t][2]];
            var ab = subtract(b,a);
            var ac = subtract(c,a);
            var normal = (normalize(cross(ab,ac)));
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

    genTangents(){
        for(var i = 0;i<this._triagles.length;i++){
            var a = vec3(this._vertices[this._triagles[i][0]]);
            var b = vec3(this._vertices[this._triagles[i][1]]);
            var c = vec3(this._vertices[this._triagles[i][2]]);

            var e1 = subtract(b,a);
            var e2 = subtract(c,a);

            var uv1 = this._texture._textCoords[i*3]
            var uv2 = this._texture._textCoords[i*3+1]
            var uv3 = this._texture._textCoords[i*3+2]

            var dUv1 = subtract(uv2,uv1);
            var dUv2 = subtract(uv3,uv1);

            var tangent = vec3();

            var f = 1/(dUv1[0]*dUv2[1]-dUv1[1]*dUv2[0]);

            tangent[0] = f * (dUv2[1] * e1[0] - dUv1[1] * e2[0]);
            tangent[1] = f * (dUv2[1] * e1[1] - dUv1[1] * e2[1]);
            tangent[2] = f * (dUv2[1] * e1[2] - dUv1[1] * e2[2]);
            tangent = normalize(tangent);
            this._tangents.push(tangent);
            this._tangents.push(tangent);
            this._tangents.push(tangent);
        }
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
        this._transform[0][0] = scale[0];
        this._transform[1][1] = scale[1];
        this._transform[2][2] = scale[2];
    }

    
    //#endregion
}