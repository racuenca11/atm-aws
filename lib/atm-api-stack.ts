import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class AtmApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const emailSender = 'kristylanistek@gmail.com';
        const emailPassword = 'qrnl ldum kpjs plmx';

        // Definir las funciones Lambda
        const depositLambda = new lambda.Function(this, 'DepositFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'deposit.handler',
            environment: {
                DB_HOST: 'sql3.freesqldatabase.com',
                DB_NAME: 'sql3722722',
                DB_USER: 'sql3722722',
                DB_PASSWORD: 'n84ZHtJsrX',
                DB_PORT: '3306',
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        const withdrawLambda = new lambda.Function(this, 'WithdrawFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'withdraw.handler',
            environment: {
                DB_HOST: 'sql3.freesqldatabase.com',
                DB_NAME: 'sql3722722',
                DB_USER: 'sql3722722',
                DB_PASSWORD: 'n84ZHtJsrX',
                DB_PORT: '3306',
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        const changePinLambda = new lambda.Function(this, 'ChangePinFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'changepin.handler',
            environment: {
                DB_HOST: 'sql3.freesqldatabase.com',
                DB_NAME: 'sql3722722',
                DB_USER: 'sql3722722',
                DB_PASSWORD: 'n84ZHtJsrX',
                DB_PORT: '3306',
                EMAIL_SENDER: emailSender,
                EMAIL_PASSWORD: emailPassword
            }
        });

        // API Gateway
        const api = new apigateway.RestApi(this, 'atm-api', {
            restApiName: 'ATM API'
        });

        // Integrar las funciones Lambda con API Gateway
        const depositIntegration = new apigateway.LambdaIntegration(depositLambda);
        const withdrawIntegration = new apigateway.LambdaIntegration(withdrawLambda);
        const changePinIntegration = new apigateway.LambdaIntegration(changePinLambda);

        api.root.addResource('deposit').addMethod('POST', depositIntegration);
        api.root.addResource('withdraw').addMethod('POST', withdrawIntegration);
        api.root.addResource('changepin').addMethod('POST', changePinIntegration);
    }
}
