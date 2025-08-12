#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { VPCStack } from "../lib/vpc-stack";
import { EC2Stack } from "../lib/ec2-stack";
import { RDSStack } from "../lib/rds-stack";

const app = new cdk.App();

//create new instance of VPC Stack
const vpcStack = new VPCStack(app, "VPCStack", {});

//create new instance of EC2 Stack
const ec2Stack = new EC2Stack(app, "EC2Stack", {
  vpc: vpcStack.vpc,
});

//Create new instance of RDS Stack
const rdsStack = new RDSStack(app, "RDSStack", {
  vpc: vpcStack.vpc,
  ec2SecurityGroup: ec2Stack.ec2SecurityGroup,
});

app.synth();
