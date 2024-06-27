#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AtmApiStack } from '../lib/atm-api-stack';

const app = new cdk.App();
new AtmApiStack(app, 'AtmApiStack');
