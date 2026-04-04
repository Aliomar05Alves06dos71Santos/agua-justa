async function calcular() {
  const consumo = Number(document.getElementById("consumo").value);

  if (!consumo) {
    document.getElementById("resultado").innerHTML =
      "Digite um consumo válido";
    return;
  }

  try {
    const response = await fetch("/calcular", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ consumo })
    });

    const data = await response.json();

    document.getElementById("resultado").innerHTML =
      "Valor: R$ " + data.valor_total;

  } catch (error) {
    document.getElementById("resultado").innerHTML =
      "Erro ao calcular";
    console.error(error);
  }
}