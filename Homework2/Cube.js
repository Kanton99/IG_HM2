class Cube extends mesh{
    constructor(gl,program){
        super(gl,program);

        this.genVerticies();
        this.cube();
        this.init(gl,program);
        this.gen_textCoods();
    }

    //#region Contruct shape
    genVerticies(){
        for(var x = -1;x<2;x+=2) for(var y = -1;y<2;y+=2) for(var z = -1;z<2;z+=2){
            var vertex = vec4(x,y,z,1);
            //this._vertices.push(mult(this._transform,vertex));
            this._vertices.push(vertex);
        }
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
    gen_textCoods(){
        for(var i = 0;i<this._triagles.length;i+=2){ 
            this._texture._textCoords.push(vec2(0,1));
            this._texture._textCoords.push(vec2(0,0));
            this._texture._textCoords.push(vec2(1,0)); 

            this._texture._textCoords.push(vec2(0,1));
            this._texture._textCoords.push(vec2(1,0));
            this._texture._textCoords.push(vec2(1,1));
        }
    }

}