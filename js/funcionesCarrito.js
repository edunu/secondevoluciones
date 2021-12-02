//importamos el achivo de funciones y accedemos al objeto de la bd y funciones
import tiendabd, {consultar} from './funciones.js';

/*Referenciamos a la base de datos tienda y a la tabla productos*/
let bd=tiendabd("Tienda", {productos:`++id,nombre, precio,imagen`});

//Arreglo donde se almacenarán los productos recuperado de la bd
var baseDeDatos=[];
//Arreglo de productos del carrito
var carrito = [];

var total = 0;
//Referencias a los elementos de html conde se visualizará la lista de productos y carrito
const DOMitems = document.getElementById("items");
const DOMcarrito = document.getElementById("carrito");
const DOMtotal = document.getElementById("total");
const DOMbotonVaciar = document.getElementById("boton-vaciar");
const miLocalStorage = window.localStorage;

// Evento para vaciar el carrito
DOMbotonVaciar.addEventListener("click", vaciarCarrito);

window.onload=() =>{
    //Al cargar la página se muestran los productos de la bd
    consultarProductos();
    //Se carga recuperan los ddatos del carrito actual
    cargarCarritoDeLocalStorage();
    //Calcula total
    calcularTotal();
    //se viaualizan los productos del carrito actual
    renderizarCarrito();

    }

  

  // Funciones


    /**
     * Evento para añadir un producto al carrito de la compra
     */
    function anyadirProductoAlCarrito(evento) {
      // Anyadimos el Nodo a nuestro carrito
      carrito.push(evento.target.getAttribute("marcador"));
      // Calculo el total
      calcularTotal();
      // Actualizamos el carrito
      renderizarCarrito();
      // Actualizamos el LocalStorage
      guardarCarritoEnLocalStorage();
    }

    /**
     * Dibuja todos los productos guardados en el carrito
     */
    function renderizarCarrito() {
      // Vaciamos todo el html
      DOMcarrito.textContent = "";
      // Quitamos los duplicados
      const carritoSinDuplicados = [...new Set(carrito)];
      // Generamos los Nodos a partir de carrito
      carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          // ¿Coincide las id? Solo puede existir un caso
          return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
          // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
          return itemId === item ? (total += 1) : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement("li");
        miNodo.classList.add("list-group-item", "text-right", "mx-2");
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - $${miItem[0].precio}`;
        // Boton de borrar
        const miBoton = document.createElement("button");
        miBoton.classList.add("btn", "btn-danger", "mx-5");
        miBoton.textContent = "X";
        miBoton.style.marginLeft = "1rem";
        miBoton.dataset.item = item;
        miBoton.addEventListener("click", borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
      });
    }

    /**
     * Evento para borrar un elemento del carrito
     */
    function borrarItemCarrito(evento) {
      // Obtenemos el producto ID que hay en el boton pulsado
      const id = evento.target.dataset.item;
      // Borramos todos los productos
      carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
      });
      // volvemos a renderizar
      renderizarCarrito();
      // Calculamos de nuevo el precio
      calcularTotal();
      // Actualizamos el LocalStorage
      guardarCarritoEnLocalStorage();
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
      // Limpiamos precio anterior
      total = 0;
      // Recorremos el array del carrito
      carrito.forEach((item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
          return itemBaseDatos.id === parseInt(item);
        });
        total = total + parseInt(miItem[0].precio);
      });
      // Renderizamos el precio en el HTML
      DOMtotal.textContent = total.toFixed(2);
    }

    /**
     * Varia el carrito y vuelve a dibujarlo
     */
    function vaciarCarrito() {
      // Limpiamos los productos guardados
      carrito = [];
      // Renderizamos los cambios
      renderizarCarrito();
      calcularTotal();
      // Borra LocalStorage
      localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
      miLocalStorage.setItem("carrito", JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
      // ¿Existe un carrito previo guardado en LocalStorage?
      if (miLocalStorage.getItem("carrito") !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem("carrito"));
      }
    }




function consultarProductos(){
    
   //consultamos todos los productos de la bd
        consultar(bd.productos, (productos) => {
            if (productos){
              //si hay productos empezamos la estructura de la vista
      
                // Estructura de etiqueta de div para el nuevo producto
              const miNodo = document.createElement("div");
              miNodo.classList.add("card", "col-sm-4");
              // Body
              const miNodoCardBody = document.createElement("div");
              miNodoCardBody.classList.add("card-body");
        
                var producto = {};
                    for (const atributo in productos) {
                
                        /*Recuperamos cada valor del producto, sele asigna un nombre y se adjunta 
                        al arreglo de productos ya que el arreglo es utilizado para procesar el carrito*/
                        if (atributo === 'id') {
                            producto.id = productos[atributo];
                        }
                        else if (atributo === 'nombre') {
                          // Titulo
                          //se agrega el nombre del producto al objeto
                            producto.nombre = productos[atributo];
                            //Se crea una etiqueta con el valor de nombre del producto
                            var miNodoTitle = document.createElement("h5");
                            miNodoTitle.classList.add("card-title");
                            miNodoTitle.textContent = productos[atributo];
                           
                        }
                        else if (atributo === 'precio') {
                           // Precio
                           //se agrega el precio del producto al objeto
                           producto.precio = productos[atributo];
                           //Se crea una etiqueta con el valor de precio del producto
                            var miNodoPrecio = document.createElement("p");
                            miNodoPrecio.classList.add("card-text");
                            miNodoPrecio.textContent = "$" + productos[atributo];
                           
                        }
                        else if(atributo === 'imagen') {
                          // Imagen
                          //se agrega la ruta de la imagen del producto al objeto
                            producto.imagen = productos[atributo];
                            //se agrega el objeto al arreglo de productos
                            baseDeDatos.push(producto);
                            //Se crea una etiqueta con el valor de precio del producto
                              var miNodoImagen = document.createElement("img");
                              miNodoImagen.classList.add("img-fluid");
                              miNodoImagen.setAttribute("src", productos[atributo]);
                            
                            // Boton
                            //Se crea un boton para agregar el producto al carrito
                              var miNodoBoton = document.createElement("button");
                              miNodoBoton.classList.add("btn", "btn-primary");
                              miNodoBoton.textContent = "+";
                              miNodoBoton.setAttribute("marcador", producto.id);
                              miNodoBoton.addEventListener("click", anyadirProductoAlCarrito);
                              // Insertamos cada etiwueta creada en la vista
                              miNodoCardBody.appendChild(miNodoImagen);
                              miNodoCardBody.appendChild(miNodoTitle);
                              miNodoCardBody.appendChild(miNodoPrecio);
                              miNodoCardBody.appendChild(miNodoBoton);
                              miNodo.appendChild(miNodoCardBody);
                              DOMitems.appendChild(miNodo);
                           
                           
                        }
                        
                    }
            
            }
      
            
        });
      
}

