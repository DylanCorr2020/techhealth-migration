import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TechhealthInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new VPC with 2 Availability Zones
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      
      // Define subnets to be created in the VPC
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24
        }
      ]
    })
    
    // Output the VPC ID after deployment
    new cdk.CfnOutput(this,'VpcId', {
      value: vpc.vpcId,
      description: 'VPC UID'
    })
 }

}

