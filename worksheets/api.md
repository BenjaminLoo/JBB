# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

## Get Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    | /basic/data |

### Parameters

| parameter     | datatype        | example   |
| ---------     | --------------- | --------- |
| companyid     | BIGINT          | 123456789 |
| minCount      | Integer         | 55000     |
| maxCount      | Integer         | 65000     |
| minCost       | Decimal(10,2)   | 500.00    |
| maxCost       | Decimal(10,2)   | 800.00    |

### Response Body

```json
[
    {
        "optionid": number,
        "companyid": number,
        "audiencecount": number,
        "cost": number,
        "audiencereached": number,
        "amount": number,
    } 
]  
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST /basic/data?companyId=1234567892&minCost=1&maxCost=199&minCount=5&maxCount=356
```

### Sample Response

```json
[
    {
        "optionid": "1234564321",
        "companyid": "1234567892",
        "audiencecount": 23,
        "cost": "100.00",
        "audiencereached": 500,
        "amount": 26,
        ...
    }
]
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```

## Insert Data

| attribute   | value         |
| ----------- | -----------   |
| HTTP Method | POST          |
| Endpoint    | /basic/insert |

### Parameters

| parameter     | datatype        | example   |
| ---------     | --------------- | --------- |
| optionid      | BIGINT          | 123456789 |
| companyid     | BIGINT          | 123456789 |
| audiencecount | Integer         | 55000     |
| cost          | Decimal(10,2)   | 500.00    |

### Request Body

```json
{
    "data": [
        {
            "optionId": IDENTIFIER,
            "companyId": IDENTIFIER,
            "audienceCount": number,
            "cost": number
        }
    ]
}
```

### Response Body

```json
{
    "result": "success"
}

```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```json
{
    "data": [
        {
            "optionId": 1234567890,
            "companyId": 1234567890,
            "audienceCount": 10000,
            "cost": 10
        },
        {
            "optionId": 1234567891,
            "companyId": 1234567890,
            "audienceCount": 10000,
            "cost": 20
        },
    ]
}
```

### Sample Response

```json
{
    "result": "success"
}
```

### Sample Error

```json
{
    "error": "Duplicate Entry",
    "code": 400
}
```