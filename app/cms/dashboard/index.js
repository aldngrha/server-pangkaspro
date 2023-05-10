module.exports = {
  dashboard: async (req, res) => {
    try {
      const session = req.session.user;
      res.render("pages/dashboard", {
        name: session.name,
        role: session.role,
        title: "Pangkaspro | Dashboard",
      });
    } catch (error) {
      res.redirect("/dashboard");
    }
  },
};
