import { promises as fs } from "fs";

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ title, description, price, image, code, stock, category, thumbnail }) {
    try {
      const arrayProductos = await this.leerArchivo();

      if (!title || !description || !price || !image || !code || !stock || !category || !thumbnail) {
        console.log("Tienes que completar todos los campos");
        return;
      }

      if (arrayProductos.some(item => item.code === code)) {
        console.log("No puedes repetir el código");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        image,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnail || []
      };

      if (arrayProductos.length > 0) {
        ProductManager.ultId = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
      }

      newProduct.id = ++ProductManager.ultId;

      arrayProductos.push(newProduct);
      await this.guardarArchivo(arrayProductos);
    } catch(error) {
      console.log("Error al agregar el producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const arrayProductos = await this.leerArchivo();
      return arrayProductos;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductsById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find(item => item.id === id);

      if (!buscado) {
        console.log("No encontramos el producto");
        return null;
      } else {
        console.log("Lo encontramos!");
        return buscado;
      }
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("No puedo leer el archivo", error);
      throw error;
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
      throw error;
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      
      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos[index] = { ...arrayProductos[index], ...productoActualizado };
        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar la información del producto", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerArchivo();

      const index = arrayProductos.findIndex(item => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Eliminaste el producto");
      } else {
        console.log("No se encontró ese producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

export default ProductManager;
