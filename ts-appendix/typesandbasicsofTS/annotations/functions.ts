




/* Como programadores debemos tipar los argumentos de una función ,pues TS nunca los va a inferir.Si que va a tratar de inferir el valor que retorne */

const add = (a:number, b:number):number => {
    return a + b;
}

/* Sin embargo no usaré la inferencia de tipo en funciones,ya que TS no chequea la lógica y simplemente pondrá como tipo lo que retorne esta lógica.Esto es importante,es mejor tipar el valor de retorno */
const substract = (a:number, b:number) => {
  a - b;
}

/* Cuando sea una función normal la sintaxis es igual */
function divide(a:number, b:number):number {
  return a / b;
}
/* Lo mismo para funciones anónimas */
const multiply = function(a:number, b:number):number {
  return a * b;
}

/* El tipo void es muy útil y usado también.Se usa para especificar que NO se retorna NINGUN valor  */
const logger = (message:string):void => {
  console.log(message);
}

/* Hay otro tipo especial que es 'never'.Cuando tiro un error técnicamente no estoy retornando nada.El tipo 'never' indica que nunca se va a llegar al final de la función(pues caerá el script en el Error */
const throwError = (message:string):never => {
  throw new Error(message);
}

/* Destructuring with Annotations.Simplemente se cambia el nombre del objeto por la desestructuración */
const todaysWeather = { 
  date: new Date(),
  weather: 'sunny'
}

const logWeather = (forecast:{ date:Date,weather:string }):void => {
  console.log(forecast.date);
  console.log(forecast.weather);
}
// ES 2015 <- realmente solo es cambiar forecast por {prop1,props2}
const logWeather2015 = ({date,weather}:{date:Date,weather:string}) => { }
 
logWeather(todaysWeather);
logWeather2015(todaysWeather);