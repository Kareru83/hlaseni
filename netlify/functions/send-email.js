const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let title, date, priority, description, images;
  try {
    const body = JSON.parse(event.body);
    ({ title, date, priority, description, images } = body);
    console.log('📥 Příchozí data:', body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Nevalidní JSON vstup' })
    };
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true,
    auth: {
      user: 'm731633234@seznam.cz',
      pass: 'M.432336137'
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP připojení OK');
  } catch (error) {
    console.error('❌ SMTP ověření selhalo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SMTP ověření selhalo: ' + error.message })
    };
  }

  const mailOptions = {
    from: 'm731633234@seznam.cz',
    to: 'topaxi@seznam.cz',
    subject: title,
    text: `📅 Datum: ${date}\n⚠️ Priorita: ${priority}\n📝 Popis: ${description}`
  };

  console.log('📤 Odesílám e-mail na:', mailOptions.to);

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'E-mail úspěšně odeslán!' })
    };
  } catch (error) {
    console.error('❌ Chyba při odesílání:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
