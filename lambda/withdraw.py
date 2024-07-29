import pymysql
import json
import os
import bcrypt
from email_utils import send_email

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
            cursor.execute("SELECT saldo, correoElectronico FROM CuentaBancaria WHERE numeroCuenta = %s", (numero_cuenta,))
            result = cursor.fetchone()
            if result is None:
                response = {
                    'statusCode': 404,
                    'body': json.dumps({'message': 'Cuenta no encontrada'})
                }
            else:
                saldo = result[0]
                to_email = result[1]
                if saldo < monto:
                    response = {
                        'statusCode': 400,
                        'body': json.dumps({'message': 'Fondos insuficientes'})
                    }
                else:
                    cursor.execute("UPDATE CuentaBancaria SET saldo = saldo - %s WHERE numeroCuenta = %s", (monto, numero_cuenta))
                    cursor.execute("INSERT INTO Transaccion (tipo, monto, idCuenta) VALUES ('Retiro', %s, (SELECT id FROM CuentaBancaria WHERE numeroCuenta = %s))", (monto, numero_cuenta))
                    connection.commit()

                    # Enviar correo electrónico
                    subject = 'Retiro Realizado'
                    email_body = f'Se ha realizado un retiro de {monto} de la cuenta {numero_cuenta}.'
                    send_email(to_email, subject, email_body)

                    response = {
                        'statusCode': 200,
                        'body': json.dumps({'message': 'Retiro realizado con éxito'})
                    }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
    finally:
        connection.close()

    return response
