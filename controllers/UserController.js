import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Get a User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {

    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } 
    else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};






// Delete a user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
};


// Follow a User
// changed
export const followUser = async (req, res) => {
  const id = req.params.id;
  const {currentUserId} = req.body

  if (currentUserId === id) 
  {
    res.status(403).json("Action forbidden")
  }
  else{
    try {
      const followUser= await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if(!followUser.followers.includes(currentUserId))
      {
        await followUser.updateOne({$push : {followers: currentUserId}});
        await followingUser.updateOne({$push: {following: id}});
        res.status(200).json("user followed!");
      }

      else{
        res.status(403).json("User is Already followed by you");
      }

      
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a User
// changed
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;
  const {currentUserId} = req.body

  if (currentUserId === id) 
  {
    res.status(403).json("Action forbidden")
  }
  else{
    try {
      const followUser= await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if(followUser.followers.includes(currentUserId))
      {
        await followUser.updateOne({$pull : {followers: currentUserId}});
        await followingUser.updateOne({$pull : {following: id}});
        res.status(200).json("user Unfollowed!");
      }

      else{
        res.status(403).json("User is Already Unfollowed by you");
      }

      
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

  


// udpate a user

// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   // console.log("Data Received", req.body)
//   const { _id, currentUserAdmin, password } = req.body;
  
//   if (id === _id) {
//     try {
//       // if we also have to update password then password will be bcrypted again
//       if (password) {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(password, salt);
//       }
//       // have to change this
//       const user = await UserModel.findByIdAndUpdate(id, req.body, {
//         new: true,
//       });
//       const token = jwt.sign(
//         { username: user.username, id: user._id },
//         process.env.JWT_KEY,
//         { expiresIn: "1h" }
//       );
//       console.log({user, token})
//       res.status(200).json({user, token});
//     } catch (error) {
//       console.log("Error agya hy")
//       res.status(500).json(error);
//     }
//   } else {
//     res
//       .status(403)
//       .json("Access Denied! You can update only your own Account.");
//   }
// };


// udpate a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  
  if (id === currentUserId || currentUserAdminStatus) {
    try {

     
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      console.log("Error agya hy")
      res.status(500).json(error);
    }
  
  }
};