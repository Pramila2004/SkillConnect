import User from '../models/user.js';


export const completeUserProfile = async (req, res) => {
  try {
    const { userId } = req.body; // ID of existing user

    const {
      username,
      bio,
      linkedin,
      github,
      instagram,
      otherLinks,
      skillsHave,
      skillsWant,
    } = req.body;

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) return res.status(404).json({ message: 'User not found' });

    // Update only the profile fields (not email/username/password)
    existingUser.username = username || existingUser.username;
    existingUser.bio = bio || existingUser.bio;
    existingUser.linkedin = linkedin || existingUser.linkedin;
    existingUser.github = github || existingUser.github;
    existingUser.instagram = instagram || existingUser.instagram;
    existingUser.otherLinks = otherLinks || existingUser.otherLinks;
    existingUser.skillsHave = skillsHave || existingUser.skillsHave;
    existingUser.skillsWant = skillsWant || existingUser.skillsWant;

    await existingUser.save();

    res.status(200).json({ message: 'Profile updated successfully', user: existingUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get profile by user ID or email
export const getUserProfile = async (req, res) => {
  try {
    const { identifier } = req.params;

    const user = await User.findById(identifier);
    

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password, ...userData } = user.toObject(); // exclude password
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Prevent password update from here
    if (updateData.password) delete updateData.password;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};


export const getUsersWhoCanTeach = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current user's wanted skills
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const { skillsWant } = currentUser;

    // Find users who have at least one matching skill
    const matchedUsers = await User.find({
      _id: { $ne: userId }, // exclude self
      skillsHave: { $in: skillsWant },
    }).select('-password'); // exclude sensitive info

    res.status(200).json(matchedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getExploreMentors = async (req, res) => {
  try {
    const { userId } = req.params;
    const { q = '' } = req.query;

    const currentUser = await User.findById(userId).select('skillsHave skillsWant');
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const { skillsHave, skillsWant } = currentUser;

    const searchRegex = new RegExp(q, 'i');

    const mentors = await User.find({
      _id: { $ne: userId },
      // Match mentors who can teach me (I want)
      skillsHave: { $in: skillsWant },
      // And want to learn what I can teach
      skillsWant: { $in: skillsHave },
      // Optional search filter
      $or: [
        { username: { $regex: searchRegex } },
        { skillsHave: { $regex: searchRegex } },
        { skillsWant: { $regex: searchRegex } }
      ]
    }).select('-password');

    res.status(200).json(mentors);
  } catch (err) {
    console.error('Explore Mentors Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





// GET /api/user/getMentor/:id
export const getUser = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select('-password');
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.status(200).json(mentor);
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


