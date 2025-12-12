# SQL-Assessment

## This repository holds multiple functions to generate, evaluate and give feedback on SQL-assessments

- DB_introspection
- DB_annotation
- SQL_executor
- SQL_generator
- SQL_to_text
- SQL_feedback
- compare_tabular_results

### SQL_executor

```bash
npx tsx src/sql_executor/Executor.ts "{\"args\": {\"query\": \"select * from ang_pro limit 5;\"}}" > test.json
```

### compare_tabular_results

```bash
npx tsx src/compare_tabular_results/Comparator.ts "{\"args\": {\"referenceResult\": [{\"COLUMN_A\":50}], \"studentResult\": [{\"COLUMN_A\":50}]}}" > test.json
```

###  DB_introspection

```bash
npx tsx src/db_introspection/Introspector.ts > test.json
```

## Run tests