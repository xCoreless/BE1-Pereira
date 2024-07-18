import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";



const app = express();
const PUERTO = 8080;

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("./src/public"));

//plantillasBigote
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//rutas
app.use("/api/produts", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});


import ProductManager from "./controllers/product-manager.js";
const productManager = new ProductManager("./src/models/productos.json");

const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("entró un cliente!");

    //1array productos
    socket.emit("productos", await productManager.getProducts());

    //2evento eliminarProducto
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id); 

        //3devuelve lista actualizada
        io.sockets.emit("productos", await productManager.getProducts());
    })
    //2recibimos el producto
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        
        //3devuelve lista actualizada
         io.sockets.emit("productos", await productManager.getProducts());
    })

    // 2Add productos con un form
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);

        //3devuelve lista actualizada
        io.sockets.emit("productos", await productManager.getProducts());
    })
})


