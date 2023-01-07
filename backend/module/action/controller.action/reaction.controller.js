module.exports = {
  handleReaction(req, res) {
    console.log(req.body.payload, 'payload');
    res.json({ message: 'Success' });
  },

  totalComments() {},
};
