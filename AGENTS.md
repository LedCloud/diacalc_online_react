## Hard constraints (never do)

- **Database schema**: Do not create, alter, or drop tables/columns. Do not add migration files or change `Installer` table definitions unless the user explicitly asks for schema work.
- **Database data**: Do not run INSERT, UPDATE, or DELETE against the database — not via PHP, shell, SQL scripts, or test fixtures. Do not seed, wipe, or "fix" live data.
- **Vendor / dependencies**: Do not edit `/vendor/**`, `**/vendor/**`, `node_modules/**`.
- **Secrets**: Do not read, commit, or echo `.env`, `config.local.php`, `local_conf.php`, keys, or credentials.
- **Git**: Do not commit, push, or amend unless the user explicitly asks.

## Project layout

| Path                                          | Purpose                                                                   |
|-----------------------------------------------|---------------------------------------------------------------------------|
| `lang/{en,ru}/`                               | Translations                                                              |
| `lang/{en.json,ru.json}/`                     | Translations                                                             |

## Coding conventions

- **Namespace**: `Tygh\Addons\{PascalCaseAddonId}\` (e.g. `Tygh\Addons\CpSafety\`).
- **Translations**: Add strings to `lang/en/` and `lang/ru/`.
- **Scope**: Keep diffs minimal. One concern per change. Do not refactor unrelated code.

## Workflow

1. Read surrounding code in the target addon before changing anything.
2. Check `addon.xml` scheme version, then pick the matching hook/service pattern.
3. Identify the correct layer: hook handler, service, controller, schema, template, or lang file.
4. Implement the smallest change that solves the task.
5. Do not run destructive or data-mutating commands against the environment.
6. Summarize what changed and where to test in the admin or storefront.

## When unsure

- Ask before touching core CS-Cart, database schema, or cross-addon refactors.
- If rules conflict with an explicit user request, follow the user's latest instruction and note the exception.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
