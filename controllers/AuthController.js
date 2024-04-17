import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// const{username, password, firstname, lastname} = req.body;

// const newUser = new UserModel({username,password, firstname, lastname})

// export const registerUser = async(req, res) => {


//   // const {username,password, firstname, lastname} = req.body;

//   const salt = await bcrypt.genSalt(10);
//   const hashedPass = await bcrypt.hash(req.body.password, salt)
//   req.body.password = hashedPass

//   // const newUser = new UserModel({
//   //   username,
//   //   password: hashedPass, 
//   //   firstname, 
//   //   lastname,
//   // });

//   try {
//     await newUser.save()
//     res.status(200).json(newUser)
    
//   } catch (error) {
//     res.status(500).json({message:error.message})
    
//   }

// }



// // login
// export const loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await UserModel.findOne({ username: username });

//     if(user)
//     {
//       const validity = await bcrypt.compare(password, user.password)

//       validity? res.status(200).json(user): res.status(400).json("wrong Password")
//     }
//     else{
//       res.status(404).json("user does not exist")
//     }
    
//   } catch (error) {
//     res.status(500).json({message:error.message});
//   }
// };

// Register new user
export const registerUser = async (req, res) => {

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass
  const newUser = new UserModel(req.body);
  const {username} = req.body
  try {
    // addition new
    const oldUser = await UserModel.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
