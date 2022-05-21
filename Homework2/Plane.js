class Plane extends mesh{
    constructor(gl,program){
        super(gl,program)<

        this.genVerticies();
        this.plane();
        this.init(gl,program);
    }

    //#region contruct shape
    genVerticies(){
        for(var x = -1;x<2;x+=2)for(var z = -1;z<2;z+=2){
            this._vertices.push(vec4(x,0,z,1));
        }
        //-1 0 -1 0
        //-1 0  1 1
        // 1 0 -1 2
        // 1 0  1 3
    }

    plane(){
        this.quad(1,3,2,0)
    }
    //#endregion
}