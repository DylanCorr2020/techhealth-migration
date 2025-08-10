#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { VPCStack } from '../lib/vpc-stack';
import { EC2Stack } from '../lib/ec2-stack';

const app = new cdk.App();

//create new instance of VPC Stack 
const vpcStack = new VPCStack(app, 'VPCStack', {
    


});

//create new instance of EC2 Stack 
const ec2Stack = new EC2Stack(app, 'EC2Stack', {
  vpc: vpcStack.vpc

})


app.synth()