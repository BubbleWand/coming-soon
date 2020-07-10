sendSubscribedEmail = (req, res, savedEmail) => {
  const { _id, email } = savedEmail;
  sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Subscribed to Bubble!",
    html: `
      <p>You will now receive app release updates for Bubble!</p>
      <small>Unsubscribe at any time by clicking <a target="_blank" href="http://${req.headers.host}/unsubscribe/${_id}">here</a>.</p>
      <p>Or copy/paste this URL into your browser to unsubscribe: <a target="_blank" href="http://${req.headers.host}/unsubscribe/${_id}">http://${req.headers.host}/unsubscribe/${_id}</a></p>
    `
  }).catch((err) => {
    if (err.message === "self signed certificate in certificate chain") {
      return console.log("WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.");
    }
    console.log("ERROR: Could not send verifyEmail email after security downgrade.\n", err);
    req.flash("errors", { msg: "Error sending the email. Please try again shortly." });
    return err;
  });
  req.flash('success', { msg: "Thanks for signing up! You'll now recieve release updates." })
  res.redirect('/');
};