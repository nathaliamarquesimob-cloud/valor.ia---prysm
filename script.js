const $ = (s)=>document.querySelector(s);
let lastPayload = null;
$('#btnCalcular').onclick = async () => {
  const body = {
    bairro: $('#bairro').value,
    tipologia: $('#tipologia').value,
    area: Number($('#area').value),
    atributos: {
      andar: Number($('#andar').value),
      posicao: $('#posicao').value,
      lazer: $('#lazer').value === 'true'
    }
  };
  const r = await fetch('/estimate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await r.json();
  $('#saida').textContent = JSON.stringify(data, null, 2);
  lastPayload = { entrada: body, estimativa: data };
  $('#btnPDF').disabled = !data.ok;
};
$('#btnPDF').onclick = async () => {
  if(!lastPayload) return;
  const r = await fetch('/report', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lastPayload) });
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'valor-ia-prysm-relatorio.pdf';
  a.click();
  URL.revokeObjectURL(url);
};
