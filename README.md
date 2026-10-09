# Fullstack starter: React + TypeScript + Java + Claude Code + GitHub

Przykładowy menedżer zadań: lista i dodawanie przez REST API. Ten katalog jest gotowym
katalogiem głównym przyszłego repozytorium. Skopiuj **cały katalog, razem z ukrytymi
`.claude` i `.github`**, do własnego miejsca pracy. Nie kopiuj `node_modules` ani `dist`.

## Stos i uruchomienie

- Node.js 22.12+ i npm; React 19, TypeScript 5.9, Vite 7.
- JDK 21 i Maven 3.9+ w PATH; Spring Boot 3.5.16 (jawnie przypięty przykład z linii 3.5).
- Git i zainstalowany Claude Code. GitHub CLI (`gh`) tylko do pracy z issue/PR.
- H2 w pamięci: dane są usuwane po restarcie. Brak logowania użytkowników.

W katalogu głównym:

```sh
npm --prefix frontend ci
npm run dev:backend
```

W drugim terminalu:

```sh
npm run dev:frontend
```

Otwórz http://127.0.0.1:5173. Backend: http://127.0.0.1:8080/api/tasks.
Vite przekazuje `/api` do backendu, więc lokalnie nie potrzeba konfiguracji CORS.
Na Windows przy blokadzie `npm.ps1` użyj `npm.cmd` zamiast `npm`.

```sh
npm run check
npm run build:frontend
npm run test:hooks
npm run check:config
```

`check` obejmuje kontrolę typów, testy klienta API, formatowanie i testy backendu.
Nie obejmuje testów przeglądarkowych end-to-end. Przed wdrożeniem potrzebne są trwała
baza, migracje, uwierzytelnienie i konfiguracja serwowania frontendu/proxy.

## Mapa repozytorium

```text
.
├── CLAUDE.md                         główny agent: zasady i koordynacja
├── .claude/
│   ├── settings.json                 uprawnienia i zdarzenia hooków
│   ├── hooks/                        skrypty Node, bez zależności zewnętrznych
│   ├── agents/
│   │   ├── frontend-engineer.md
│   │   ├── backend-engineer.md
│   │   └── code-reviewer.md
│   └── skills/
│       ├── implement-feature/SKILL.md
│       ├── check-project/SKILL.md
│       ├── review-changes/SKILL.md
│       └── prepare-pr/SKILL.md
├── .github/
│   ├── workflows/ci.yml              osobne joby frontend/backend
│   ├── ISSUE_TEMPLATE/feature.yml
│   └── pull_request_template.md
├── frontend/                         React, API client, testy i CLAUDE.md
├── backend/                          Spring Boot, H2, testy i CLAUDE.md
├── docs/api.md                       wspólny kontrakt HTTP
└── scripts/                          uruchomienie Mavena i testy hooków
```

## Agent a subagent

Główny agent to bieżąca rozmowa w Claude Code; jego instrukcje projektu są w `CLAUDE.md`.
Pliki `.claude/agents/*.md` definiują custom agents, które główny agent uruchamia jako
subagentów. Nie istnieje osobny wymagany katalog `.claude/subagents`.

Frontend i backend mają narzędzia edycji i terminal. Reviewer ma tylko Read/Glob/Grep:
czyta przekazany diff lub pliki, ale nie uruchamia testów i niczego nie edytuje.
Nie przypinamy modelu: agenci korzystają z ustawień modelu sesji.
Wywołanie skilla `/review-changes` ma `context: fork` i `agent: code-reviewer`, czyli
przenosi analizę do osobnego kontekstu. Przy przeglądzie zmian koordynator powinien
najpierw pobrać diff i przekazać jego treść lub ścieżki, bo reviewer nie ma Bash.

## Hooki

| Hook | Zdarzenie | Działanie |
|---|---|---|
| session-context | SessionStart | Dodaje stan Git i wskazówki projektu do kontekstu |
| protect-files | PreToolUse dla Edit/Write | Blokuje edycję `.env`, kluczy, `.git` i wyjście poza repo |
| format-frontend | PostToolUse dla Edit/Write | Formatuje obsługiwane pliki frontendowe lokalnym Prettier |

`CLAUDE_PROJECT_DIR` zapewnia ścieżkę niezależną od bieżącego katalogu.
Nie ma pobierania formattera przy każdym hooku ani wykonywania ścieżki pliku jako polecenia.
Hook ochronny zwraca kod 2; hook formatowania informuje o błędzie kodem 1 i nie cofa edycji.
Hooki sprawdzisz przez `/hooks`, agentów przez `/agents`. Node musi być w PATH Claude Code.
Hooki ustawień obejmują też wywołania narzędzi przez subagentów.

Ochrona Edit/Write nie blokuje edycji wykonanej przez terminal lub zewnętrzne narzędzie.
Wpisy deny dla Read nie blokują odczytu przez każde możliwe polecenie Bash.
To przykład automatyzacji i ograniczeń narzędzi, nie izolacja bezpieczeństwa.
Pełna weryfikacja jest jawna w skillu i CI; nie uruchamiamy całego zestawu po każdym zapisie.

## Przykładowy flow GitHub

1. Utwórz repozytorium na GitHub, skopiuj ten katalog, wykonaj `git init -b main`,
   dodaj pliki i pierwszy commit, ustaw własny `origin`, a następnie wypchnij `main`.
2. Utwórz issue z kryteriami akceptacji. Przykład: „Użytkownik może oznaczyć zadanie jako zakończone”.
3. Utwórz gałąź `feature/task-completion` i uruchom `claude` w katalogu repozytorium.
4. Zleć `/implement-feature Dodaj oznaczanie zadania jako zakończone zgodnie z issue #12`.
5. Koordynator ustala kontrakt, deleguje frontend/backend, integruje i sprawdza wynik.
6. Zleć `/check-project`, następnie `/prepare-pr Przygotuj opis dla issue #12`.
7. Jeśli chcesz publikacji: „Wypchnij tę gałąź i utwórz draft PR dla issue #12”.
   Sama komenda przygotowania opisu nie publikuje niczego.
8. GitHub Actions uruchamia kontrole. Człowiek przegląda PR i podejmuje decyzję o merge.

Numer #12 jest wyłącznie przykładem — zastąp go rzeczywistym issue. Skille nie zakładają
istnienia takiego issue ani zalogowanego konta. `gh auth login` wykonaj we własnym środowisku.

Po publikacji ustaw w GitHub ruleset dla `main`: wymagaj PR, review i statusów
`frontend` oraz `backend` z workflow CI. Ten lokalny szkielet nie ustawia rulesetu
w serwisie; konfiguracja jest w Settings → Rules → Rulesets. Jeśli gałąź bazowa ma
inną nazwę, zmień filtr push w `ci.yml`.

CI działa dla zwykłych PR, w tym z forków; używa tylko `contents: read` i nie wymaga
sekretów. Nie dodawaj tokenów GitHub do settings.json ani do skilli.
MCP i dodatkowe pluginy nie są wymagane: GitHub obsługujemy przez standardowe `git` i `gh`.
Osobiste preferencje trzymaj w ignorowanym `.claude/settings.local.json`.

## Dokumentacja źródłowa

- [Claude Code: settings](https://code.claude.com/docs/en/settings)
- [Hooki](https://code.claude.com/docs/en/hooks)
- [Skills](https://code.claude.com/docs/en/skills)
- [Subagenci](https://code.claude.com/docs/en/sub-agents)
- [GitHub Actions: Java/Maven](https://docs.github.com/en/actions/tutorials/build-and-test-code/java-with-maven)

## Weryfikacja dostarczonego przykładu

Aktualny raport: [VALIDATION.md](VALIDATION.md). Obecność workflow nie oznacza,
że uruchomiono go na GitHub; wynik CI będzie dostępny po publikacji repozytorium.
