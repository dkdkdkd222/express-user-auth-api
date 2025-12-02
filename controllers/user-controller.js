const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Registering a user
const registerUser = async (req,res) => {
try {
  const {username, password, email, firstName, lastName} = req.body;

if (!username || !password || !email) {
  return res.status(400).json({
    success: false,
    message: 'There was an error. Please input a username, password, and email'
  })
}
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = await User.create({
  username, 
  password: hashedPassword,
  email,
  firstName,
  lastName,
})

return res.status(201).json({
  success: true,
  message: 'User has been created successfully!',
  user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email
  }
})
} catch(e) {
  if (e.code === 11000) {
  return res.status(409).json({
    success: false,
    message: 'Account with this username and password already exists'
  });
}
console.error(e);
return res.status(500).json({
  success: false,
  message: 'Internal server error during registration'
})
}
}

// Retrieving a single user 
const retrieveUser = async(req,res) => {
  const userId = req.user.id
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
     return res.status(404).json(
        {
          success: false,
          message: 'User profile not found!'
        }
      )
    }
     if (user){
    return res.status(200).json({
        success: true,
        data: user
      })
    }
  } 
    catch(e) {
      console.error(e)
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      })    
    }
}
// Logging a user
const loginUser = async(req,res) => {
  const {email, password} = req.body;

  if (!email || !password) {
   return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    })
  }
    try {
      const findUser = await User.findOne({email}).select('+password');

      if (!findUser) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }
      const payload = {
        id: findUser._id,
        role: findUser.role
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
      );
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        userId: findUser._id
      })
    } catch(e) {
      console.error(e)
      return res.status(500).json({
        success: false,
        message: "Internal server error during login"
      })
    }
  }
// Updating a user profile
  const updateUserProfile = async(req,res) => {
    const userId = req.user.id
    const updateData = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData,{ new: true, runValidators: true}).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      })
    } catch(e) {
      if (e.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Username and password are already in use.'
        })
      }
      console.log(e)
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      })
    }
  }
// Getting all of the users
  const getAllUsers = async(req, res) => {
    try{
      const getUsers = await User.find({}).select('-password');
      if (getUsers.length === 0) {
        return res.status.json({
          success: false,
          message: 'No users found.'
        })
      }
      return res.status(200).json({
        success: true,
        message: 'Retrieved all users!',
        data: getUsers
      })
    } catch(e) {
      console.log(e);
      return res.status(500).json({
success: false,
message: 'Internal Server Error'
      })
    }
  }

// Changing the user password
const changePassword = async(req,res) => {
  const {oldPassword, newPassword} = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return res.status(404).json({
      success: false,
      message: 'Please provide old and new password.'
    })
  }
  try {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const isMatch = bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: 'Invalid old password'
      })
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the old password. Please try again'
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(userId, {password: hashedNewPassword}, {new: true, runValidators: true}).select('-password');
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    })
  } catch(e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during password change'
    })
  }
}


// Deleting a user
const deleteUser = async(req,res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found or already deleted.'
      })
    }
      return res.status(204).send();
  } catch(e) {
    console.log(e)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

module.exports = {registerUser, retrieveUser, loginUser, updateUserProfile, getAllUsers, changePassword, deleteUser}