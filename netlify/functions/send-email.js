const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Použijte POST metodu.' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Neplatný JSON.' }),
    };
  }

  const { title, date, priority, description, images } = data;

  const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
      user: 'm731633234@seznam.cz',
      pass: 'M.432336137'
    }
  });

  const mailOptions = {
    from: '"Hlášení" <m731633234@seznam.cz>',
    to: 'topaxi@seznam.cz',
    subject: `🛠️ Hlášení: ${title}`,
    text: `Datum: ${date}\nPriorita: ${priority}\n\nPopis:\n${description}`,
    attachments: images.map(img => ({
      filename: img.filename,
      content: img.content,
      encoding: img.encoding,
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail byl úspěšně odeslán.' }),
    };
} catch (err) {
  console.error('❌ Chyba při odesílání:', err);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Nepodařilo se odeslat e-mail.', detail: err.message }),
  };
}

};
