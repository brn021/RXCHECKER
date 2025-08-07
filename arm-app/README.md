# ARM - Apoio à Receita Médica

## Descrição

ARM (Apoio à Receita Médica) é uma aplicação desktop de apoio à decisão clínica desenvolvida especificamente para farmacêuticos e médicos portugueses. A aplicação transforma informação dos Resumos das Características do Medicamento (RCM) e BNF numa interface interativa com dupla camada de informação.

### Características Principais

- **Gadget System**: Interface contraída/expandida inspirada na Dosium
- **Base de Dados Local**: 9 medicamentos com informação completa do RCM
- **Alertas Contextuais**: Warnings baseados no perfil do doente
- **Calculadoras Integradas**: Clearance de creatinina (Cockcroft-Gault) e outros
- **Dupla Camada de Informação**: Resumo clínico + link direto para RCM oficial
- **Pesquisa Avançada**: Por nome, classe terapêutica, ou código ATC

### Stack Tecnológico

- **Desktop**: Electron (Windows target)
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Dados**: JSON local + SQLite (futuro)
- **Build**: electron-builder para distribuição

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd arm-app
```

2. Instale as dependências:
```bash
npm install
```

### Executar em Desenvolvimento

```bash
npm start
```

Este comando irá:
1. Iniciar o servidor de desenvolvimento React
2. Lançar a aplicação Electron automaticamente

### Build para Produção

Para criar um build de produção:

```bash
npm run dist
```

Para criar builds para múltiplas plataformas:

```bash
npm run dist-all
```

## Estrutura do Projeto

```
arm-app/
├── src/
│   ├── main.js                    # Electron main process
│   ├── preload.js                 # Security bridge
│   ├── renderer/                  # React frontend
│   │   ├── components/
│   │   │   ├── Gadget.tsx         # Estado contraído
│   │   │   ├── MainWindow.tsx     # Lista medicamentos
│   │   │   ├── MedicationDetail.tsx # Detalhe medicamento
│   │   │   ├── PatientCard.tsx    # Info doente
│   │   │   ├── SearchBar.tsx      # Pesquisa
│   │   │   └── SourceBadge.tsx    # Tags BNF/RCM
│   │   ├── utils/
│   │   └── types.ts
│   ├── data/
│   │   └── medications/           # JSON dos medicamentos
│   └── assets/                    # Ícones, imagens
├── package.json
├── electron-builder.config.js
└── tailwind.config.js
```

## Medicamentos Incluídos

1. **Apixabano** - Anticoagulante oral (dados completos)
2. **Metformina** - Antidiabético oral
3. **Digoxina** - Cardiotónico
4. Ciprofloxacina (em desenvolvimento)
5. Claritromicina (em desenvolvimento)
6. Lorazepam (em desenvolvimento)
7. Oxicodona (em desenvolvimento)
8. Prednisolona (em desenvolvimento)
9. Rosuvastatina (em desenvolvimento)

## Funcionalidades

### Gadget Mode
- Ícone flutuante no desktop (64x64px)
- Always on top
- Hover effects
- Click para expandir

### Main Window
- Lista de medicamentos pesquisável
- Cartão do doente com dados demográficos
- Alertas contextuais por doente
- Links diretos para RCM oficial

### Detalhe do Medicamento
- Informação completa estruturada
- Tabs organizados por secção
- Calculadoras integradas
- Alertas específicos para o perfil do doente

### Mock Integrations
- Simulação PEM (Prescrição Eletrónica Médica)
- Dados mock do doente
- Calculadoras clínicas

## Desenvolvimento

### Scripts Disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Build React para produção
- `npm run dist` - Cria executável para a plataforma atual
- `npm run electron` - Executa apenas o Electron
- `npm test` - Executa testes

### Estrutura de Dados

Os medicamentos seguem a estrutura:

```typescript
interface Medication {
  id: string;
  name: string;
  sections: {
    indications: MedicationSection;
    contraindications: MedicationSection;
    cautions: MedicationSection;
    interactions: MedicationSection;
    side_effects: MedicationSection;
  };
  calculators: Calculator[];
  alerts: Alert[];
  clinical_pearls: string[];
}
```

## Roadmap

### Próximas Funcionalidades
- [ ] Integração real com PEM
- [ ] Base de dados SQLite
- [ ] Mais calculadoras clínicas
- [ ] Export de relatórios
- [ ] Sincronização com Sifarma
- [ ] Modo offline completo

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Auto-updater
- [ ] Crash reporting
- [ ] Analytics de utilização

## Segurança e Privacidade

- Todos os dados são processados localmente
- Sem transmissão de dados do doente
- Links externos abrem no browser padrão
- Context isolation ativo no Electron

## Contribuição

Para contribuir para este projeto:

1. Faça fork do repositório
2. Crie uma branch para a feature (`git checkout -b feature/nova-feature`)
3. Commit as alterações (`git commit -am 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT. Ver ficheiro `LICENSE` para mais detalhes.

## Suporte

Para questões técnicas ou sugestões:
- Email: suporte@healthtech.pt
- Issues: GitHub Issues

## Créditos

Desenvolvido por HealthTech Portugal para a comunidade médica e farmacêutica portuguesa.

Dados dos medicamentos baseados nos RCM oficiais do INFARMED.