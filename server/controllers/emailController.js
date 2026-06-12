const sendEmail = (req, res) => {
  const { email, link } = req.body;

  console.log("Email To:", email);
  console.log("Signature Link:", link);

  res.json({
    message: "Email sent successfully",
    email,
    link,
  });
};

module.exports = {
  sendEmail,
};