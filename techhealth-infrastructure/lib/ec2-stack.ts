import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

//pass vpc stack to our ec2 instance
interface EC2StackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class EC2Stack extends cdk.Stack {
  public readonly ec2SecurityGroup: ec2.SecurityGroup; //secuirty group can be read by other stacks

  constructor(scope: Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);

    //Create IAM Role for EC2 with SSM access instead of using SSH
    const ec2Role = new iam.Role(this, "EC2IAMRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });
    ec2Role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Security Group for EC2 (Allows HTTPS App Traffic)
    this.ec2SecurityGroup = new ec2.SecurityGroup(this, "EC2SecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      description: "Security group for EC2 instance",
    });
    this.ec2SecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS"
    );

    //Create EC2 instance in public subnet
    const instance1 = new ec2.Instance(this, "PublicEC2-1", {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      role: ec2Role, // Attach IAM Role
      securityGroup: this.ec2SecurityGroup, // Attach Security Group
    });
  }
}
