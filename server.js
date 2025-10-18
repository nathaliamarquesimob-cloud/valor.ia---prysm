const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.json({ ok: true, name: 'Valor.IA', produto: 'Valor.IA', modulo: 'Prysm', version: '1.0.0', time: new Date().toISOString() });
});

app.post('/estimate', (req, res) => {
  const { bairro="", tipologia="", area=0, atributos={} } = req.body || {};
  const m2Base = 8500;
  let fator = 1.0;
  if (String(bairro).toLowerCase().includes('asa norte')) fator += 0.08;
  if (String(bairro).toLowerCase().includes('asa sul')) fator += 0.06;
  if (String(bairro).toLowerCase().includes('sudoeste')) fator += 0.12;
  if (String(tipologia).toLowerCase().includes('kit')) fator -= 0.05;
  if (String(tipologia).toLowerCase().includes('cobertura')) fator += 0.25;
  if (atributos.andar && Number(atributos.andar) >= 6) fator += 0.03;
  if (atributos.posicao && /nasc|poente|sul|norte/i.test(atributos.posicao)) fator += 0.01;
  if (atributos.lazer === true) fator += 0.02;
  const precoM2 = Math.round(m2Base * fator);
  const valor = Math.round(precoM2 * Number(area || 0));
  res.json({ ok: true, params: { bairro, tipologia, area, atributos }, precoM2, valor, metodologia: "Heurística (MVP). Ligar ITBI/portais em produção." });
});

app.post('/report', (req, res) => {
  const { entrada={}, estimativa={} } = req.body || {};
  const brand = process.env.REPORT_BRAND_NAME || "Valor.IA";
  const slogan = process.env.REPORT_BRAND_SLOGAN || "Onde o valor ganha inteligência. E a inteligência, propósito.";
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="valor-ia-prysm-relatorio.pdf"');
  doc.fontSize(22).fillColor('#0e2138').text(`${brand} — Prysm`);
  doc.moveDown(0.3);
  doc.fontSize(12).fillColor('#2c2c2c').text(slogan);
  doc.moveDown(1);
  doc.fontSize(14).fillColor('#0e2138').text('Dados de Entrada');
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#000').text(JSON.stringify(entrada, null, 2));
  doc.moveDown(1);
  doc.fontSize(14).fillColor('#0e2138').text('Estimativa');
  doc.moveDown(0.5);
  doc.fontSize(11).fillColor('#000').text(JSON.stringify(estimativa, null, 2));
  doc.moveDown(1);
  doc.moveDown(2);
  doc.fontSize(10).fillColor('#666').text('Relatório gerado automaticamente — MVP (dados sintéticos).', { align: 'center' });
  doc.end();
  doc.pipe(res);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => { console.log(`Valor.IA backend on ${PORT}`); });
