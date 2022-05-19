class Camera extends Entity{
    constructor(gl, program){
        super(gl,program);

        this._fovy,this._aspect,this._near,this._far = 0;
        this._perspective = true;

        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);
    }

    render(){
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._program,"modelViewMatrix"), false, flatten((this.transform)));
        if(this._perspective) this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);
        else this._projectionMatrix = ortho(-2,2,-2,2,-10,10);
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._program,"projectionMatrix"), false, flatten((this._projectionMatrix)));
    }
    //#region Getter and Setters
    get fovy(){return this._fovy;}
    set fovy(fovy){this._fovy = fovy;}

    get aspect(){return this._aspect;}
    set aspect(aspect){this._aspect = aspect;}

    get near(){return this._near;}
    set near(near){this._near = near;}

    get far(){return this._far;}
    set far(far){this._far = far;}


    get projectionMatrix(){return this._projectionMatrix;}
    set projectionMatrix(projection){this._projectionMatrix = projection;}
    //#endregion
}