module.exports = {
  index: async (req, res) => {
    res.json({ payload: req.body });
  },
};
