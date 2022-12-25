module.exports = {
  root: function (req, res) {
    res.status(404);
    res.json({ message: 'MoniTalks Comment-session API Server' });
  },
  index: async function (req, res) {
    res.json({ payload: req.body });
  },
};
