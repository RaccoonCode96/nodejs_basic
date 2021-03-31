// function a() {
//     console.log('A');
// }

// const a = function (){
//     console.log('A');
// }

const a = () => {
    console.log('A');
}

// javascript에서는 함수가 값임


const slowfunc = (callback) => {
    callback();
}

slowfunc(a);

