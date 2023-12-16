exports.aboutUsController = (req, res) => {
  res.render("about-us", {
    title: "About Us | De Origen | Coffee Shop",
    pageHeader: "About Us - Handlebars Version",
  });
}