import Message from '../models/message.js';
import Request from '../models/request.js';

export const sendMessage = async (req, res) => {
  const { from, to, content, requestId } = req.body;

  try {
    // Fix: Use .toString() because Mongoose ObjectIds may not match with raw string ids
    const request = await Request.findOne({
      _id: requestId,
      status: 'accepted',
    });

    if (!request || (request.from.toString() !== from && request.to.toString() !== from)) {
      return res.status(403).json({ message: 'Unauthorized to chat. Request is not accepted' });
    }

    const message = await Message.create({ from, to, content, requestId });
    res.status(200).json(message);
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getChatThread = async (req, res) => {
  const { requestId } = req.params;

  try {
    const messages = await Message.find({ requestId })
      .sort({ timestamp: 1 })
      .populate('from', 'username avatar'); // ✅ required

    res.status(200).json(messages);
  } catch (error) {
    console.error('Fetch Chat Thread Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('from to', 'username avatar');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (err) {
    console.error('Get request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
