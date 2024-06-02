const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.te53hfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const UserCollection = client.db("MoneyMate").collection("users");

    app.post('/signup', async (req, res) => {
      const { username, email, password } = req.body;
      const existingUser = await UserCollection.findOne({ email });
      if (existingUser) {
        return res.status(409).send({ error: "Email already in use, login instead" });
      }
    
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);
    
      await UserCollection.insertOne({ username, email, password: hashedPassword });
      res.status(201).send({ message: "User created successfully" });
    });

    app.post('/login', async (req, res) => {
      const { email, password } = req.body;
      const user = await UserCollection.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).send({ error: "Invalid password" });
      }
      const token = jwt.sign({ email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).send({user:{email: user.email, username: user.username}, message: "Login successful", token: token });
    } );

  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello MoneyMate');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
