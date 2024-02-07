//se importa express de una manera mas actual,agregar en package.json:  "type": "module"
import express from "express";
import fs from "fs";

//Se debe agregar un middlewere
import bodyParser from "body-parser";

//se crea un objeto para poder trabajar con express
const app = express();

//Usando middlewere, de esta manera, los endpoints, logran interpretar los json enviados desde requests.http
app.use(bodyParser.json());

//leer datos con funcion asincrona
const readData = () =>{
    try{
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    }
    catch(error){
        console.log(error);
    }
}

//Escritura de datos con funcion asincrona
const writeData = (data) =>{
    try{
        fs.writeFileSync("./db.json", JSON.stringify(data));
    }
    catch(error){
        console.log(error);
    }
}

//Servidor escuchando en el puerto 3000
const PORT = 3000;
app.listen(PORT,()=>{   
    console.log("El servidor esta encendido: localhost:"+ PORT);
});


//configurando ruta por defecto
app.get("/", (req,res)=>{
    res.send("xd");
});

//ENDPOINTS
app.get("/books",(req,res)=>{
    const data = readData();
    res.send(data.books);
});

app.get("/books/:id",(req,res)=>{
    const id = req.params.id;
    const data = readData();
    const dataId = data.books.find(book => book.id==id);
    res.send(dataId);
});

app.post("/books",(req,res)=>{
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    }
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

app.put("/books/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  data.books[bookIndex] = {
    ...data.books[bookIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Book updated successfully" });
});

app.delete("/books/:id",(req,res)=>{
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex,1);
    writeData(data);
    res.json({ message: "Book updated successfully" });
});