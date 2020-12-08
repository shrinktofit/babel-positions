
class Base {
    p;

    get a() { }
    set a(v) { }

    f() { }
}

class Derived extends Super { } // Extends only, without super calls

class super_call extends Super {
    constructor() {
        super(); // Super call in constructor
    }

    f() {
        super.p; // Super property access
        super.f(); // Super method call
    }

    get a() {
        return super.a; // Super get accessor in derived get accessor
    }
    set a(v) {
        super.a = v; // Super set accessor in derived set accessor
    }
}