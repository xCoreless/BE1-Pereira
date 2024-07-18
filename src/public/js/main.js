const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);  
})

//fn render productos
const renderProductos = (data) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
        // usamos esta linea para que no se dupliquen los productos
     contenedorProductos.innerHTML = "";
    data.forEach(item =>{
        const card = document.createElement("div");

        card.innerHTML = `  <p> ${item.id} </p>
                            <p> ${item.title} </p>
                            <p> ${item.price} </p>
                            <button> eliminar </button>
                        `
        contenedorProductos.appendChild(card);
        
        //ahora el botón tiene poderes
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        })
    })     
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

    //Add productos con form
document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    }
    socket.emit("agregarProducto", producto);
}