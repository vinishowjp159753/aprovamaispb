// server.js
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PAGSEGURO_TOKEN = 'f3f24edd-dabd-4975-994b-77f6b75f3ab6a55011fb48d1968bf0ad13c7a36660cd64ad-d06e-4ffa-8b30-87a340f7d72c';
const PAGSEGURO_EMAIL = 'seu-email@exemplo.com'; // Troque pelo seu e-mail do PagSeguro

// Endpoint para criar checkout
app.post('/create-checkout', async (req, res) => {
    const { matriculaId, valor, nome, email } = req.body;

    const params = new URLSearchParams({
        email: PAGSEGURO_EMAIL,
        token: PAGSEGURO_TOKEN,
        currency: 'BRL',
        itemId1: matriculaId,
        itemDescription1: 'Matrícula AprovaMaisPB',
        itemAmount1: valor,
        itemQuantity1: '1',
        senderName: nome,
        senderEmail: email,
        reference: matriculaId
    });

    try {
        const response = await fetch('https://ws.pagseguro.uol.com.br/v2/checkout', {
            method: 'POST',
            body: params
        });
        const text = await response.text();
        res.send(text); // Retorna XML com checkoutCode
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao criar checkout');
    }
});

// Webhook para atualizar valorPago
app.post('/pagseguro-webhook', async (req, res) => {
    const notificationCode = req.body.notificationCode;
    const notificationType = req.body.notificationType;

    // Aqui você chamaria PagSeguro API para validar o pagamento
    // e atualizar Firestore com valorPago = 150 se aprovado
    res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
