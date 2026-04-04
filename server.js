const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// servir front-end
app.use(express.static(path.join(__dirname, 'public')));

// rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API cálculo
app.post('/calcular', (req, res) => {
  const { consumo } = req.body;

  // ✅ validação (corrigido)
  if (!consumo || isNaN(consumo)) {
    return res.status(400).json({
      erro: "Consumo inválido"
    });
  }

  let valor = 0;

  if (consumo <= 10) valor = 20;
  else if (consumo <= 20) valor = 40;
  else valor = consumo * 3;

  res.json({
    consumo,
    valor_total: valor,
  });
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});//
