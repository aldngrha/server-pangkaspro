module.exports = {
  dashboard: async (req, res) => {
    try {
      res.render("pages/dashboard", {
        title: "Pangkaspro | Dashboard",
      });
    } catch (error) {
      res.redirect("/dashboard");
    }
  },
};
