const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
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
    const IncomeCollection = client.db("MoneyMate").collection("incomes");
    const ExpenseCollection = client.db("MoneyMate").collection("expenses");
    const CategoryCollection = client.db("MoneyMate").collection("categories");

    const SavingsCollection = client.db("MoneyMate").collection("savings");
    const GoalCollection = client.db("MoneyMate").collection("goals");


    //,,,,,,,,,,,,,
    app.post('/goal', async (req, res) => {
      const { email, name, amountNeeded, contribution } = req.body;
      try {
        const goal = await GoalCollection.insertOne({ email, name, amountNeeded: parseFloat(amountNeeded), contribution: parseFloat(contribution) });
        res.status(201).send(goal);
      } catch (error) {
        res.status(400).json({ message: 'Error creating goal.' });
      }
    });
    
    app.get('/goals/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const goals = await GoalCollection.find({ email }).toArray();
        res.status(200).send(goals);
      } catch (error) {
        res.status(400).json({ message: 'Error retrieving goals.' });
      }
    });
    
    app.patch('/goal/:id', async (req, res) => {
      const { id } = req.params;
      const { contribution } = req.body;
      try {
        const goal = await GoalCollection.findOne({ _id: new ObjectId(id) });
        const updatedContribution = goal.contribution + parseFloat(contribution);
        const updatedGoal = await GoalCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { contribution: updatedContribution } }
        );
        res.status(200).send(updatedGoal);
      } catch (error) {
        res.status(400).json({ message: 'Error updating goal contribution.' });
      }
    });

    app.delete('/goal/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const goal = await GoalCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(goal);
      } catch (error) {
        res.status(400).json({ message: 'Error deleting goal.' });
      }
    });

    //.....................
    app.post('/savings', async (req, res) => {
      const { email, source, amount, date } = req.body;
      try {
        const saving = await SavingsCollection.insertOne({ email, source, amount: parseFloat(amount), date });
        res.status(201).send(saving);
      } catch (error) {
        res.status(400).json({ message: 'Error creating saving.' });
      }
    });
    
    app.get('/savings/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const savings = await SavingsCollection.find({ email }).toArray();
        res.status(200).send(savings);
      } catch (error) {
        res.status(400).json({ message: 'Error retrieving savings.' });
      }
    });
    
    app.delete('/savings/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const saving = await SavingsCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(saving);
      } catch (error) {
        res.status(400).json({ message: 'Error deleting saving.' });
      }
    });
    //...................

    app.delete('/category/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const category = await CategoryCollection.findOne({ _id: new ObjectId(id) });
        if (!category) {
          return res.status(404).json({ message: 'Category not found.' });
        }
        const categoryName = category.name;
        await CategoryCollection.deleteOne({ _id: new ObjectId(id) });
        const expenses = await ExpenseCollection.deleteMany({ category: categoryName });
        res.status(200).send({ category, expenses });
      } catch (error) {
        res.status(400).json({ message: 'Error deleting category and associated expenses.' });
      }
    });

    app.patch('/category/:id', async (req, res) => {
      const { id } = req.params;
      const { budget } = req.body;
      try {
        const updatedCategory = await CategoryCollection.updateOne({ _id: new ObjectId(id) }, { $set: { budget: parseFloat(budget) } });
        res.status(200).send(updatedCategory);
      } catch (error) {
        res.status(400).json({ message: 'Error updating category budget.' });
      }
    });

    app.post('/income', async (req, res) => {
      const { email, source, amount, date } = req.body;
      try {
        if (isNaN(amount)) {
          return res.status(400).json({ message: 'Invalid amount' });
        }
        const income = await IncomeCollection.insertOne({ email, source, amount: parseFloat(amount), date });
        res.status(201).send(income);
      } catch (error) {
        res.status(400).json({ message: 'Error creating income.' });
      }
    });

    app.delete('/income/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const income = await IncomeCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(income);
      } catch (error) {
        res.status(400).json({ message: 'Error deleting income.' });
      }
    });

    app.get('/income/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const incomes = await IncomeCollection.find({ email }).toArray();
        res.status(200).send(incomes);
      } catch (error) {
        res.status(400).json({ message: 'Error retrieving incomes.' });
      }
    });

    app.post('/category', async (req, res) => {
      const { email, name, budget } = req.body;
      try {
        const category = await CategoryCollection.insertOne({ email, name, budget: parseFloat(budget) });
        res.status(201).send(category);
      } catch (error) {
        res.status(400).json({ message: 'Error creating category.' });
      }
    });

    app.get('/categories/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const categories = await CategoryCollection.find({ email }).toArray();
        res.status(200).send(categories);
      } catch (error) {
        res.status(400).json({ message: 'Error retrieving categories.' });
      }
    });

    app.post('/expense', async (req, res) => {
      const { email, category, description, amount, date } = req.body;
      try {
        if (isNaN(amount)) {
          return res.status(400).json({ message: 'Invalid amount' });
        }
        const expense = await ExpenseCollection.insertOne({ email, category, description, amount: parseFloat(amount), date });
        res.status(201).send(expense);
      } catch (error) {
        res.status(400).json({ message: 'Error creating expense.' });
      }
    });

    app.get('/expenses/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const expenses = await ExpenseCollection.find({ email }).toArray();
        res.status(200).send(expenses);
      } catch (error) {
        res.status(400).json({ message: 'Error retrieving expenses.' });
      }
    });

    app.delete('/expense/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const expense = await ExpenseCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).send(expense);
      } catch (error) {
        res.status(400).json({ message: 'Error deleting expense.' });
      }
    });

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
      res.status(200).send({ user: { email: user.email, username: user.username }, message: "Login successful", token });
    });

  } finally {
    // Ensure client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello MoneyMate');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
