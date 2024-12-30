const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0/349809654879706/messages';
const ACCESS_TOKEN = 'EAAGDpJTC3BABOZCPZBrPYGQJble0cHkZC9fKPbjoiPfUxbgURzUUbVg21vbewbS0TjSXO752RwKb56zfdeHN06vKqIRok6y44WXmt6Wnm0Ow1WOdi6pjqivZC6aTPVFuj2aszPbCxYoJrVeBDxThNTyJdebVIyZAixPqj9TX1V0r9jUZAxnHpeF9s2AoiLqaY8JR12OAoYZCXZC7a8ZCHwPSIKjhOTwZDZD';

app.post('/send-confirmation', async (req, res) => {
  const { phoneNumber, messageTemplate } = req.body;

  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: messageTemplate,
          language: { code: 'en_US' },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
