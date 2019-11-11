var a = 5;

if(true) {
    var a = 7;
}

console.log(a); --> 7

var a = 5;

if(true) {
    let a = 7;
}

console.log(a;);  --> 5  cause of block scope

var a = 5;

const(true) {
    var a = 7;
}

console.log(a); --> error cause if const

var a = 5;

const(true) {
    let a = 7;
}

console.log(a); --> 7 cause let is fn

BLOCK(const and let ) vs FUNCTION (var/local) scope

//******
