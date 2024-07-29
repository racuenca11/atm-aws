import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as path from 'path';

export class AtmApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Dirección de correo electrónico verificada en SES
        const sesVerifiedEmail = 'racuenca11@utpl.edu.ec';

        // Credenciales de correo electrónico
        const emailSender = 'kristylanistek@gmail.com';
        const emailPassword = 'qrnl ldum kpjs plmx';

        // Definir las funciones Lambda
        const depositLambda = new lambda.Function(this, 'DepositFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-deployment-package.zip')),
            handler: 'deposit.handler',
            environment: {
                DB_HOST: 'sql3.freemysqlhosting.net',
                DB_NAME: 'sql3710437',
                DB_USER: 'sql3710437',
                DB_PASSWORD: 'M4ZS1SNcx4',
                DB_PORT: '3306',
                SES_VERIFIED_EMAIL: sesVerifiedEmail,
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        const withdrawLambda = new lambda.Function(this, 'WithdrawFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-deployment-package.zip')),
            handler: 'withdraw.handler',
            environment: {
                DB_HOST: 'sql3.freemysqlhosting.net',
                DB_NAME: 'sql3710437',
                DB_USER: 'sql3710437',
                DB_PASSWORD: 'M4ZS1SNcx4',
                DB_PORT: '3306',
                SES_VERIFIED_EMAIL: sesVerifiedEmail,
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        const changePinLambda = new lambda.Function(this, 'ChangePinFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-deployment-package.zip')),
            handler: 'changepin.handler',
            environment: {
                DB_HOST: 'sql3.freemysqlhosting.net',
                DB_NAME: 'sql3710437',
                DB_USER: 'sql3710437',
                DB_PASSWORD: 'M4ZS1SNcx4',
                DB_PORT: '3306',
                SES_VERIFIED_EMAIL: sesVerifiedEmail,
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        // Definir API Gateway
        const api = new apigateway.RestApi(this, 'atm-api', {
            restApiName: 'ATM Service',
            description: 'This service handles ATM transactions.'
        });

        const depositIntegration = new apigateway.LambdaIntegration(depositLambda);
        const withdrawIntegration = new apigateway.LambdaIntegration(withdrawLambda);
        const changePinIntegration = new apigateway.LambdaIntegration(changePinLambda);

        api.root.addResource('deposit').addMethod('POST', depositIntegration);
        api.root.addResource('withdraw').addMethod('POST', withdrawIntegration);
        api.root.addResource('changepin').addMethod('POST', changePinIntegration);
    }
}
