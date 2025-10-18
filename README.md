# Valor.IA — Prysm (MVP Deployável)

**Objetivo:** estudo de mercado rápido (entrada simples) + **estimativa** e **PDF** gerado na hora.  
Frontend estático servido pelo **Express**. Um serviço único para simplificar o deploy no **Render**.

## Como rodar (local)
```bash
cd backend
npm install
npm start
# abre http://localhost:8080
```

## Endpoints
- `GET /health`
- `POST /estimate`
- `POST /report`

## Deploy (Render)
- Tenha `render.yaml` na raiz do repositório.
- Crie o Web Service no Render indicando este repositório. O Render lerá o `render.yaml`.
