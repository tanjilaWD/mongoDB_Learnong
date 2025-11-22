const express = require("express");
const mongoose = require('mongoose');

const app = express();

const port = 3002;
 
app.use(express.json())
app.use(express.urlencoded({extended: true}));

//create product schema
const productSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

// create product model
const Product = mongoose.model("products", productSchema);

const connectDB = async () =>{
     try{
       await mongoose.connect('mongodb://127.0.0.1:27017/learningDB');
       console.log('db is connected');
     }catch(error){
    console.log('db is not connected');
    console.log(error.message);
    process.exit(1); 
     }
};

app.get("/", (req,res)=>{
    res.send('Welcome to home page');
});
//CRUD - Create, Read, Update, Delete

//POST: /products -> create a product
app.post("/products", async  (req,res)=>{
   try{
    const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        description:req.body.description
    });
 
   const productData = await newProduct.save();

    res.status(201).send({productData});
    } catch(error){
    res.status(500).send({message: error.message});
   }
});
//GET: /products -> Return all the products
app.get('/products', async (req,res)=>{
   try{
   const products = await Product.find().limit(2);
   if (products){
    res.status(200).send({
        success: true,
       message: 'return all products',
       data: products 
    })
   }else{
     res.status(404).send({
        success: false,
        message: 'products not found',
    });
   }
   } catch(error){
    res.status(500).send({message: error.message});
   }
});



//GET: /products/:id -> return a specific product
app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id });

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'product not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'return single product',
            data: product
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


app.get("/products", async(req,res) =>{
    try{

    } catch(error){

    }
});

app.listen(port, async()=>{
    console.log(`server is running at http://localhost:${port}`);
    await connectDB();

});

// Database -> collections -> document

//POST: /products -> create a product
//GET: /products -> Return all the products
//GET: /products/:id -> return a specific product
//PUT: /products/:id -> update a product based on id
// DELETE: /products/:id -> delete a product based on id