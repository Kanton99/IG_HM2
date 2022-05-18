class Camera extends Entity{
    constructor(gl, program){
        super(gl,program);

        this._fovy,this._aspect,this._near,this._far = 0;


        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);
    }

    render(){
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._program,"modelViewMatrix"), false, flatten(this.transform));
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._program,"projectionMatrix"), false, flatten(this._projectionMatrix));
    }
    //#region Getter and Setters
    get fovy(){return this._fovy;}
    set fovy(fovy){this._fovy = fovy;
        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);}

    get aspect(){return this._aspect;}
    set aspect(aspect){this._aspect = aspect;
        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);}

    get near(){return this._near;}
    set near(near){this._near = near;
        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);}

    get far(){return this._far;}
    set far(far){this._far = far;
        this._projectionMatrix = perspective(this._fovy,this._aspect,this._near,this._far);}


    get projectionMatrix(){return this._projectionMatrix;}
    //#endregion
}