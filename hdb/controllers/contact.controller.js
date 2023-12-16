exports.contactController = (req, res) => {
  res.render("contact", {
    title: "Contact | De Origen | Coffee Shop",
    pageHeader: "Contact Us - Handlebars Version",
  });
}