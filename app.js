const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

/* 
Morgan, requestlerin loglarını konsola yazdırmak için kullanılır. Requestlerin loglarını yazdırmak için kullanılır.
Morgan, geliştirme ve production modlarında farklı loglar çıktırır, geliştirme modunda daha detaylı loglar çıktırır.
*/
app.use(morgan("dev"));

/*
Body-parser, requestlerdeki body verilerini okumak için kullanılır.
.urlencoded metodu, URL encoded verileri okumak için kullanılır. extended: false, sadece basit URL encoded verileri okumak için kullanılır.
.json metodu, JSON verileri okumak için kullanılır.
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
app.use metodu, middleware fonksiyonlarını tanımlamak için kullanılır. Middleware fonksiyonları, request ve response objelerine erişebilir.
Middleware fonksiyonları, request ve response objelerini değiştirebilir ve next metodu ile bir sonraki middleware'e geçebilir.
*/
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

/*
Aşağıdaki middleware fonksiyonu, tanımlanmış olan route'lar dışında bir route'a istek yapıldığında çalışır.
*/
app.use((req, res, next) => {
  const error = new Error("This route is not found.");
  error.status = 404;
  next(error);
});

/*
Aşağıdaki middleware fonksiyonu, hata oluştuğunda çalışır. Hata oluştuğunda, hata mesajını ve status kodunu döndürür.
*/
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }

  res.json({
    error: {
      message: error.message,
    },
  });
});

/*
module.exports metodu, app.js dosyasını require eden dosyalarda app değişkenini kullanabilmek için kullanılır.
*/
module.exports = app;
