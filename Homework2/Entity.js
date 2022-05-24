class Entity{
    constructor(gl,program){
        this._transform = mat4();
        this._parent;
        this._children = [];
        this._mesh;

        this._gl = gl;
        this._program = program;
    }
    update(){ 
        if(this._mesh!=null)this._mesh.update();
        for(var i = 0;i<this._children;i++) this._children[i].update();
    }

    render(){
        
        this._gl.uniformMatrix4fv(this._gl.getUniformLocation(this._program, "inverseObjectMatrix"),false,flatten(transpose(inverse(this.worldMatrix))))
        if(this._mesh != null) this._mesh.render(this._gl,this._program);
        for(var i = 0;i<this._children.length;i++) this._children[i].render();
    }

    //#region Getters and Setters
    get transform(){return this._transform;}
    set transform(m){
        this._transform = m;
        //this.update()
    }

    get worldMatrix(){
        if(this.parent != null)return mult(this.parent.worldMatrix,this.transform);
        return this.transform;
    }

    get parent(){return this._parent;}
    set parent(parent){
        if(parent.children.length >0){
            var i = this._parent._children.findIndex(this);
            this._parent._children.splice(i,1);
        }
        this._parent=parent;
        parent.children.push(this);
    }

    get children(){return this._children;}
    addChild(child){
        this._children.push(child);
        child._parent = this;
    }

    get mesh(){return this._mesh;}
    set mesh(mesh){
        if (this._mesh!=null)this._mesh._parent = null;
        this._mesh = mesh;
        this._mesh._parent = this;
    }

    get position(){
        return vec4(this._transform[3][0],this._transform[3][1],this._transform[3][2],1)
    }
    set position(position){
        if(position.type != "vec3") throw "wrong position type";
        this._transform = mult(translate(position[0],position[1],position[2]),this._transform);
    }

    rotate(axis, angle){
        if(axis == vec3(0,0,0)) return;
        this.transform = mult(this.transform,rotate(angle,axis));
    }

    get rotationMatrix(){
        return mat3(this.worldMatrix);
    }

    get forward(){
        var entMatrix = this.rotationMatrix;
        return normalize(mult(entMatrix,vec3(0,0,1)));
    }

    //#endregion

}
