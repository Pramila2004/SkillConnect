import User from '../models/user.js';
import Request from '../models/request.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};

export const editUser = async (req, res) => {
  try {
    const fieldsToUpdate = { ...req.body };
    delete fieldsToUpdate.password; // Don't allow updating password here
    const updated = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Update failed' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q = '' } = req.query;
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { username: regex },
        { skillsHave: regex },
        { skillsWant: regex },
      ],
    }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('from', 'username email')
      .populate('to', 'username email');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

export const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const requests = await Request.find();

    const taughtMap = {};
    const demandedMap = {};

    for (const r of requests) {
      taughtMap[r.skillToTeach] = (taughtMap[r.skillToTeach] || 0) + 1;
      demandedMap[r.skillToLearn] = (demandedMap[r.skillToLearn] || 0) + 1;
    }

    const mostTaughtSkill = Object.entries(taughtMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const mostDemandedSkill = Object.entries(demandedMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    res.status(200).json({ userCount, mostTaughtSkill, mostDemandedSkill });
  } catch (err) {
    res.status(500).json({ message: 'Stats generation failed' });
  }
};