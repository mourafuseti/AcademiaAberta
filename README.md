# AcademiaAberta

Aplicativo de acompanhamento de treinos para planejar rotinas, registrar exercícios e acompanhar o progresso. O AcademiaAberta é uma adaptação comunitária do [openGym](https://github.com/DuarteSantos8/openGym), com foco em uma experiência em português do Brasil.

## Funcionalidades

- Criar rotinas e registrar sessões de treino.
- Consultar catálogo de exercícios, instruções e equipamentos.
- Acompanhar histórico, estatísticas e peso corporal.
- Usar o app como visitante ou sincronizar perfis por meio de um servidor próprio.
- Usar a interface em português do Brasil e em outros idiomas disponíveis.
- Instalar como aplicativo web (PWA); também há projetos móveis Android e iOS.

## Requisitos

- Node.js 22.12 ou superior e npm para desenvolvimento local.
- Docker Desktop e Docker Compose para executar a instalação conteinerizada.

## Desenvolvimento local

Na raiz do repositório, abra dois terminais.

No primeiro, inicie a API:

```powershell
cd api
npm install
$env:DATA_DIR = "$PWD\..\data"
npm start
```

No segundo, inicie a interface:

```powershell
cd frontend
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`. A API local usa a porta `3000`. Mantenha os dois processos em execução enquanto usa o app.

Passkeys exigem HTTPS fora de `localhost`. Ao acessar pelo celular usando o IP da rede local, a interface pode abrir em HTTP, mas o cadastro por passkey pode não funcionar sem configurar HTTPS.

## Executar com Docker

Na primeira execução, crie o arquivo `.env` a partir do exemplo e inicie os serviços:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up --build -d
```

Acesse `http://localhost:8080`. Para parar os serviços, execute `docker compose down`. Os dados persistentes ficam em `data/`; mantenha uma cópia de segurança dessa pasta.

Para disponibilizar o app pela internet, configure um domínio com HTTPS e ajuste `RP_ID` e `ORIGIN` no `.env`. Consulte o [guia de hospedagem](docs/SELF_HOSTING.md).

## Testes e build

Testes da interface:

```powershell
cd frontend
npm test
npm run build
```

Testes da API:

```powershell
cd api
npm test
```

## Licenças e créditos

O código do projeto é distribuído sob a [GNU AGPL v3](LICENSE). As imagens e animações de exercícios possuem uma licença separada e restrições de uso; consulte o [aviso de terceiros](https://github.com/mourafuseti/AcademiaAberta/blob/main/NOTICE.md) antes de reutilizar qualquer mídia. O crédito à Gym visual deve permanecer junto ao app.

## Sobre o autor

Leonardo de Moura Fuseti é estudante de Defesa Cibernética no Polo Estácio de Piumhi, Minas Gerais, com formação técnica em Redes de Computadores pelo IFMG Campus Bambuí. Tem interesse em programação, especialmente Python, e em desenvolvimento web.

### Contato

- [Perfil na DIO](https://www.dio.me/users/mourafuseti)
- [LinkedIn](https://www.linkedin.com/in/leonardo-moura-fuseti-4052b0359/)
- [GitHub](https://github.com/mourafuseti)
- [E-mail](mailto:mourafuseti@gmail.com)

### Tecnologias em estudo

HTML, CSS, JavaScript, Sass, Bootstrap, Python, Git e GitHub.

Projeto pessoal em desenvolvimento e aberto à colaboração.

