# Relatório de Conformidade: SRP (Single Responsibility Principle)

Este relatório avalia a estrutura atual da aplicação "CampoFogo Codes" sob a ótica do Princípio da Responsabilidade Única (SRP), que dita que uma classe ou componente deve ter apenas um motivo para mudar (ou seja, ter apenas uma única responsabilidade).

---

## 1. Análise dos Elementos Atuais

### ✅ `src/hooks/useSpreadsheetReader.ts`
**Status:** Conforme (Aderente ao SRP)
* **Responsabilidade:** Abstrair o processo de leitura de arquivos (XLSX, CSV), lidar com a `FileReader` API, executar a heurística para localizar a coluna correta de códigos e manter o estado desses dados e de erros.
* **Por que está correto?** O componente visual (`App.tsx`) não sabe *como* a extração do Excel funciona. Ele apenas aciona a ação e recebe os dados prontos. A lógica de negócio está muito bem isolada e modularizada.

### ❌ `src/App.tsx`
**Status:** Não Conforme (Violação de SRP)
* **Responsabilidade Atual:** O componente central abraça responsabilidades demais:
  1. **Gerenciamento de Estado Global do Formulário:** Lida com `titleText`, `customText`, `useIncrementalCode`, `instagramHandle`, etc.
  2. **Renderização de Layout (Estrutura):** Contém a estrutura macro (cabeçalho, painéis de grid, rodapé).
  3. **Visualização do Formulário de Configuração:** Renderiza múltiplos inputs de texto e checkboxes.
  4. **Renderização da Grade de Resultados (Cards):** Itera sobre os dados importados e renderiza individualmente o layout de cada cartão de resgate e seus QR Codes.

* **O problema:** Qualquer mudança visual no cabeçalho, na forma como o formulário de configuração coleta dados, ou no layout interno de um cartão individual exigirá a modificação do arquivo `App.tsx`. Isso o torna um "God Component" (Componente Deus), difícil de ler e de dar manutenção a longo prazo.

---

## 2. Checklist de Melhorias para Refatoração

Para colocar a aplicação em total conformidade com o SRP e com as melhores práticas do React, as seguintes ações devem ser tomadas:

- [ ] **Extrair Componente de Cabeçalho:**
  - Criar `src/components/Header.tsx` para abrigar a logo, o texto descritivo e o componente visual de aviso de segurança (`ShieldCheck`).
  
- [ ] **Extrair Componente de Rodapé:**
  - Criar `src/components/Footer.tsx` com as informações de crédito e o link de acesso ao repositório no GitHub.

- [ ] **Extrair Componente de Cartão Individual:**
  - Criar `src/components/RescueCard.tsx`. Ele deve receber apenas propriedades (props) como `code`, `title`, `description`, `instagramHandle`, etc., e ser responsável *apenas* pela renderização visual de um cartão com seu respectivo QR Code.

- [ ] **Extrair Componente de Painel de Configurações (Opcional, mas recomendado):**
  - Criar `src/components/ConfigPanel.tsx` para isolar a coleção de inputs. Ele receberia os `setters` de estado via props (ou consumiria um contexto global) para atualizar o estado da aplicação.

---

## 3. Conclusão

A arquitetura atual tomou um excelente passo inicial isolando lógicas complexas de dados (`useSpreadsheetReader.ts`), obedecendo a diretriz de *Custom Hooks* da especificação. Contudo, a **camada visual** precisa de componentização urgente. Separar as responsabilidades visuais garantirá que a aplicação seja altamente escalável, performática e que cada arquivo respeite sua única responsabilidade de renderização.
