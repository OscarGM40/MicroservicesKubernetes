
/* Teniendo un object literal como este */
const profile = {
  name: 'John',
  age: 30,
  coords: {
    lat: 0,
    lng: 15
  },
  setAge(age:number):void{
    this.age = age;
  }
}
/* Imagina que quiero desestructurar y tipar la edad.No voy a usar { age }:number aunque sepa que es un number porque realmente es de tipo profile.age,no number */

// Lo que se hace es decir de que tipo de prop es y despues el tipo de esa prop
const { age }:{age:number} = profile;
// fijate que esto viola la regla anterior de :number,pero porque es la desestructuración.Imagina que quiero sacar el nombre también:
// const { age, name }:number = profile;<- está claro que name no es de tipo number,asi que es const {age}:{age:number}=objectLiteralName 

// @ts-ignore Esta sería la forma de sacar dos propiedades,por cada una que saco la saco con su propName+:+propType
const { name,age:edad }:{name:string,age:number} = profile;

const { coords:{ lat, lng } }: {coords:{ lat:number;lng:number}} = profile;