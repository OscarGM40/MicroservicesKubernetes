

// la sintaxis para una type annotation es :type
let apples: number = 5; //:number es la type annotation
// en cuanto anote a apples como number ya no podré pasarle como valor nada más que un number

let speed:string = "fast"; //:string es la type annotation
//de nuevo no podré reasignarla más que a otro string

let hasName: boolean = true; //:boolean es la type annotation

let nothingMuch: null = null; //:null es la type annotation
//este es el primer type annotation que coincide con su valor

let nothing:undefined = null; //:undefined es la type annotation
//este es el segundo type annotation que coincide con su valor

/* Built in objects */
let now: Date = new Date(); //:Date es la type annotation
let colors: string[] = ["red", "green", "blue"]; 
let myNumbers: number[] = [1, 2, 3]; 
let truths:boolean[] = [true, false, true]; 

// Classes(siempre Capitalizadas)
class Car {}
let car: Car = new Car();
// Object literal
let point:{x:number; y:number} = { x: 10, y: 20 };

/* Function fijate en :(args) => return*/
const logNumber: (i:number) => void = (i: number) => {
   console.log(i);
   };

/* TYPE INFERENCE:siempre que se declare e inicie una variable,constante,array,object,etc en la misma linea TS va a ser capaz de inferir el tipo correctamente.Fijate que es lo que he hecho arriba(con lo que sobraban todas y cada una de las type annotations) */
const date = new Date(); //<- TS will infer
const pointA ={x:1,y:2}; //<- TS will infer again correctly
let oranges;
oranges=10;// TS ya no es capaz de inferir el tipo y le pondrá de tipo any

/* WHEN TO USE ANNOTATIONS BY THE DEVELOPER */
// 1) Function that returns the 'any' type
const json = '{"x": 10, "y": 20}';
const coordinates:{ x:number; y:number } = JSON.parse(json);
console.log(coordinates); // {x: 10, y: 20}

// 2) When we declare a variable on one line and initialize it later
let words = ["red", "green", "blue"];//aqui si infiere
let foundWord; // <- aqui no infiere

for (let i = 0; i < words.length; i++) {
    if (words[i] === "green") {
       foundWord = true; //es aqui donde la inicio
    }
}

// Whenever we have a variable whose type cannot be inferred
let numbers = [-10, -1, 12];
let numberAboveZero: boolean | number = false;

for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 0) {
       numberAboveZero = numbers[i];
    }
}  