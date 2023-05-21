const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://AlphaDBAdmin2:Zoo05rF9PMR3UeGG@alphadbv1.9q93m.mongodb.net/SkyWise?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.log(err);
    return;
  }

  const collection = client.db('mytestdb').collection('users');

  const username = document.querySelector('.reg-username-input').value.trim();
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();
  const cnfpassword = document.querySelector('#cnfpassword').value.trim();

  // Input validation
  if (!username || !email || !password || !cnfpassword) {
    console.log('All fields are required');
    return;
  }

  if (password !== cnfpassword) {
    console.log('Password and confirm password do not match');
    return;
  }

  const user = { username, email, password };

  collection.insertOne(user, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('User stored to MongoDB Atlas database');
    client.close();
  });

});
