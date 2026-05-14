---
name: Technical Support System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-table:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style
Este design system é fundamentado em uma estética **Minimalista e Corporativa**, focada em eficiência operacional e clareza de dados para ambientes de suporte técnico de alto desempenho. A personalidade da marca é autoritária, precisa e confiável, priorizando a legibilidade de métricas críticas sobre ornamentos visuais. 

O estilo visual utiliza uma abordagem de camadas tonais com superfícies limpas, tipografia estruturada e uma hierarquia baseada em cores funcionais. O objetivo é reduzir a carga cognitiva do operador, permitindo uma triagem rápida de tickets e monitoramento em tempo real através de um layout organizado e profissional.

## Colors
A paleta é centrada no contraste entre o azul marinho profundo (#0F172A), utilizado para elementos estruturais e navegação, e o fundo cinza claro (#F8FAFC), que proporciona uma base de baixa fadiga visual.

As cores de status seguem uma lógica semântica rigorosa:
- **Crítico (Vermelho):** Intervenção imediata.
- **Alta (Laranja):** Urgência elevada.
- **Média (Amarelo):** Prioridade padrão.
- **Baixa (Azul):** Solicitações rotineiras.

Cinzas auxiliares (Slate Grays) são empregados para textos secundários e bordas sutis, garantindo que as cores de status permaneçam como os únicos pontos de alta atenção na interface.

## Typography
Utilizamos a família **Inter** por sua legibilidade excepcional em telas e características utilitárias. A hierarquia é estrita: títulos utilizam pesos semibold (600) ou bold (700) para ancorar as seções, enquanto o corpo de texto mantém um peso regular (400) para leitura prolongada. 

Para labels de status e cabeçalhos de tabelas, utilizamos o estilo `label-caps` para diferenciar metadados do conteúdo dinâmico. O espaçamento entre letras é ligeiramente reduzido em tamanhos grandes para manter a densidade visual e levemente expandido em labels pequenos para garantir clareza.

## Layout & Spacing
O layout adota um sistema de **Grid Fluido** de 12 colunas para o conteúdo principal, com uma barra lateral de navegação fixa de 260px. 

- **Desktop:** Margens externas de 32px e gutters de 24px.
- **Tablet:** Transição para 8 colunas, margens de 24px.
- **Mobile:** Layout de coluna única com margens de 16px.

O ritmo vertical é baseado em múltiplos de 8px (sistema de 8pt), garantindo alinhamento matemático entre cards, tabelas e elementos de formulário. O whitespace é utilizado estrategicamente para agrupar informações relacionadas sem a necessidade de linhas divisórias excessivas.

## Elevation & Depth
A profundidade neste design system é comunicada através de **Sombras Ambientes** extremamente sutis e camadas tonais. 

1. **Nível 0 (Fundo):** #F8FAFC - A base de toda a aplicação.
2. **Nível 1 (Cards e Tabelas):** Superfícies brancas (#FFFFFF) com uma borda fina de 1px em #E2E8F0 e uma sombra suave (Y: 1px, Blur: 3px, Opacidade: 5% Slate).
3. **Nível 2 (Popovers e Dropdowns):** Sombras mais pronunciadas para indicar sobreposição clara (Y: 4px, Blur: 12px, Opacidade: 10% Navy).

Evitamos o uso de gradientes. A profundidade deve parecer física, mas discreta, como papéis sobrepostos em uma mesa organizada.

## Shapes
Adotamos uma abordagem de **Bordas Suaves (Soft)** para equilibrar a natureza técnica do dashboard com uma estética moderna. 

- **Cards e Containers:** Border-radius de 8px (0.5rem).
- **Inputs e Botões:** Border-radius de 6px (0.375rem).
- **Badges e Status:** Border-radius total (Pill-shaped) para fácil identificação visual como elementos interativos ou informativos distintos.

Esta escolha suaviza a interface corporativa sem perder a seriedade necessária para uma ferramenta de suporte técnico.

## Components
- **Botões:** O botão primário utiliza o Deep Navy (#0F172A) com texto branco. Botões de ação secundária utilizam bordas sutis. O estado de hover deve escurecer levemente a cor base.
- **Data Tables:** Devem possuir cabeçalhos fixos com fundo cinza muito claro. As linhas devem apresentar um estado de hover (#F1F5F9) e padding vertical generoso (12px a 16px) para legibilidade.
- **Badges de Status:** Fundo em tom pastel da cor de status com texto na cor de status saturada (ex: fundo vermelho claro com texto vermelho escuro para "Crítico").
- **Modern Cards:** Devem conter um título claro no topo, seguido por conteúdo e, opcionalmente, um rodapé com ações alinhadas à direita.
- **Inputs:** Bordas em #CBD5E1 que se tornam Navy no foco. Mensagens de erro devem usar a cor de status Crítico.
- **Ícones:** Linhas finas (2px stroke), preferencialmente da biblioteca Lucide ou Heroicons, mantendo a consistência visual com a tipografia Inter.