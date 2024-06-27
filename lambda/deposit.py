import pymysql
import json
import os

def handler(event, context):
    body = json.loads(event['body'])
    numero_cuenta = body['numeroCuenta']
    monto = body['monto']

    connection = pymysql.connect(
        host=os.environ['DB_HOST'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],
        database=os.environ['DB_NAME'],
        port=int(os.environ['DB_PORT'])
    )
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("UPDATE CuentaBancaria SET saldo = saldo + %s WHERE numeroCuenta = %s", (monto, numero_cuenta))
            cursor.execute("INSERT INTO Transaccion (tipo, monto, idCuenta) VALUES ('Deposito', %s, (SELECT id FROM CuentaBancaria WHERE numeroCuenta = %s))", (monto, numero_cuenta))
        connection.commit()
        
        response = {
            'statusCode': 200,
            'body': json.dumps({'message': 'Depósito realizado con éxito'})
        }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
    finally:
        connection.close()

    return response
