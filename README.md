# 🏫 Sistema de Gestão Escolar

Sistema de gestão escolar para administração acadêmica, alunos, professores, turmas, notas, frequência, documentos e demais processos da instituição.

---

## 🎯 Objetivo

Centralizar a gestão da instituição de ensino em um único sistema, permitindo controlar:

* Configurações da escola
* Parâmetros acadêmicos
* Professores
* Alunos
* Turmas
* Matrículas
* Disciplinas
* Grade horária
* Frequência
* Avaliações
* Notas
* Boletins
* Documentos
* Financeiro
* Notificações
* Usuários e permissões

---

# 🛠️ Stack

## Backend

* Node.js
* Express
* JavaScript
* MySQL

## Frontend

* EJS
* HTML
* CSS
* JavaScript
* Bootstrap Icons

## Banco de dados

* MySQL

---

# 🏗️ Estrutura do projeto

A estrutura deve seguir o padrão existente do projeto.

```text
/
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   └── prompts/
│
├── docs/
│   ├── PROJETO.md
│   ├── ARQUITETURA.md
│   ├── ACADEMICO.md
│   ├── BANCO.md
│   ├── ROTAS.md
│   └── PROGRESSO.md
│
├── routes/
├── controllers/
├── services/
├── views/
├── public/
└── ...
```

---

# ⚙️ Configurações

O sistema possui uma área de configurações gerais e configurações acadêmicas.

## Configurações Acadêmicas

```text
Configurações
└── Configurações Acadêmicas
    ├── Séries
    ├── Turnos
    ├── Anos Letivos
    ├── Períodos / Bimestres
    ├── Salas
    └── Tipos de Avaliação
```

Todos esses parâmetros já foram criados.

### Status

* [x] Séries
* [x] Turnos
* [x] Anos Letivos
* [x] Períodos / Bimestres
* [x] Salas
* [x] Tipos de Avaliação

---

# 📚 Cadastros Acadêmicos

## Disciplinas

As disciplinas são cadastradas de forma independente das séries e turmas.

Exemplos:

```text
Matemática
Português
História
Geografia
Ciências
Física
Química
Biologia
```

### Status

* [x] Tela de Disciplinas

---

## 👨‍🏫 Professores

Cadastro dos professores da instituição.

O cadastro possui três grupos principais:

### Dados pessoais

* Nome
* Nome social
* CPF
* Data de nascimento
* Sexo

### Contato

* E-mail
* Telefone
* Celular
* CEP
* Endereço
* Número
* Complemento
* Bairro
* Cidade
* Estado

### Dados profissionais

* Matrícula
* Registro profissional
* Data de admissão
* Formação
* Área de formação
* Carga horária
* Status
* Observações

### Importação

Professores poderão ser cadastrados individualmente ou através de arquivo Excel.

Planejado:

* [ ] Importação de Professores via Excel
* [ ] Modelo/template Excel
* [ ] Validação dos dados
* [ ] Pré-visualização
* [ ] Identificação de duplicados
* [ ] Relatório de erros
* [ ] Confirmação da importação

---

# 👨‍🎓 Alunos

Cadastro dos alunos da instituição.

O cadastro deverá permitir inclusão individual e importação em massa através de Excel.

Planejado:

* [ ] Tela de Alunos
* [ ] Cadastro individual
* [ ] Importação via Excel
* [ ] Modelo/template Excel
* [ ] Validação dos dados
* [ ] Pré-visualização
* [ ] Identificação de duplicados
* [ ] Relatório de erros
* [ ] Confirmação da importação

---

# 🏫 Turmas

A turma será responsável por reunir os principais parâmetros acadêmicos.

Exemplo:

```text
Turma: 1º Ano A

Ano Letivo:
2026

Série:
1º Ano do Ensino Fundamental

Turno:
Manhã

Sala:
Sala 01
```

A turma deverá utilizar os parâmetros já cadastrados, evitando duplicação de informações.

Planejado:

* [ ] Cadastro de Turmas
* [ ] Vincular Ano Letivo
* [ ] Vincular Série
* [ ] Vincular Turno
* [ ] Vincular Sala
* [ ] Vincular Disciplinas
* [ ] Vincular Professores

---

# 📝 Matrículas

Responsável por relacionar alunos ao ano letivo e à turma.

Exemplo:

```text
Aluno
    ↓
Matrícula
    ↓
Ano Letivo 2026
    ↓
Turma 1º Ano A
```

Planejado:

* [ ] Cadastro de matrícula
* [ ] Situação da matrícula
* [ ] Histórico de turmas
* [ ] Transferência
* [ ] Cancelamento
* [ ] Remanejamento

---

# 🕐 Grade Horária

Responsável por definir quando cada disciplina acontece.

Exemplo:

```text
1º Ano A
Segunda-feira
07:00 - 07:50
Matemática
Professor: João
Sala: 01
```

Planejado:

* [ ] Cadastro de horários
* [ ] Dias da semana
* [ ] Horários
* [ ] Disciplina
* [ ] Professor
* [ ] Turma
* [ ] Sala
* [ ] Validação de conflitos

---

# 📋 Diário de Classe

Responsável pelo acompanhamento das aulas.

Planejado:

* [ ] Registro de aula
* [ ] Conteúdo ministrado
* [ ] Frequência
* [ ] Observações
* [ ] Professor responsável

---

# 📊 Avaliações e Notas

Os tipos de avaliação são configurados previamente em:

```text
Configurações
└── Configurações Acadêmicas
    └── Tipos de Avaliação
```

Exemplos:

```text
Prova
Trabalho
Atividade
Projeto
Seminário
Recuperação
```

Depois serão utilizados no lançamento das avaliações.

Planejado:

* [ ] Criar avaliação
* [ ] Vincular disciplina
* [ ] Vincular turma
* [ ] Vincular período
* [ ] Vincular tipo de avaliação
* [ ] Lançar notas
* [ ] Recuperação
* [ ] Cálculo de médias

---

# 📅 Calendário Escolar

Responsável pelo calendário acadêmico da instituição.

Planejado:

* [ ] Eventos escolares
* [ ] Feriados
* [ ] Recessos
* [ ] Dias letivos
* [ ] Reuniões
* [ ] Avaliações
* [ ] Início e fim dos períodos

---

# 💰 Financeiro

Área destinada ao gerenciamento financeiro da instituição.

Planejado:

* [ ] Receitas
* [ ] Despesas
* [ ] Mensalidades
* [ ] Pagamentos
* [ ] Inadimplência
* [ ] Relatórios financeiros

---

# 🔐 Usuários e Permissões

Controle de acesso ao sistema.

Já existem configurações relacionadas a:

* Permissões
* Usuários e permissões
* Perfis de acesso

Planejado:

* [ ] Perfis
* [ ] Permissões por módulo
* [ ] Permissões por ação
* [ ] Controle de acesso
* [ ] Auditoria

---

# 📄 Documentos

Área destinada ao gerenciamento dos documentos da instituição.

Planejado:

* [ ] Tipos de documentos
* [ ] Upload
* [ ] Documentos de alunos
* [ ] Documentos de professores
* [ ] Documentos institucionais
* [ ] Controle de validade

---

# 🔔 Notificações

Responsável pelas notificações do sistema.

Planejado:

* [ ] Notificações internas
* [ ] Alertas
* [ ] Avisos acadêmicos
* [ ] Avisos financeiros
* [ ] Configuração de notificações

---

# 🧠 Regras de arquitetura

## Parâmetros x Cadastros

A principal regra do sistema é:

> **Parâmetros definem as opções. Cadastros utilizam essas opções.**

Exemplo:

```text
Parâmetro
    ↓
Turno: Manhã
    ↓
Turma
    ↓
1º Ano A - Manhã
```

Outro exemplo:

```text
Parâmetro
    ↓
Ano Letivo: 2026
    ↓
Turma
    ↓
1º Ano A - 2026
```

---

# 🔗 Relacionamento acadêmico

A estrutura planejada é:

```text
ANO LETIVO
│
├── PERÍODOS
│
├── TURMAS
│   ├── SÉRIE
│   ├── TURNO
│   ├── SALA
│   ├── DISCIPLINAS
│   └── PROFESSORES
│
└── CALENDÁRIO
```

Depois:

```text
TURMA
│
├── ALUNOS
├── DISCIPLINAS
│   └── PROFESSORES
│
├── DIÁRIO
├── FREQUÊNCIA
└── AVALIAÇÕES
    └── NOTAS
```

---

# 📥 Importação Excel

Professores e alunos poderão ser cadastrados através de arquivos Excel.

Fluxo planejado:

```text
Selecionar Excel
      ↓
Validar arquivo
      ↓
Ler dados
      ↓
Validar campos
      ↓
Verificar duplicidades
      ↓
Pré-visualizar
      ↓
Exibir erros
      ↓
Confirmar
      ↓
Inserir no banco
```

A importação não deve inserir registros automaticamente sem validação e confirmação do usuário.

---

# 🚧 Próximas tarefas

## Cadastros

* [x] Séries
* [x] Turnos
* [x] Anos Letivos
* [x] Períodos / Bimestres
* [x] Salas
* [x] Tipos de Avaliação
* [x] Disciplinas
* [ ] Professores
* [ ] Alunos
* [ ] Turmas
* [ ] Matrículas
* [ ] Grade Horária

## Importação

* [ ] Importação de Professores via Excel
* [ ] Importação de Alunos via Excel
* [ ] Templates Excel
* [ ] Validação
* [ ] Pré-visualização
* [ ] Duplicidades
* [ ] Relatório de erros

## Acadêmico

* [ ] Diário
* [ ] Frequência
* [ ] Avaliações
* [ ] Notas
* [ ] Recuperação
* [ ] Boletim
* [ ] Conselho de Classe

---

# 📊 Progresso atual

```text
Configurações Acadêmicas
████████████████████ 100%

Cadastros Acadêmicos
███████░░░░░░░░░░░░░ 35%

Importação Excel
░░░░░░░░░░░░░░░░░░░░ 0%

Operação Acadêmica
░░░░░░░░░░░░░░░░░░░░ 0%
```

---

# 📌 Regra para novas funcionalidades

Antes de criar uma nova tela ou tabela, verificar:

1. A informação já existe?
2. É um parâmetro ou um cadastro?
3. Será utilizada por outros módulos?
4. Existe uma tabela que já representa essa informação?
5. Existe uma tela semelhante que pode ser reutilizada?
6. Existe uma função ou componente existente que deve ser reaproveitado?

Evitar duplicação de lógica, tabelas, componentes e regras.

---

# 📝 Histórico de desenvolvimento

## 2026

### Configurações Acadêmicas

Concluídos:

* Séries
* Turnos
* Anos Letivos
* Períodos / Bimestres
* Salas
* Tipos de Avaliação

### Cadastros

Concluído:

* Disciplinas

Em desenvolvimento:

* Professores

Próximos:

* Alunos
* Turmas
* Matrículas
* Grade Horária

---

## 🚀 Visão do sistema

O objetivo final é possuir um sistema integrado onde:

```text
CONFIGURAÇÕES
      ↓
PARÂMETROS
      ↓
CADASTROS
      ↓
TURMAS / MATRÍCULAS
      ↓
DIÁRIO / FREQUÊNCIA
      ↓
AVALIAÇÕES / NOTAS
      ↓
BOLETIM / RELATÓRIOS
```

Cada módulo deve aproveitar as informações cadastradas anteriormente, evitando retrabalho e duplicação de dados.
