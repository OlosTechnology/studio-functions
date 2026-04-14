# Studio Functions

Um compilado de funções prontas para uso no **Olos Studio**, desenvolvidas em JavaScript.

## Detalhamento de informações sobre o projeto

Este projeto tem como objetivo centralizar funções utilitárias prontas para serem utilizadas no `olos-studio`. As funções são escritas em JavaScript (ES Modules), testadas com Jest e seguem convenções específicas do Studio, como a notação `@Studio` para declaração de variáveis globais injetadas pelo ambiente.

## Configuração

### Pré-requisitos

- **Node.js** (versão compatível com ES Modules)
- **npm**

### Instalação

```bash
git clone <url-do-repositorio>
cd studio-functions
npm install
```

O comando `npm install` também configura os hooks do **Husky** automaticamente (via script `prepare`).

### Scripts disponíveis

| Comando              | Descrição                                        |
| -------------------- | ------------------------------------------------ |
| `npm test`           | Executa os testes com Jest                        |
| `npm run lint`       | Executa o ESLint nas funções em `functions/`      |
| `npm run lint:fix`   | Corrige automaticamente problemas de lint         |
| `npm run prettier`   | Formata todos os arquivos com Prettier            |

## Dependências

### Produção

| Pacote       | Descrição                                              |
| ------------ | ------------------------------------------------------ |
| `cross-env`  | Permite definir variáveis de ambiente cross-platform    |

### Desenvolvimento

| Pacote                    | Descrição                                              |
| ------------------------- | ------------------------------------------------------ |
| `jest`                    | Framework de testes                                    |
| `babel-jest`              | Transformador Babel para Jest                          |
| `@babel/core`             | Compilador Babel                                       |
| `@babel/preset-env`       | Preset Babel para compatibilidade com ambientes        |
| `eslint`                  | Linter para JavaScript                                 |
| `@eslint/js`              | Configuração base do ESLint                            |
| `eslint-plugin-prettier`  | Integração Prettier + ESLint                           |
| `eslint-config-prettier`  | Desabilita regras conflitantes com Prettier             |
| `prettier`                | Formatador de código                                   |
| `husky`                   | Git hooks automatizados                                |
| `lint-staged`             | Executa linters apenas em arquivos staged               |
| `globals`                 | Definições de variáveis globais para ESLint             |

## Arquitetura

```
studio-functions/
├── functions/          # Funções prontas para o Olos Studio
│   ├── validarCPF.js
│   └── etc
├── tests/              # Testes unitários (Jest)
│   ├── validarCPF.spec.js
│   └── etc
├── config/             # Configurações customizadas
│   ├── eslint-plugin-studio.js    # Plugin ESLint que extrai @property do bloco @Studio e declara como globais
│   ├── studio-transformer.js      # Transformer Jest que injeta variáveis @Studio nas funções para testes
│   └── missing-test-reporter.cjs  # Reporter Jest que alerta sobre funções sem testes correspondentes
├── eslint.config.js    # Configuração do ESLint (flat config)
├── jest.config.js      # Configuração do Jest
└── package.json
```

### Convenção `@Studio`

As funções utilizam uma notação especial para declarar variáveis injetadas pelo ambiente do Olos Studio:

```javascript
/**
 * @Studio
 * @Title Nome da Função
 * @property {string} studio_nomeVariavel - Descrição da variável
 */
export function minhaFuncao() {
  // studio_nomeVariavel é disponibilizada automaticamente pelo ambiente
}
```

- As variáveis devem seguir a convenção `studio_nomeVariavel`
- Tipos aceitos: `string`, `number`, `boolean`

### Pipeline de qualidade (lint-staged + Husky)

A cada commit, o Husky aciona o `lint-staged` que executa automaticamente:

1. `eslint --fix` — corrige problemas de lint
2. `prettier --write` — formata o código
3. `npm test` — executa todos os testes

Se qualquer etapa falhar, o commit é bloqueado.

## Testes Unitários

Toda função em `functions/` **deve** ter um arquivo de teste correspondente em `tests/` com a extensão `.spec.js`. Funções sem testes serão reportadas pelo Jest e o commit será bloqueado.

### Criando um teste

1. Crie o arquivo `tests/<nomeDaFuncao>.spec.js` com o mesmo nome do arquivo da função.

2. Importe a função:

```javascript
import { minhaFuncao } from '../functions/minhaFuncao';
```

3. Simule as variáveis `@Studio` via `globalThis` antes de cada chamada — o transformer do Jest injeta essas variáveis automaticamente a partir de `globalThis`:

```javascript
globalThis.studio_nomeVariavel = 'valor de teste';
```

4. Escreva os cenários de teste com `describe` / `it` (ou `test`):

```javascript
import { minhaFuncao } from '../functions/minhaFuncao';

describe('Minha Função', () => {
  it('deve retornar o resultado esperado para entrada válida', () => {
    globalThis.studio_entrada = 'valor válido';
    expect(minhaFuncao()).toBe('resultado esperado');
  });

  it('deve lançar erro para entrada inválida', () => {
    globalThis.studio_entrada = 'valor inválido';
    expect(() => minhaFuncao()).toThrow('mensagem de erro');
  });
});
```

### Exemplo real — teste do validarCPF

```javascript
import { ValidarCPF } from '../functions/validarCPF';

describe('Validar CPF', () => {
  it('deve validar um CPF válido', () => {
    globalThis.studio_cpf = '123.456.789-09';
    expect(ValidarCPF()).toBe(globalThis.studio_cpf);
  });

  it('deve lançar um erro para um CPF inválido', () => {
    globalThis.studio_cpf = '123.456.789-00';
    expect(() => ValidarCPF()).toThrow('CPF inválido');
  });
});
```

### Executando os testes

```bash
npm test
```

> Se existirem funções sem testes correspondentes, o reporter `missing-test-reporter` exibirá um alerta indicando quais arquivos de teste estão faltando.

### Boas práticas

- Cubra ao menos os cenários de **entrada válida** e **entrada inválida** para cada função.
- Use `expect(() => fn()).toThrow('mensagem')` para testar erros lançados com `throw`.
- Atribua as variáveis `@Studio` via `globalThis` **dentro de cada `it`/`test`**, para evitar vazamento de estado entre testes.
- Mantenha a nomenclatura do arquivo de teste igual à da função: `functions/foo.js` → `tests/foo.spec.js`.

## Padrão de Commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Formato:**

```
<tipo>(escopo opcional): <descrição>
```

**Tipos permitidos:**

| Tipo       | Descrição                            |
| ---------- | ------------------------------------ |
| `feat`     | Nova funcionalidade                  |
| `fix`      | Correção de bug                      |
| `docs`     | Alteração em documentação            |
| `style`    | Formatação (sem mudança de lógica)   |
| `refactor` | Refatoração de código                |
| `test`     | Adição ou correção de testes         |
| `chore`    | Tarefas diversas                     |

**Exemplos:**

```bash
git commit -m "feat: adicionar validação de CPF"
git commit -m "fix(validarCNPJ): corrigir cálculo do dígito verificador"
git commit -m "docs: atualizar README com instruções de uso"
git commit -m "test: adicionar testes para validarCPF"
```