import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.MP_TOKEN;

// TESTE
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API Água Justa online" });
});

// CRIAR PIX
app.post("/criar-pix", async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: Number(valor),
        description: "Água Justa",
        payment_method_id: "pix",
        payer: { email: "cliente@aguajusta.com" }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const pix = response.data;

    res.json({
      id: pix.id,
      status: pix.status,
      qr_code: pix.point_of_interaction?.transaction_data?.qr_code
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
});

// STATUS
app.get("/status/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${req.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    res.json({
      status: response.data.status,
      liberado: response.data.status === "approved"
    });

  } catch {
    res.status(500).json({ error: "Erro ao verificar pagamento" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Rodando na porta ${PORT}`);
});
