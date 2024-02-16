import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { to, subject, text } = req.body;

    try {
      if (to) {
        await sgMail.send({
          to,
          from: "abhikhati2212@gmail.com",
          subject,
          text,
        });

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: "'to' is required in the request body" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
