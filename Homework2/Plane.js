class Plane extends mesh{
    constructor(gl,program){
        super(gl,program)<

        this.genVerticies();
        this.plane();
        this.init(gl,program);
        this.gen_textCoods();

        this.type = "Plane";
    }

    //#region contruct shape
    // genVerticies(){
    //     for(var x = -1;x<2;x+=2)for(var z = -1;z<2;z+=2){
    //         this._vertices.push(vec4( x,0,-z,1));
    //     }
    // }

    genVerticies(){
        for(var i = 0;i<(16*16);i++){
            var vert = (vec4(i%16,0,Math.floor(i/16),1));
            vert[0]-=7.5
            vert[2]-=7.5
            this._vertices.push(vert);   
        }
    }
    plane(){
        //this.quad(1,3,2,0)
        for(var x = 0;x<15;x++) for(var y = 1;y<16;y++){
            var v = (16*y)+x;
            this.quad(v,v+1,v-15,v-16);
        }
    }
    
    gen_textCoods(){
        var scale = 10;

        for(var t = 0;t<this._triagles.length;t++){
            var triangle = this._triagles[t];
            var a  =triangle[0];
            var b  =triangle[0];
            var c  =triangle[0];

            var ta = vec2((a%16)/16,Math.floor(a/16)/16);
            var tb = vec2((b%16)/16,Math.floor(b/16)/16);
            var tc = vec2((c%16)/16,Math.floor(c/16)/16);
            ta = mult(scale,ta);
            tb = mult(scale,tb);
            tc = mult(scale,tc);
            this._texture._textCoords.push(ta);
            this._texture._textCoords.push(tb);
            this._texture._textCoords.push(tc);
        }


    }

    genNormals(){
        for(var t = 0;t<this._triagles.length;t++){
            var a = this._vertices[this._triagles[t][0]];
            var b = this._vertices[this._triagles[t][1]];
            var c = this._vertices[this._triagles[t][2]];
            var ab = subtract(b,a);
            var ac = subtract(c,a);
            var normal = negate(normalize(cross(ab,ac)));
            this._normals.push(normal);
            this._normals.push(normal);
            this._normals.push(normal);
        }
    }

    //  
    //#endregion
}