# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## INSERT

Example:
```sql
INSERT INTO table_name (attr1, attr2,...) VALUES (value1, value2, ...);
```

## Ans
```sql
INSERT INTO advertisement (optionId,companyId,audienceCount,cost) values($1,$2,$3,$4)
```
## SELECT with Filtering and Pagination

Example:
```sql
SELECT * FROM table_name WHERE attr1 == value1 AND attr2 >= value2 LIMIT 10 OFFSET 20;
```

### Ans
```sql
SELECT * FROM advertisement WHERE cost >= $1 AND cost <= $2 AND audiencecount >= $3 AND audiencecount <= $4 AND companyId = $5
```