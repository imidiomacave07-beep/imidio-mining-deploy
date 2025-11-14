name: Node.js CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-run:
    runs-on: ubuntu-latest

    steps:
      # 1. Pega o código do repositório
      - name: Checkout repository
        uses: actions/checkout@v3

      # 2. Configura o Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # 3. Instala as dependências
      - name: Install dependencies
        run: npm install

      # 4. Compila o projeto (se houver build)
      - name: Build project
        run: npm run build --if-present

      # 5. Roda o servidor
      - name: Run server
        env:
          PORT: 3000 # você pode alterar a porta aqui
        run: node server.js
