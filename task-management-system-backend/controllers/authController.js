const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: getPermissionsByRole(role),
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and return a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(payload, 'secretKey', { expiresIn: '1h' }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to get permissions based on user role
const getPermissionsByRole = (role) => {
  switch (role) {
    case 'user':
      return ['createTask', 'readOwnTask', 'updateOwnTask', 'deleteOwnTask'];
    case 'teamLeader':
      return [
        'createTask',
        'readOwnTask',
        'updateOwnTask',
        'deleteOwnTask',
        'readTeamTasks',
        'updateTeamTasks',
      ];
    case 'admin':
      return ['createTask', 'readAllTasks', 'updateAllTasks', 'deleteAllTasks'];
    default:
      return [];
  }
};

module.exports = { registerUser, loginUser };
