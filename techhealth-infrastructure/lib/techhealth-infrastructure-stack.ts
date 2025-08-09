import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';


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

    //Create two EC2 Instances in public subnet
  
    const instance1 = new ec2.Instance(this, 'PublicEC2-1',{
     vpc: vpc,
     vpcSubnets:{
    subnetType: ec2.SubnetType.PUBLIC
    },

    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    machineImage: ec2.MachineImage.latestAmazonLinux2023(),

   })





   //Create RDS instance in private subnet 
   const dbInstance = new rds.DatabaseInstance(this, 'PrivateRDS-1', {
     engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
     vpc,
     vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
     instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
     allocatedStorage: 20,
     removalPolicy: cdk.RemovalPolicy.DESTROY,
   })

   
  

     // Output the VPC ID after deployment
    new cdk.CfnOutput(this,'VpcId', {
      value: vpc.vpcId,
      description: 'VPC UID'
    })

 }
}

