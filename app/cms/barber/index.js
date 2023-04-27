module.exports = {
  index: async (req, res) => {
    try {
      res.render("pages/barber", {
        title: "Pangkaspro | My Barber",
      });
    } catch (error) {
      res.redirect("/dashboard");
    }
  },
};
