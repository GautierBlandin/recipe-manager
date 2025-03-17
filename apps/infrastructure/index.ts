import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as path from 'path';
import * as fs from 'fs';

// Configuration
const config = new pulumi.Config();
const projectName = 'recipe-manager';
const environment = config.get('environment') || 'dev';

// Create an AWS resource group
new aws.resourcegroups.Group(`${projectName}-${environment}`, {
  name: `${projectName}-${environment}`,
  resourceQuery: {
    query: JSON.stringify({
      ResourceTypeFilters: ['AWS::AllSupported'],
      TagFilters: [
        {
          Key: 'Project',
          Values: [projectName],
        },
        {
          Key: 'Environment',
          Values: [environment],
        },
      ],
    }),
  },
});

// Define the IAM role for the Lambda function
const lambdaRole = new aws.iam.Role(`${projectName}-lambda-role`, {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com',
        },
        Effect: 'Allow',
        Sid: '',
      },
    ],
  }),
  tags: {
    Project: projectName,
    Environment: environment,
  },
});

// Attach the basic Lambda execution policy to the role
new aws.iam.RolePolicyAttachment(`${projectName}-lambda-policy`, {
  role: lambdaRole.name,
  policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// Path to the server build output
const serverDistPath = path.join(__dirname, '../server/dist');

// Check if the server build exists
if (!fs.existsSync(serverDistPath)) {
  throw new Error(
    `Server build not found at ${serverDistPath}. Please build the server first.`
  );
}

// Create a Lambda function
const lambdaFunction = new aws.lambda.Function(`${projectName}-lambda`, {
  role: lambdaRole.arn,
  runtime: 'nodejs20.x',
  handler: 'main.handler',
  code: new pulumi.asset.FileArchive(serverDistPath),
  timeout: 30, // 30 seconds
  memorySize: 256, // 256 MB
  environment: {
    variables: {
      NODE_ENV: environment,
    },
  },
  tags: {
    Project: projectName,
    Environment: environment,
  },
});

// Create a Lambda function URL
const functionUrl = new aws.lambda.FunctionUrl(`${projectName}-function-url`, {
  functionName: lambdaFunction.name,
  authorizationType: 'NONE', // Public access
  cors: {
    allowCredentials: true,
    allowOrigins: ['*'],
    allowMethods: ['*'],
    allowHeaders: ['*'],
    maxAge: 86400,
  },
});

// Export the function URL
export const url = functionUrl.functionUrl;
