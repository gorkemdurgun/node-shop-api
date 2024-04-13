const express = require("express");
const app = express();

// app.use metodu ile middleware ekleyebiliriz.
// res.status(200).json metodu ile response döndürebiliriz.
// req, res ve next parametrelerini kullanabiliriz.
// next metodu ile bir sonraki middleware'e geçebiliriz.
// next metodu çağrılmazsa, sonraki middleware çalıştırılmaz.
// app.use metodu ile bir route belirtilmezse, tüm requestler için çalışır.

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

module.exports = app;
