const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

/* 
Morgan, requestlerin loglarını konsola yazdırmak için kullanılır. Requestlerin loglarını yazdırmak için kullanılır.
Morgan, geliştirme ve production modlarında farklı loglar çıktırır, geliştirme modunda daha detaylı loglar çıktırır.
*/
app.use(morgan("dev"));

/*
MongoDB, NoSQL veritabanıdır. MongoDB, JSON benzeri belgeleri depolamak için kullanılır.
*/
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tmtggzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

/*
Body-parser, requestlerdeki body verilerini okumak için kullanılır.
.urlencoded metodu, URL encoded verileri okumak için kullanılır. extended: false, sadece basit URL encoded verileri okumak için kullanılır.
.json metodu, JSON verileri okumak için kullanılır.
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
Aşağıdaki middleware fonksiyonu, CORS hatalarını engellemek için kullanılır. Bu middleware fonksiyonu, tüm isteklere CORS header'larını ekler.
res.header metodu, response header'larını tanımlamak için kullanılır. 
Access-Control-Allow-Origin header'ı, hangi origin'lerin bu API'ye erişebileceğini belirler.
Access-Control-Allow-Headers header'ı, hangi header'ların bu API'ye erişebileceğini belirler.
OPTIONS metodu, bir isteğin CORS header'larını kontrol etmek için kullanılır. Eğer bir istek OPTIONS metodu ile gönderilirse, sadece CORS header'larını kontrol eder ve gerçek isteği yapmaz.
*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }

  next();
});

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
