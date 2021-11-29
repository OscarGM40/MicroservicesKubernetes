

const oldCivic = {
    name: 'civic',
    year: 2000,
    broken: true
};

// Esta claro que es una mala idea usar esta type annotation,queda muy larga y tiene 0 reusabilidad
const printVehicle = (vehicle: {name:string;year:number;broken: boolean}):void => {
  console.log(`Name: ${vehicle.name}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Broken: ${vehicle.broken}`);
}

printVehicle(oldCivic); 

/* Imagina que tuviera que usar la type annotation de arriba varias veces.Sería una locura mantener esa sintaxis.La solución es una interfaz.IMPORTANTE:una interfaz va capitalizada,pues es como una clase de java */

interface Vehicle {
    name: string;
    year: number;
    broken: boolean;
}

const printVehicle2 = (vehicle: Vehicle):void => {
  console.log(`Name: ${vehicle.name}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Broken: ${vehicle.broken}`);
}

/* En cuanto a la sintaxis admite todo(Date,functions,Promises) */
interface VehicleTwo {
  name: string;
  year:Date;
  broken: boolean;
  //sintaxis:function():returnType
  summary():string;
}

const newCivic = {
    name: 'civic',
    year: new Date(),
    broken: true,
    summary():string{
        return `Name of the car: ${this.name}`;
    }
}

const printNewVehicle = (vehicle: VehicleTwo):void => {
  console.log(`Name: ${vehicle.name}`);
  console.log(`Year: ${vehicle.year}`);
  console.log(`Broken: ${vehicle.broken}`);
  console.log(`Summary: ${vehicle.summary()}`);
} 

interface Reportable {
    summary():string;
}

const drinkTwo = {
    color: 'brown',
    carbonated: true,
    sugar: 40,
    summary():string{
        return `My drink has ${this.sugar} grams of sugar`;
    }
}