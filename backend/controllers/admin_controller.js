import User from '../models/user.js';
import Request from '../models/request.js';
import redis from '../cache/redisClient.js';

const TTL = 30; // cache expiry in seconds

// ===== USERS =====
export const getAllUsers = async (req, res) => {
  try {
    const cacheKey = 'admin:users';
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const users = await User.find().select('-password');
    await redis.set(cacheKey, JSON.stringify(users), { EX: TTL });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    // Invalidate caches
    await Promise.all([
      redis.del('admin:users'),
      redis.del('admin:requests'),
      redis.del('admin:stats'),
      redis.del('admin:analytics'),
    ]);

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deletion failed' });
  }
};

export const editUser = async (req, res) => {
  try {
    const fieldsToUpdate = { ...req.body };
    delete fieldsToUpdate.password; // prevent password updates

    const updated = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, { new: true });

    // Invalidate caches
    await Promise.all([
      redis.del('admin:users'),
      redis.del('admin:requests'),
      redis.del('admin:stats'),
      redis.del('admin:analytics'),
    ]);

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q = '' } = req.query;
    const cacheKey = `admin:search:${q}`;
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [{ username: regex }, { skillsHave: regex }, { skillsWant: regex }],
    }).select('-password');

    await redis.set(cacheKey, JSON.stringify(users), { EX: TTL });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
};

// ===== REQUESTS =====
export const getAllRequests = async (req, res) => {
  try {
    const cacheKey = 'admin:requests';
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const requests = await Request.find()
      .populate('from', 'username email')
      .populate('to', 'username email');

    await redis.set(cacheKey, JSON.stringify(requests), { EX: TTL });
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// ===== STATS =====
export const getStats = async (req, res) => {
  try {
    const cacheKey = 'admin:stats';
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const userCount = await User.countDocuments();
    const requests = await Request.find();

    const taughtMap = {};
    const demandedMap = {};

    for (const r of requests) {
      taughtMap[r.skillToTeach] = (taughtMap[r.skillToTeach] || 0) + 1;
      demandedMap[r.skillToLearn] = (demandedMap[r.skillToLearn] || 0) + 1;
    }

    const mostTaughtSkill =
      Object.entries(taughtMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const mostDemandedSkill =
      Object.entries(demandedMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const stats = { userCount, mostTaughtSkill, mostDemandedSkill };

    await redis.set(cacheKey, JSON.stringify(stats), { EX: TTL });
    res.status(200).json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stats generation failed' });
  }
};

// ===== ANALYTICS =====
export const getAnalytics = async (req, res) => {
  try {
    const cacheKey = 'admin:analytics';
    const cached = await redis.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const userCount = await User.countDocuments();
    const requests = await Request.find();

    const totalRequests = requests.length;
    const acceptedRequests = requests.filter(r => r.status === "accepted").length;
    const pendingRequests = requests.filter(r => r.status === "pending").length;
    const declinedRequests = requests.filter(r => r.status === "declined").length;

    const skillMap = {};
    for (const r of requests) {
      if (r.skillToTeach) skillMap[r.skillToTeach] = (skillMap[r.skillToTeach] || 0) + 1;
    }

    const skillsDistribution = Object.entries(skillMap).map(([skill, count]) => ({
      _id: skill,
      count,
    }));

    const analytics = {
      totalUsers: userCount,
      totalRequests,
      acceptedRequests,
      pendingRequests,
      declinedRequests,
      skillsDistribution,
    };

    await redis.set(cacheKey, JSON.stringify(analytics), { EX: TTL });
    res.status(200).json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
