var G = {
    t : this,
    v: 'V',
    f: function() {
     console.log('G : ', this);
    }
}



var A = {
    v: 'V',
    f: {
        k : 'k',
        a : () => {
            console.log('A : ',this)
        }
    }
}

var out = new G;







// don't use Arrow function with object or class
// use AF with closures or callback
// this , arguments don't be binded on AF 