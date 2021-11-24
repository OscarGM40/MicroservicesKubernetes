

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

let now: Date = new Date(); //:Date es la type annotation
