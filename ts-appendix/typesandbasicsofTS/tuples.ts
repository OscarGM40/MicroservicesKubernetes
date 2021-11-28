
/* Imagina que quiero representar una coleccion de este objeto */
const drink = {
    color: 'brown',
    carbonated: true,
    sugar: 40
};


// si creara un arreglo de (string | number | boolean)[] realmente no sabría en que orden va cada uno de ellos
const pepsi:(string | number | boolean)[] = ['brown',true,40];
pepsi[0] = 'brown';
pepsi[1] = true;

// pero puedo usar un tipo [string,boolean,number] para que sea una tupla en vez de un arreglo,con lo que el orden debe ser exactamente el mismo que yo defina
const pepsiTuple:[string,boolean,number] = ['brown',true,40];

// ya no podré cambiar el orden
// pepsiTuple[0] = false;
// ni tampoco añadir más elementos
// pepsiTuple[3] = 'brown';

// normalmente se usa un type alias en vez de usar [string,boolean,number]
type Drink = [string,boolean,number];
// con un type alias puedo crear un nuevo tipo para usar donde quiera
const pepsiTuple2:Drink = ['brown',true,40];
// sin embargo parece que usar el type alias ahora no muestra los errores
pepsiTuple2.push(50);

//realmente las tuplas no son útiles,¿que son estos dos numbers?
const carSpecs:[number,number] = [400,3354];

// es mucho mejor ser especificos y usar un object literal:
const carStats = {
    horsepower:400,
    weight:3354
} 