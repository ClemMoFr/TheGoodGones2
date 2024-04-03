const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 4000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "appligg2023@gmail.com",
    pass: "sfxdjmfeyowfjopr",
  },
});

app.post("/send-notifications", async (req, res) => {
  const { emailAddresses, notificationData } = req.body;

  if (emailAddresses && emailAddresses.length > 0) {
    for (const emailAddress of emailAddresses) {
      const mailOptions = {
        to: emailAddress,
        subject: notificationData.notificationTitle,
        html: notificationData.notificationContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail envoyé à ${emailAddress}`);
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'e-mail à ${emailAddress}`,
          error
        );
      }
    }

    res.status(200).json({ message: "E-mails envoyés avec succès" });
  } else {
    res.status(400).json({ error: "Aucune adresse e-mail à envoyer" });
  }
});

app.post("/send-inscription", async (req, res) => {
  const {
    emailAddresses,
    eventTitle,
    eventDay,
    eventMonth,
    eventHoraire,
    eventLieu,
  } = req.body;

  if (emailAddresses && emailAddresses.length > 0) {
    for (const emailAddress of emailAddresses) {
      const mailOptions = {
        from: "pitagore007@gmail.com",
        to: emailAddress,
        subject: "Inscription pour une nouvelle activité",
        html: `
        <p>Bonjour ! Nous sommes ravis de te retrouver pour notre nouvelle activité : <strong>${eventTitle}</strong>, l'événement aura lieu le <strong>${eventDay} ${eventMonth} de ${eventHoraire.start}h à ${eventHoraire.end}h</strong>.</p>
        <p>Lieu : <strong>${eventLieu}</strong></p>
        <p>Pourrais-tu nous confirmer ta présence ?</p>
      `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail envoyé à ${emailAddress}`);
      } catch (error) {
        console.error(
          `Erreur lors de l'envoi de l'e-mail à ${emailAddress}`,
          error
        );
      }
    }

    res.status(200).json({ message: "E-mails envoyés avec succès" });
  } else {
    res.status(400).json({ error: "Aucune adresse e-mail à envoyer" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 👍`);
});
