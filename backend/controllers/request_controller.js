import Request from '../models/request.js';

// Send a new request
export const sendRequest = async (req, res) => {
  try {
    const { from, to, skillToTeach, skillToLearn } = req.body;

    if (!from || !to || !skillToTeach || !skillToLearn) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Avoid sending duplicate pending request
    const existing = await Request.findOne({ from, to, skillToTeach, skillToLearn, status: 'pending' });
    if (existing) {
      return res.status(409).json({ message: 'Request already sent and pending' });
    }

    const newRequest = new Request({ from, to, skillToTeach, skillToLearn });
    await newRequest.save();

    res.status(200).json({ message: 'Request sent successfully', request: newRequest });
  } catch (err) {
    console.error('Send Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get requests received by current user
export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: req.params.userId })
      .populate('from', 'username avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get requests sent by current user
export const getSentRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await Request.find({ from: userId }).populate('to', 'username email avatar');
    res.status(200).json(requests);
  } catch (err) {
    console.error('Fetch Sent Requests Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept or decline request
// Accept or decline request
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // 🔁 Include 'pending' in valid statuses
    if (!['accepted', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findByIdAndUpdate(requestId, { status }, { new: true });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request updated', request });
  } catch (err) {
    console.error('Update Request Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

