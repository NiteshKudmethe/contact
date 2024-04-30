const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/taxlitigo_contactform';

// Define a schema for the form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email:String,
  phone:String,
  message:String
  
});

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);



// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define a route to handle form submissions
app.post('/submit-form', async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, email , phone , message } = req.body;
    

    // Create a new document based on the FormData model
    const formData = new FormData({
      name,
      email,
      phone,
      message

    });

    // Save the form data document to the database
    await formData.save();

    console.log('Form data stored in MongoDB successfully');
    res.send('Form data received and stored in MongoDB successfully');
  } catch (error) {
    console.error('Error storing form data in MongoDB:', error);
    res.status(500).send('Error storing form data in MongoDB');
  }
});

// Define a route to fetch form data
app.get('/get-form-data', async (req, res) => {
  try {
    const formData = await FormData.find(); // Fetch all form data from MongoDB
    res.json(formData); // Send the data as JSON response
  } catch (error) {
    console.error('Error fetching form data from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = 3000;
const server = app.listen(port, '0.0.0.0', () => {
  const address = server.address();
  console.log(`Server listening at http://${address.address}:${address.port}`);
});
