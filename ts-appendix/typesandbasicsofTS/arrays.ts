


// de nuevo TS puede inferir si la declaración e inicialización van juntas
const carMakers = ['ford', 'toyota', 'chevy'];
// no la hará con un arreglo vacio(en realidad lo pone a any[])
const anyTyped = [];

// de nuevo no hace falta tiparlo si lo inicio(Date[])
const dates = [new Date(), new Date()];

// también lo va a inferir en arrays multidimensionales si lo inicio
const carsByMake = [
  ['f150'],
  ['corolla'],
  ['camaro']
];

// y de nuevo la única vez que tendría que tiparlo yo será cuando se inicie vacío:
const carsByMakeEmpty:string[][] = [];

// 1- Help with inference when extracting values
// TS sabrá que car es un string pues lo he sacado de un arreglo de strings
const car = carMakers[0];
const myCar = carMakers.pop();

// 2- Preventing incompatible values
// carMakers.push(100);

// 3- We get help with arrays functions
carMakers.map( (car) => car.toUpperCase());

// 4- Flexible types. De nuevo TS infiere si se inicia en la misma linea
const importantDates = [new Date(), '2030-10-10'];
// aunque parece un buen momento para tiparlo yo e informar que es un arreglo flexible de dos tipos
const importantDates2: (Date | string)[] = [new Date(), '2030-10-10'];