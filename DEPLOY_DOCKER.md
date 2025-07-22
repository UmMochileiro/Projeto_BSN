# Deploy do Pokédex usando Imagem Docker

## Informações do Deploy

- **Imagem**: `ummochileiro/pokedex-app:latest`
- **Porta**: 80
- **URL Final**: https://devcardoso.com/pokedex/

## Deploy no Easypanel

1. **Via Docker Image**:
   - Imagem: `ummochileiro/pokedex-app:latest`
   - Porta do container: 80
   - Manter proxy reverso configurado: `https://devcardoso.com/pokedex` → `http://container:80/`

2. **Via Docker Compose**:
   - Use o arquivo `docker-compose.prod.yml` fornecido
   - A aplicação já está configurada com subpath `/pokedex/`

## Comando local para testar

```bash
docker run -d -p 8080:80 ummochileiro/pokedex-app:latest
```

Acesse: http://localhost:8080/

## Verificação

A aplicação deve carregar corretamente com todos os recursos (CSS, JS) funcionando através do proxy reverso configurado.
