import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class AtmApiStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Definir las funciones Lambda 1
        const depositLambda = new lambda.Function(this, 'DepositFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'deposit.handler',
            environment: {
                DB_HOST: 'sql3.freemysqlhosting.net',
                DB_NAME: 'sql5715916',
                DB_USER: 'sql5715916',
                DB_PASSWORD: 'JWePdTcmsF',
                DB_PORT: '3306'
            }
        });

        const withdrawLambda = new lambda.Function(this, 'WithdrawFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'withdraw.handler',
            environment: {
                DB_HOST: 'sql3.freemysqlhosting.net',
                DB_NAME: 'sql5715916',
                DB_USER: 'sql5715916',
                DB_PASSWORD: 'JWePdTcmsF',
                DB_PORT: '3306'
            }
        });

        const changePinLambda = new lambda.Function(this, 'ChangePinFunction', {
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'changepin.handler',
            environment: {
              DB_HOST: 'sql3.freemysqlhosting.net',
              DB_NAME: 'sql5715916',
              DB_USER: 'sql5715916',
              DB_PASSWORD: 'JWePdTcmsF',
                DB_PORT: '3306'
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
