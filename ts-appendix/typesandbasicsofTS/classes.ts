






/* Una clase es un plano para poder construir objetos.Define 
las propiedades y métodos que ese objeto tendrá */
/* Por defecto el modificador de acceso es public en TS */
class Vehicle {
  color: string;
  
  
  constructor(color: string) {
    this.color = color;
  } 

  public drive(): void {
    console.log("chugga chugga")
  }
  public honk(): void {
    console.log("beep")
  }
}


const vehicle = new Vehicle('orange');

vehicle.drive();
vehicle.honk();

class Car extends Vehicle {

  constructor(public wheels:number,color:string){
    super(color);
  }

  public drive(): void {
    console.log("vroom")
  }
  /* cuando un proceso puede ser peligroso es mejor etiquetarlo como privado */
  private dangerProcess(): void {
    console.log("BOOOOM")
  }

  public startDangerProcess(): void {
    this.dangerProcess();
  }
}
const car = new Car(4,'blue');
car.drive();
car.startDangerProcess();