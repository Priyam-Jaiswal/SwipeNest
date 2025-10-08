const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

// Parse JSON body
app.use(express.json());

// Signup route
// app.post("/signup", async (req, res) => {
//   try {
//     const { firstName, lastName, emailId, password } = req.body;

//     if (!firstName || !lastName || !emailId || !password) {
//       return res.status(400).send("All fields are required!");
//     }

//     const user = new User({ firstName, lastName, emailId, password });
//     await user.save();

//     res.status(201).send("✅ User added successfully!");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("❌ Error saving user");
//   }
// });

app.post("/signup", async (req, res) =>{
    try{
        //Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10); 
        console.log(passwordHash);

        //Creating a new instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added successfully!");
    } catch (err){
        res.status(400).send("ERROR :" + err.message);
    }
});

app.post("/login", async (req, res)=>{
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId });
        if (!user) {
            throw new Error("EmailId is not present in DB");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.send("Login Successful!!!");
        } else {
            throw new Error("Invalid credentials");
        }
    }catch (err){
        res.status(400).send("ERROR :" + err.message);
    }
})

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
