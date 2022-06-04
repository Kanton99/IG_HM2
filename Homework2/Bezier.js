class Bezier{
    constructor(a = vec2(),b = vec2(),c = vec2(),d = vec2()){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    at(t){
        var p0 = mult((1-t)*(1-t)*(1-t),this.a);
        var p1 = mult(3*(1-t)*(1-t)*t,this.b);
        var p2 = mult(3*(1-t)*t*t,this.c);
        var p3 = mult(t*t*t,this.d);

        return p0+p1+p2+p3;
    }
}