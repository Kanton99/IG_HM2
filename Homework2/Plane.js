class Plane extends mesh{
    constructor(gl,program){
        super(gl,program);
        
        this.type = "Plane";
        this.detail = 128;

        this.genVerticies();
        this.plane();
        this.init(gl,program);
        this.gen_textCoods();
    }

    //#region contruct shape
    // genVerticies(){
    //     for(var x = -1;x<2;x+=2)for(var z = -1;z<2;z+=2){
    //         this._vertices.push(vec4( x,0,-z,1));
    //     }
    // }

    genVerticies(){
        for(var x = 0;x<this.detail;x++) for(var z = 0;z<this.detail;z++){
            var X = x*16/this.detail;
            var Z = z*16/this.detail;
            var offset = 7.5;
            var height = this.Gauss(X-offset,Z-offset,0.7,6);
            var vert = (vec4(X-offset,height,Z-offset,1));
            this._vertices.push(vert);   
        }
    }
    plane(){
        //this.quad(1,3,2,0)
        for(var x = 0;x<this.detail-1;x++) for(var y = 1;y<this.detail;y++){
            var v = (this.detail*y)+x;
            this.quad(v,v+1,v-this.detail+1,v-this.detail);
        }
    }
    
    gen_textCoods(){
        var scale = 10;

        for(var t = 0;t<this._triagles.length;t++){
            var triangle = this._triagles[t];
            var a  =triangle[0];
            var b  =triangle[1];
            var c  =triangle[2];

            var ta = vec2((a%this.detail)/this.detail,Math.floor(a/this.detail)/this.detail);
            var tb = vec2((b%this.detail)/this.detail,Math.floor(b/this.detail)/this.detail);
            var tc = vec2((c%this.detail)/this.detail,Math.floor(c/this.detail)/this.detail);
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
            var triangle = this._triagles[t];
            var a = this._vertices[triangle[0]];
            var b = this._vertices[triangle[1]];
            var c = this._vertices[triangle[2]];
            var ab = subtract(b,a);
            var ac = subtract(c,a);
            var normal = (normalize(cross(ab,ac)));
            this._normals.push(normal);
            this._normals.push(normal);
            this._normals.push(normal);
        }
    }

    //  
    //#endregion

    Gauss(x,y,sigma,A){
        var xc = x/this.detail;
        var yc = y/this.detail;
        var div = 2*sigma*sigma;
        return A * Math.exp(-(((x*x/div)+(y*y/div))));
    }
}