import pymysql
import json
import os
import bcrypt

def handler(event, context):
    body = json.loads(event['body'])
    numero_cuenta = body['numeroCuenta']
    clave_antigua = body['claveAntigua']
    clave_nueva = body['claveNueva']

    connection = pymysql.connect(
        host=os.environ['DB_HOST'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD'],
        database=os.environ['DB_NAME'],
        port=int(os.environ['DB_PORT'])
    )
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT claveTarjeta FROM CuentaBancaria WHERE numeroCuenta = %s", (numero_cuenta,))
            result = cursor.fetchone()
            if result is None:
                response = {
                    'statusCode': 404,
                    'body': json.dumps({'message': 'Cuenta no encontrada'})
                }
            else:
                clave_hash = result[0]
                if not bcrypt.checkpw(clave_antigua.encode('utf-8'), clave_hash.encode('utf-8')):
                    response = {
                        'statusCode': 400,
                        'body': json.dumps({'message': 'Clave antigua incorrecta'})
                    }
                else:
                    nuevo_hash = bcrypt.hashpw(clave_nueva.encode('utf-8'), bcrypt.gensalt())
                    cursor.execute("UPDATE CuentaBancaria SET claveTarjeta = %s WHERE numeroCuenta = %s", (nuevo_hash.decode('utf-8'), numero_cuenta))
                    connection.commit()
                    
                    response = {
                        'statusCode': 200,
                        'body': json.dumps({'message': 'Cambio de clave realizado con éxito'})
                    }
    except Exception as e:
        response = {
            'statusCode': 500,
            'body': json.dumps({'message': str(e)})
        }
    finally:
        connection.close()

    return response
