# Chapter 8 - Creating a Beautiful User Experience


Las APIs y las herramientas de las lineas de comandos son muy utiles para los desarrolladores y sistemas para comunicarse.Pero si quieres que los no-desarrolladores utilicen estos servicios necesitaras un entorno mas sencillo y mas agradable.

Vamos a aprender a hacer una front-end web para las APIs desarrolladas en los capitulos anteriores.
Para esto vamos a instalar y configurar webpack,un bundle muy popular para hacer interfaces web accesibles.Para esto vamos a ver los principios del desarrollo front-end:
-Node.js Core
En los capitulos anteriores hemos utilizado modulos con dependencias de estado y de desarrollo.En este vamos a ver las dependencias de pares para relacionar los frameworks con los plugins.
-Patterns
El framework del modelo plus plugin es muy popular en el desarrollo front-end de Javascript.Tambien con Javascript moderno vamos a poder pasar codigo de un lenguaje a otro.Vamos a utilizar TypeScript para ello.
-JavaScriptism
En el capitulo anterior hemos utilizado funciones asincronas utilizando bloques de tipo try-catch para manejar los resultados de las promesas.En este vamos a utilizar los metodos promesa nativas del navegador tipo fetch para hacer peticiones asincronas al servidor.Vamos a trabajar con otras APIs del DOM para manejar la interaccion con el usuario y la navegacion.
-Supporting Code
Desarrollar una interfaz de usuario desde cero puede ser complicado, para ello nos centraremos en herramientas de soporte.Utilizamos la framework de Twitter Bootstrap para estilos por defecto.Para renderizar contenido HTML utilizaremos una libreria llamada Handlebars.

Cada framework de front-end tiene sus beneficios,y sus funcionalidades estan en un estado continuo de cambio.

Vamos a implementar una interfaz web de usuario sobre las APIs desarrolladas en Node.js.Luego para la parte de las frameworks utilizaremos tecnicas comunes a distintas librerias y frameworks.

## Getting started with webpack

La aplicacion anteriormente creada B4 se basa solo de APIs tipo RESTful.
Vamos a configurar un builder de front-end llamado webpack,cogiendo todo el codigo de front-end y las dependencias y crea un bundle con varios "deliverables".

Si por ejemplo tenemos un fichero JS con dos librerias de dependencia,en vez de mandar los tres ficheros al browser del cliente,webpack se encarga de combinar todos los trabajos en un solo fichero JS.

Creamos el directorio b4-app.Este va a ser nuestro directorio npm.
Para ello haremos : "npm init" dentro del directorio.

Tambien se pueden crear paginas/aplicaciones web sin hacer un bundling pero hay una variedad de motivos por el cual se deberia hacer.(transpiling-que es pasar el codigo fuente a otro lenguage similar, y una reduccion de la latencia.)

En un entorno de produccion,vamos a realizar las actividades de bundling antes de hacer el deploy,pero durante el desarrollo es mas conveniente hacer bundling a demanda.

Para esto,utilizaremos un plugin de webpack llamado webpack dev server.
Normalmente cuando un modulo depende de otro,dentro de package.json se anadira como un submodulo pero de las dependencias de peer los modulos de dependencias estan al mismo nivel que los de que dependen.

Instalamos el modulo:
```javascript
npm install --save-exact --save-dev webpack-dev-server@2.9.1
```

Tambien nos podrian saltar errores de que hay algunas peer-dependencies que faltan.
Vamos a anadir un script para iniciar el webpack-dev-server.
```javascript
    "start": "webpack-dev-server"
```

Y iniciamos webpack dev server con npm:
```javascript
npm start
```

pero nos salta el error de que no se encuentra el modulo webpack.
La razon de las dependencias de peer es soportar un modelo plugin.
Un plugin anade funcionalidad a un framework.

Por lo tanto webpack-dev-server es un plugin a un proyecto webpack.
Sin explicitamente definir las dependencias de peer en npm,vamos a tener a webpack-dev-server depender de un framework.

Utilizar plugins para las librerias es un patron comun en el desarrollo front-end de las interfaces.

Instalamos el modulo webpack para las dependencias de peer.
```javascript
npm install --save-dev --save-exact webpack@3.6.0
```

Para utilizar webpack necesitamos configurarlo en: webpack.config.js.

Creamos el webpack.config.js:
```javascript
'use strict';
module.exports = {
    entry: './entry.js',
};
```
Con esto exportamos una configuracion minima, que solo contiene una propiedad entry.
Con esto fijamos el fichero root,donde todas las dependencias se resuelven.


Al hacer:
```javascript
npm start
```
,nos sale lo siguiente:

![p8-1](https://user-images.githubusercontent.com/25621400/58369402-d955ae80-7ef1-11e9-9b7c-532f1891396e.png)

Por defecto, webpack-dev-server escucha en el puerto 8080.
Al visitar en la web el : localhost:8081(en nuestro caso nos asigna por defecto el puerto 8081) no sale esto:

![p8-2](https://user-images.githubusercontent.com/25621400/58369403-da86db80-7ef1-11e9-9494-88992742c80a.png)

Actualmente, nuestro webpack.config.js contiene una sola entrada sin output.
Lo siguiente que veremos es como utilizar un plugin generador de HTML para generar una aplicacion de Hello World.


## Generating Your First webpack Bundle

Tenemos la estructura basica del proyecto pero no hace nada actualmente.Para esto haremos que el proyecto genere el un fichero index.html y producir un bundler de JS que lo acompane.

Primero,para general el HTML vamos a instalar el modulo html-webpack-plugin:
```javascript
npm install --save-dev --save-exact html-webpack-plugin@2.30.1
```

Anadimos lo siguiente al webpack.config.js:
```javascript
'use strict';

const path = require('path');
const distDir = path.resolve(__dirname,'dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './entry.js',

    output: {
        filename: 'bundle.js',
        path: distDir,
    },
    devServer: {
        contentBase: distDir,
        port: 60800,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Better Book Bundle Builder',
        }),
    ],
};
```

lo primero que hacemos es importar el modulo path para sacar la direccion que va a tener nuestra distribucion,retornando de esta manera una ruta absoluta.
Tambien utilizamos el modulo de htmlwebpackplugin para la porcion de plugins de nuestro webpack config.Tambien se le anade un objeto de salida output para especificar el directorio y el nombre que va a tener el fichero de salida JS.
El modulo de webpack-dev-server no escribe directamente en el directorio de salida sino sirve contenido como el archivo bundle.js directamente de la memoria a la peticion.
Si ejecutamos webpack si se escribiria directamente el contenido al directorio output.

El objeto devServer contiene datos de configuracion necesarios para el webpack-dev-server,utilizando el mismo directorio y sobreescribiendo el puerto tcp.
Por ultimo anadimos un objeto plugin al build creando una nueva instancia de este modulo pasandole un atributo titulo.Esto se mostrara en la etiqueta title de la pagina html.

Para lograr que se vea algo en la pagina html anadimos lo siguiente al fichero de entrada:
```javascript
'use strict';
document.body.innerHTML = `
    <h1>B4 - Book Bundler</h1>
    <p>${new Date()}</p>
    `;
```

Con esto insertamos una cabecera con el nombre B4 - Book Bundler y un parrafo con la hora actual.

Corremos de nuevo el webpack dev server y accedemos al localhost:60800.

![p8-3](https://user-images.githubusercontent.com/25621400/58369404-db1f7200-7ef1-11e9-8851-03b9590d160c.png)

## Sprucing Up Your UI with Bootstrap

Bootstrap es una framework para desarrollar interfaces web.Te da un cierto diseno inicial.

Para esto necesitamos algunos plugins de dependencia.Necesitamos el style-loader y el css-loader.Para cargar otros recursos estaticos,imagenes,fuentes,etc,necesitamos el url-loader y el file-loader.

Instalamos todos estos modulos:
```javascript
npm install --save-dev --save-exact \
    style-loader@0.19.0 \
    css-loader@0.28.7 \
    url-loader@0.6.2 \
    file-loader@1.1.5
```

Para que webpack pueda utilizar estos plugins los anadimos al config explicando que ficheros son manejados por estos plugins.

Anadimos al webpack.config.js:
```javascript
module: {
    rules: [{
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
    },{
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      loader: 'url-loader?limit=100000',
    }],
  },
```

Primero le decimos a webpack que los ficheros .css van a ser manejados utilizando el css-loader y el style-loader.El primero lee los ficheros css y tambien resuelve cualquier referencia hacia @import y las llamadas a url().Pero despues de resolverlo css-loader no hace nada y aqui interviene el style-loader que mete una etiqueta <style> en el codigo con el contenido css.

En la segunda regla con el url-loader podemos cargar una amplia variedad de ficheros.Esto hace que saque el fichero remotamente y lo incluye directamente.

El parametro limit del plugin especifica el tamano maximo del fichero en bytes que puede ser incluido.
Si el fichero es mas grande entonces se encarga el file-loader que emite el fichero al directorio de salida.

Instalamos Bootstrap:
```javascript
npm install --save-dev --save-exact bootstrap@3.3.7
```

Utilizamos Bootstrap en entry.js(reemplazando el contenido existente):
```javascript
'use strict';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';

document.body.innerHTML = `
    <div class="container">
    <h1>B4 - Book Bundler</h1>
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
    </div>
    `;
```

Al principio utilizamos el import para sacar la version min de Bootstrap css.
Se utiliza import para sacar dependencias.Es similar a require().
Al encontrarse con ella en tiempo de compilacion comprueba el fichero con las reglas anadidas en el module.rules del fichero de configuracion invocando el css-loader para sacar el contenido.

Despues creamos la estructura basica del documento,el container diciendo que se ajuste si la pantalla es demasiado grande.Dentro de esto ponemos una alerta para notificar al usuario y un area que ira cambiando en funcion del estado de la aplicacion.

Luego al final anadimos esto:
```javascript
const mainElement = document.body.querySelector('.b4-main');

mainElement.innerHTML = `
    <div class="jumbotron">
        <h1> Welcome!</h1>
        <p>B4 is an application for creating book bundles.</p>
        </div>
        `;
const alertsElement = document.body.querySelector('.b4-alerts');

alertsElement.innerHTML = `
    <div class="alert alert-success alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    <strong>Success!</strong> Bootstrap is working.
    </div>
    `;
```

Cogemos una referencia del contenido main de la aplicacion y luego dentro de este insertamos un mensaje de bienvenida utilizando la clase "jumbotron"
Luego cogemos una referencia de las alertas e insertamos un ejemplo,todas las clases utilizadas siendo propias de Bootstrap creando un area de alerta especifico mediante estas clases.

Corremos el servidor:

![p8-4](https://user-images.githubusercontent.com/25621400/58369406-dbb80880-7ef1-11e9-91dd-bfb193b4297e.png)

Al intentar cerrar el mensaje no podemos ya que no hemos incorporado funcionalidades para ello.

## Bringing in Bootstrap JS and jQuery

Tenemos que implementar las funcionalidades de JS con Bootstrap para sus componentes.Tal como los plugins para el webpack,bootstrap js anade funcionalidades a jquery.Para ello necesitamos traer jQuery para las funcionalidades de Bootstrap.
Lo instalamos:
```javascript
npm install --save-dev --save-exact jquery@3.2.1
```

y luego le tenemos que decir a webpack como incorporar jQuery.Anadimos el import:
```javascript
const webpack = require('webpack');
```

Ahora necesitamos el plugin ProvidePlugin para indicar que un cierto modulo provee una cierta variable global JS.

Anadimos esto en la seccion de plugins de la configuracion:
```javascript
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
}),
```
esto indica que el modulo jquery provee las variables globales $ e jQuery.

Anadimos lo siguiente al fichero entry.js:
```javascript
import 'bootstrap';
```
,esto le indica a webpack que entry.js se basa en el modulo de bootstrap.

Corremos el servidor:

![p8-5](https://user-images.githubusercontent.com/25621400/58369407-dce93580-7ef1-11e9-8763-93441cd9f5b7.png)

y vemos como si nos dejo cerrar la alerta.

## Transpiling with TypeScript

Tenemos la estructura basica de la aplicacion pero ahora seguiremos haciendo la funcionalidad de la aplicacion.
Ya que los navegadores son lentos con respecto a Node.js tenemos que encontrar una manera de traducir el JS moderno a un lenguaje comun que los navegadores los puedan entender.

El metodo de de compilar el codigo fuente de un lenguaje de programacion a otro se llama transpiling.Actualmente los transpilers mas comunes son Babel y TypeScript.

Babel "transpila" codigo utilizando las ultimas tecnicas ECMA en un dialecto comun en los navegadores.Puede ser usado en combinacion con Flow,una herramienta de diseno de Facebook,que comprueba el tipo.

TypeScript es un superset de JavaScript que incluye tipeados.El mecanismo de TypeScript transforma el codigo utilizando ECMA sobre el codigo fuente.Como Flow te permite inferir sobre el tipo de las variables y te permite especificar los tipos.

Tanto Babel como TypeScript son faciles de integrar con webpack pero utilizaremos TypeScript ya que hace una comprobacion del tipo a parte del transpiling.Con Babel tendriamos que utilizar Flow para esto.TypeScript tambien tiene un repositorio de la comunidad bastante extenso,el DefinitelyTyped.Los paquetes de este repositorio son accesibles a traves de @types.

Para utilizar TypeScript:
```javascript
npm install --save-dev --save-exact typescript@2.5.3
```

y el plugin para ts:
```javascript
npm install --save-dev --save-exact ts-loader@2.3.7
```

Para hacer un transpil de TypeScript a Javascript necesitaremos un fichero de configuracion tsconfig.json.
```typescript
{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "module": "CommonJS",
        "target": "ES5",
        "lib": ["DOM", "ES2015.Promise", "ES5"],
        "allowJs": true,
        "alwaysStrict": true
    }
}
```

Con esto nos permite definir varias opciones de compilacion
-outDir es el directorio en el que TypeScript deberia emitir los ficheros "transpiled" de JS.
-sourceMap generar un mapa fuente como la salida del transpiling.
-module se utiliza para representar las dependencias transpiladas.
CommonJS es el modulo del sistema conocido por la funcion require para sacar los modulos de los que otros puedan depender.
-target es la version utilizada de ECMA para el output transpiled.
-lib es una colecion de typings que TypeScript deberia seguir(funcionalidades del DOM,promesas,estandar)
-allowJs: para permitir a TypeScript compilar ficheros js y ts fuente.
-alwaysStrict: interpreta el codigo en modo estricto y emitir 'use strict' en los ficheros generados.

Actualizamos el fichero de configuracion de webpack:
```javascript
entry: './app/index.ts',
```

Tambien creamos un directorio para organizar los ficheros de front-end.
En webpack este directorio se llama app.

Tambien modificamos las reglas del module de la configuracion del webpack anadiendo una regla para asociar ts con TypeScript con el plugin de ts-loader.Para ello anadimos la siguiente entrada:
```javascript
{
        test: /\.ts$/,
        loader: 'ts-loader',
}
```

Dentro del directorio app creamos un fichero templates.ts que contendran las diferetenes componentes de la parte html que antes habiamos dividido.
```typescript
	​export​ ​const​ main = ​`​
​ 	​  <div class="container">​
​ 	​    <h1>B4 - Book Bundler</h1>​
​ 	​    <div class="b4-alerts"></div>​
​ 	​    <div class="b4-main"></div>​
​ 	​  </div>​
​ 	​`​;
​ 	
​ 	​export​ ​const​ welcome = ​`​
​ 	​  <div class="jumbotron">​
​ 	​    <h1>Welcome!</h1>​
​ 	​    <p>B4 is an application for creating book bundles.</p>​
​ 	​  </div>​
​ 	​`​;
​ 	
​ 	​export​ ​const​ alert = ​`​
​ 	​  <div class="alert alert-success alert-dismissible fade in" role="alert">​
​ 	​    <button class="close" data-dismiss="alert" aria-label="Close">​
​ 	​      <span aria-hidden="true">&times;</span>​
​ 	​    </button>​
​ 	​    <strong>Success!</strong> Bootstrap is working.​
​ 	​  </div>​
​ 	​`​;
```
,el contenidp de las variables es el mismo que en el fichero entry.js pero ahora no lo asignamos directamente al innerHTML sino los hacemos a traves de export(esto siendo similar al module.exports)

Creamos otro fichero index.ts dentro de app:
```javascript
import​ ​'../node_modules/bootstrap/dist/css/bootstrap.min.css'​;
import 'bootstrap';
import * as templates from './templates.ts';

document.body.innerHTML = templates.main;

const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

mainElement.innerHTML = templates.welcome;
alertsElement.innerHTML = templates.alert;
```

Aqui importamos los ficheros bootstrap necesarios.Importamos todo del fichero templates.ts como una variable comun templates y luego metemos esta informacion dentro de los elementos de la pagina.

Sacamos la referencia del elemento mainElement y alertsElement, elementos que uno sera el contenido principal de la pagina y otra sera elemento de alerta de la pagina.
Luego metemos dentro del contenido principal de la pagina el mensaje de welcome sacado de templates y hacemos lo mismo con la alerta metiendo el mensaje de alerta.

Reinciamos el servidor y comprobamos que es la misma pagina que antes.

![p8-6](https://user-images.githubusercontent.com/25621400/58369408-de1a6280-7ef1-11e9-9410-8eb6417ac6b8.png)

Lo siguiente que haremos es HTML templating, permitiendonos generacion dinamica de HTML, en vez de seguir con strings estaticas.

## Templating HTML with Handlebars

Hasta ahora la aplicacion solo emitia html estatico que no se conoce al principio,por ejemplo el cuadro de alertas siempre contiene Success.Queremos que sea capable de manejar string dinamicos.

Es verdad que ECMA soporta template strings que te permiten inyectar valores a los strings.Sin embargo, asi podrian surgir vulnerabilidades tipo XSS cuando se trabaja con datos introducidos por el usuario.Para protegernos, todo el contenido que el usuario introduzca tendra un control de codificacion adecuado.

Considerando el caso en el que tenemos que mostrar el nombre de un bundle de un usuario se podria implementar asi:
```typescript
export const bundleName = name => `<h2>${name}</h2>`;
```
pero seria erroneo al ser vulnerable ya que solo coge un parametro name y devuelve el nombre dentro de una etiqueta h2.Por lo tanto es vulnerable ya que se le podrian meter scripts/cualquier cosa.

Defenderse de este tipo de vulnerabilidades no es facil pero es verdad que la mayoria de los frameworks modernos ya manejan estos problemas.

Para esta aplicacion utilizaremos Handlebars,una libreria de templating estable que puede operar tanto como una libreria en tiempo de ejecucion en el lado del cliente y un modulo en tiempo de compilacion en el lado de Node.js.
Aqui la utilizaremos como una libreria en el lado del cliente.

Lo instalamos:
```javascript
npm install --save-dev --save-exact handlebars@4.0.10
```

Luego en el fichero de templates.ts en vez de exportar los strings html estaticos,exportamos las templates handlebars compiladas.
```typescript
import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
  <div class="container">
    <h1>B4 - Book Bundler</h1>
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
  </div>
`);

export const welcome = Handlebars.compile(`
  <div class="jumbotron">
    <h1>Welcome!</h1>
    <p>B4 is an application for creating book bundles.</p>
  </div>
`);

export const alert = Handlebars.compile(`
  <div class="alert alert-{{type}} alert-dismissible fade in" role="alert">
    <button class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
    {{message}}
  </div>
`);
```

Para cada una de las constantes exportadas,la string html se le pasa a Handlebars.compile().Esto produce una funcion que tiene como parametro un objeto(un mapa de parametros) y retorna un string con los elementos a reemplazar correspondientes.
Los dos primeros de template son igules que antes, no cogen ningun parametro y retorna la string estatica.
El tercer elemento de la template alert coge un objeto con dos miembros {type} y {message},el valor type siendo utilizado el nombre alert- de la clase css que fija el color del cuadro de alerta.
Los cuatro posibles valores son success(verde),info(azul),warning(yellow),danger(red).El valor message es el valor que se introduce dentro de el cuadro de alerta.

Luego actualizamos el fichero index.ts para actualizar los miembros de template para ser llamados en vez de utilizar los strings estaticos directamente.
```typescript
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import * as templates from './templates';

document.body.innerHTML = templates.main();
const mainElement = document.body.querySelector('.b4-main');
const alertsElement = document.body.querySelector('.b4-alerts');

mainElement.innerHTML = templates.welcome();
alertsElement.innerHTML = templates.alert({
  type: 'info',
  message: 'Handlebars is working!',
});
```
Ahora llamamos para sacar la referencia al elemento templates.main y templates.welcome con templates.main() y templates.welcome() y dentro de la llamada de templates.alert() le pasamos los dos parametros que van a ser el tipo, en este caso info y el mensaje que va a generar en el cuadro de alerta.

En el servidor observamos como el cuadro de alerta es azul, al ser de informacion y tiene el mensaje que le hemos pasado.

Luego crearemos mas funcionalidades.

## Implementing hashChange Navigation

La aplicacion que desarrollamos se podria considera una aplicacion de una sola pagina pero el comportamiento de la aplicacion es manejado por la interaccion del usuario y los datos se introducen a traves de las APIs RESTful JSON.

A diferencia de las paginas del servidor que cada una vive bajo una cierta url,el usuario solo hace peticiones a la primera pagina y su contenido asociado(js,css,img).
Para manejar todos los cambios de la aplicacion a medida que el usuario navega utilizaremos el url hash(#).Nos referiremos a cada pagina que el usuario navega como una vista.La pagina por defecto sera la de #welcome.
Para implementar este mecanismo anadimos lo siguiente al index.ts:
```typescript
const showView = async () => {
    const [view, ...params] = window.location.hash.split('/');
  
    switch (view) {
      case '#welcome':
        mainElement.innerHTML = templates.welcome();
        break;
      default:
        // Unrecognized view.
        throw Error(`Unrecognized view: ${view}`);
    }
  };
```

La funcion asincrona empieza leyenda el window.location.hash separandolo por el '/'.Esto nos permitira tener una vista parametrizada tal como #view-bundle/BUNDLE_ID.

Luego ponemos una funcion switch en funcion del valor de view y en caso de que sea la de #welcome entonces fijamos los elementos del mainElement que contenga la template html.Si el encontrado no es reconocido entonces mandamos un error con la vista que se ha pasado.

Para invocar a showView() anadimos lo siguiente:
```typescript
window.addEventListener('hashchange',showView);
```
cuando el hash de la url se modifica,el objeto window emite un evento de hashchange y llamaremos a la funcion showView().
La pagina inicial no dispara el evento de hashchange, y para ello tendriamos que llamar a showView() explicitamente.
```typescript
showView().catch(err => window.location.hash = '#welcome');
```

Aqui llamamos a showView() directamente retornando una promesa.En caso de que el hash no sea reconocido se devuelve el de la pagina por defecto #welcome.

![p8-7](https://user-images.githubusercontent.com/25621400/58369416-e377ad00-7ef1-11e9-9143-1c67d2554efa.png)

vemos como nos devuelve la pagina inicial sin la alerta con la ruta de la pagina de inicio(#welcome).

Proseguiremos empleando vistas que cargan datos de los servicios web desarrollados en los capitulos anteriores.


## Listing Objects in a View

Con webpack dev server es facil ver el output renderizado generado del contenido estatico.Pero ahora queremos acceder a los servicios web implementados en las practicas anteriores.

Seria ideal tener un servidor Node.js que maneje el contenido estatico de front-end y las peticiones a la API.

Con webpack dev server podemos configurar proxies en webpack.config.js que se dirigien a los endpoints de la API y redirigen los resultados.


### Configuring a webpack-dev-server Proxy

Normalmente las paginas web tienen unas reglas muy estrictas sobre las condiciones en las que una pagina se puede conectar a un servicio.Un proxy es un endpoint que actua como una pasarela a otro servicio.Configurando los proxys de webpack-dev-server es una manera para proporcionar aceso a servicios.

Anadimos la configuracion de webpack dentro de devServer:
```javascript
devServer: {
    contentBase: distDir,
    port: 60800,
    proxy: {
      '/api': 'http://localhost:60702',
      '/es': {
        target: 'http://localhost:9200',
        pathRewrite: {'^/es' : ''},
      }
    },
  },
```

Esto especifica que las peticiones a '/api' se envian tal cual al servicio que esta corriendo en el puerto 60702,siendo el servidor express definido en el capitulo 7.
Tambien se especifican que las peticiones a '/es',y entrariamos directamente a ES.(esto lo hacemos ya que no tenemos api's para usuarios concretos para que necesitemos autenticacion,al menos de momento).

Las APIs de ES comienzan en la raiz y por lo tanto necesitariamos quitar el '/es' del comienzo de la linea.Podriamos utilizar la misma tecnica para hacer peticiones proxy a otros servicios tambien pero debemos tener cuidado con que hacemos proxy.Los servicios proxys pueden llegar a ser vulnerables cuando dan aceso a otros servicios o niveles de privilegios de esos servicios que no deberian ser accesibles por el usuario final.

Necesitamos correr tanto el servidor de webpack-dev-server como el servidor de la practica 7 junto con elasticsearch.

![p8-8](https://user-images.githubusercontent.com/25621400/58369415-e377ad00-7ef1-11e9-931b-70401ec5daf8.png)

### Implementing a View

Para implementar una vista que muestra los bundles de un usuario, necesitamos sacar los bundles de forma asincrona del servidor y luego anadir una funcion que renderiza la lista utilizando la template de Handlebars para producir un html y luego necesitamos anadir la ruta hash a la funcion showView.

En index.ts insertamos la funcion asincrona de getBundles:
```typescript

const getBundles = async() => {
    const esRes = await fetch('/es/b4/bundle/_search?size=1000');

    const esResBody = await esRes.json();

    return esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
    }));
};
```

este metodo hace una peticion asincrona a Elasticsearch con el metodo de fetch devolviendo una promesa realizando una peticion http con unos parametros concretos,en este caso le decimos que esperamos sacar 1000 bundles de ElasticSearch del bundle con indice b4.

La API fetch es relativamente nueva frente a XMLHttpRequest.
fetch es bastante similar a request-promise,una diferencia notable es la manera en la cual el contenido del body de respuesta es manejado.Para decodificar el contenido del body como JSON con el fetch de la API necesitamos llamar al metodo de respuesta json,que a su vez es otra funcion asincrona que devuelve una promesa. En las dos llamadas hacemos uso del await para esperar hasta que las promesas se resuelvan/rechazan.

Una vez que el cuerpo del json ha sido decodificado, extraemos los resultados de ElasticSearch como un array de objetos,cada uno conteniendo el id del documento y el nombre del bundle.
En caso de que se produzca un fallo la promesa queda rechazada.

Tambien dentro de index.ts anadimos la funcion de listBundles para renderizar la lista de bundles utilizando la template de HandleBars.
```typescript
const listBundles = bundles => {
    mainElement.innerHTML = templates.listBundles({bundles});
};
```

de momento esta funcion solo renderiza los bundles utilizando una template de handlebars tambien llamada listBundles.

Necesitamos modificar la funcion de showView() para anadir un manejador para la ruta #list-bundles
```typescript
case '#list-bundles':
    const bundles = await getBundles();
    listBundles(bundles);
    break;
```

Luego anadimos la implementacion de la template de listBundles:
```typescript
export const listBundles = Handlebars.compile(`
  <div class="panel panel-default">
    <div class="panel-heading">Your Bundles</div>
    {{#if bundles.length}}
      <table class="table">
        <tr>
          <th>Bundle Name</th>
          <th>Actions</th>
        </tr>
        {{#each bundles}}
        <tr>
          <td>
            <a href="#view-bundle/{{id}}">{{name}}</a>
          </td>
          <td>
            <button class="btn delete" data-bundle-id="{{id}}">Delete</button>
          </td>
        </tr>
        {{/each}}
      </table>
    {{else}}
      <div class="panel-body">
        <p>None yet!</p>
      </div>
    {{/if}}
  </div>
`);
```

Este template utiliza el array de bundle pasado para renderizar un panel de bootstrap con una tabla de 2 columnas.La columna izquierda 
contiene el nombre del bundle y en la otra columna hay un boton de borrar que te permite borrar el bundle(sin embargo no esta puesto en funcionamiento)
Utiliza varias funcionalidades de handlebars como el {{#if else}}
, que en funcion de si hay bundle {{#if bundles.length}} se renderiza la tabla y si no se anade un mensaje de "None yet!".
El {{#each}} itera sobre los bundles y crea una nueva fila para cada uno y agrega dos celdas una conteniendo el nombre y la otra el boton.
Utilizamos el {{name}} y el {{id}} para referirnos al nombre y el id del bundle al que se hace referencia en el momento actual.

El nombre de la columna tambien hace referencia a #view-bundle/{{id}} permitiendonos llevar a una vista viendo el bundle en cuestion.
El boton de borrar tambien viene referenciado por el id del bundle para saber que bundle estamos borrando.

![p8-9](https://user-images.githubusercontent.com/25621400/58369414-e377ad00-7ef1-11e9-8f15-7954243115b8.png)

y tras anadir algunos bundles con:
```javascript
curl -s -X POST localhost:60702/api/bundle?name=X | jq '.'
```
![p8-10](https://user-images.githubusercontent.com/25621400/58369413-e2df1680-7ef1-11e9-96cc-1017044c0df0.png)

Vamos a proceder a anadir un nuevo bundle.

## Saving Data with a form

Procedemos a anadir una funcionalidad para permitir anadir bundles directamente desde la aplicacion web.Esto lo hacemos utilizando la etiqueta form de html,con esto podemos coger input del usuario y procesarlo haciendo una llamada proxy a la API.
Anadimos lo siguient al template:
```typescript
export const addBundleForm = Handlebars.compile(`
    <div class="panel panel-default">
      <div class="panel-heading">Create a new bundle.</div>
      <div class="panel-body">
        <form>
          <div class="input-group">
            <input class="form-control" placeholder="Bundle Name" />
            <span class="input-group-btn">
              <button class="btn btn-primary" type="submit">Create</button>
            </span>
         </div>
        </form>
    </div>
    </div>
`);
```

 Tal como la template de listBundles(),esta template crea un panel para almacenar los contenidos,creamos un form con un input donde el usuario pueda introducir el nombre del bundle y un boton de submit.

 Luego actualizamos el index.ts:
 ```typescript

 const listBundles = bundles => {
     mainElement.innerHTML =
        templates.addBundleForm() + templates.listBundles({bundles});

    const form = mainElement.querySelector('form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.querySelector('input').value;
        addBundle(name);
    });
 };
 ```
Anadimos al elemento html tanto el form de anadir bundle y tambien la de mostrar los bundles.Cogemos una referencia del elemento form, y anadimos un manejador de eventos que en caso de que se haga un submit se cree un nuevo bundle con ese nombre.Se utiliza preventDefault para que no se tenga que navegar a otra pagina/tomar otra accion.Con el nombre del bundle llamamos al addBundle().

Creamos la funcion addBundle() que coge el nombre del bundle y asincroneamente lo anade y luego actualiza la lista.En caso de exito o fallo tenemos que informar al usuario y por eso creamos una funcion para ello.
```typescript
const showAlert = (message, type= 'danger') => {
    const html = templates.alert({type,message});
    alertsElement.insertAdjacentHTML('beforeend',html);
};
```
Esta funcion coge el mensaje y el tipo de alerta y genera un cuadro de alerta con ello y luego lo anade al final del elemento alertsElement.

Por ultimo anadimos la funcion de addBunble():
```typescript

const addBundle = async (name) => {
    try{
        //list of created bundles
        const bundles = await getBundles();

        // add the new bundle
        const url = `/api/bundle?name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {method: 'POST'});
        const resBody = await res.json();

        //add new bundle to the original list
        bundles.push({id: resBody._id, name});
        listBundles(bundles);

        showAlert(`Bundle "${name}" has been created!`, 'success');
    }
    catch(err){
        showAlert(err);
    }
};
```
Definimos primero un bloque try-catch para manejar las excepciones y las promesas rechazadas.Luego con un await esperamos que se nos devuelva una lista de bundles.Tenemos que coger la lista actualizada ya que el usuario puede que lo haya modificado desde otra pestana.

Luego a partir del la url con el nombre del bundle a anadir hacemos una peticion post para crear el bundle.Una vez que se haya anadido cogemos el objeto json de respuesta que nos devuelve entre otros el id del bundle.Luego anadimos el bundle al array de los otros bundles con su id y su nombre y luego llamamos a listBundles para obtener la nueva lista de bundles.Llamamos a showAlert() para que nos diga que la operacion ha tenido exito en otro caso se llamaria a showAlert() con el error que haya surgido.

Una mala interpretacion de esto seria anadir el bundle y luego pedir la lista ya que surgia algo llamado "eventual consistency", que significa que hay un cierto delay entre los cambios con exito realizados sobre los datos y los resultados de las consultas.
Esto seria una mala implementacion:
```typescript
const addBundle = async (name) => {
    try{

        // add the new bundle
        const url = `/api/bundle?name=${encodeURIComponent(name)}`;
        const res = await fetch(url, {method: 'POST'});
        const resBody = await res.json();

        // Grab the list of all bundles,excepting the new one to be in the list
        //Due to eventual consistency,the new bundle may be missing
        const bundles = await getBundles();
        listBundles(bundles);

        showAlert(`Bundle "${name}" has been created!`, 'success');
    }
    catch(err){
        showAlert(err);
    }
};
```
Aqui lo primero que hacemos es una peticion post para anadir el bundle y luego sacamos la lista de bundles con getBundles(),incluido el ultimo bundle anadido.El problema no es el orden en los que se hacen ademas que como las funciones son llamadas con await tendran que esperar hasta que se resulven.Sin embargo el problema es que hay poco tiempo entre la finalizacion de la peticion post y la peticion para obtener los bundles,y por lo tanto es posible que no se haya actualizado con el bundle nuevo al hacer la llamada para obtener los bundles.
Pero este problema no es solo de ElasticSearch sino que tambien ocurre en SQL y una manera de hacerlo es con un servidor central que recibe las peticiones de escritura y luego las replica a otros servidores de solo lectura para las consultas.
Esta es una buena manera para manejarse contra resultados no esperados por culpa de "eventual consistency".

Si visitamos otra vez #list-bundles:

![p8-11](https://user-images.githubusercontent.com/25621400/58369412-e2df1680-7ef1-11e9-93d1-22346f53543b.png)

![p8-12](https://user-images.githubusercontent.com/25621400/58369411-e2468000-7ef1-11e9-9bc5-209a971512b4.png)

## Wrapping up

En este capitulo hemos aprendido como hacer un proyecto front-end con Node.js utilizando webpack utilizando tambien Bootstrap.
Hemos configurado TypeScript para transpilar y comprobacion del tipo para el codigo.
Para manejar el codigo sincrono/asincrono hemos utilizado funciones asincronas con metodos que devolvian promesas.
Hemos utilizado una libreria de templating como Handlebars para generar html.

## Extracting Text

En el proyecto se coge todo el css de bootstrap y se pone en una etiqueta "<style>" del index.html,pero esto no es la manera correcta de hacerlo sino es hacer un fichero a parte que contenga todo esto.

Vamos a incorporar el extract-text-webpack-plugin al proyecto.

Instalamos y luego modificamos el webpack.config.js:
```javascript
const ExtractTextPlugin = require("extract-text-webpack-plugin");
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
new ExtractTextPlugin("styles.css"),
```
,con esto importamos el modulo y modificamos la regla para que el css se cargue de esta menra, luego creando una nueva instancia que creara el fichero .css con los estilos.

## Deleting Bundles

Otra funcionalidad de la aplicacion deberia ser la de borrar bundles a traves de los botones de Delete.

Primero anadimos esto a la funcion listBundles():
```typescript
const deleteButtons = mainElement.querySelectorAll('button.delete');
for (let i=0; i < deleteButtons.length;i++){
    const deleteButton = deleteButtons[i];
    deleteButton.addEventListener('click', event => {
        deleteBundle(deleteButton.getAttribute('data-bundle-id'));
    });
}
```
Esto selecciona el boton de la tabla y pone un manejador de eventos que en caso de click se extrae el id del bundle del atributo data-bundle id y se borra el bundle mediante la funcion deleteBundle().

La funcion asincrona de esto seria:
```typescript
/**
 * Delete the bundle with the specified ID, then list bundles.
 */
const deleteBundle = async (bundleId) => {
    try {
        // Delete the bundle, then render the updated list with listBundles().

        showAlert('Bundle deleted!', 'success');
    }
    catch(err){
        showAlert(err);
    }
};
```

dentro de este bloque debemos hacer lo siguiente:
-getBundles() para obtener la lista de bundles
-encontrar el indice dentro de la lista de bundleId de la lista.
-hacer una peticion delete utilizando fetch() con el bundleId.
-borrar el bundle de la lista con splice,y el indice.
-renderizar la lista con listBundle() y mensaje de exito con showAlert().

Si ocurre algun error deberia cogerlo por el catch y llamar a showAlert() con la alerta.
```typescript
const deleteBundle = async (bundleId) => {
    try {
    const bundles = await getBundles();

    const idx = bundles.findIndex(bundle => bundle.id === bundleId);
    if (idx === -1) {
      throw Error(`No hay bundle con el id: "${bundleId}"`);
    }

    const url = `/api/bundle/${encodeURIComponent(bundleId)}`;
    await fetch(url, {method: 'DELETE'});

    bundles.splice(idx, 1);

    listBundles(bundles);

    showAlert(`Bundle deleted!`, 'success');
  } catch (err) {
    showAlert(err);
  }
};
```

Como se ha mencionado anteriormente primero se sacan los bundles siendo otra vez una funcion await esperando a que la promesa se resuelva, y luego buscamos dentro del array de bundles que hemos obtenido el id que queremos borrar.En caso de que no existe mandamos un error.
Hacemos una peticion a la url que acaba con el id del bundle de tipo delete y luego sacamos ese bundle de la lista y actualizamos la lista.

Comprobamos en el navegador

Antes de borrar:

![p8-13](https://user-images.githubusercontent.com/25621400/58369410-e2468000-7ef1-11e9-94de-3eccc969be2a.png)

Despues:

![p8-14](https://user-images.githubusercontent.com/25621400/58369409-e2468000-7ef1-11e9-99f5-d511b18c4b5c.png)

