var AWS  = require ("aws-sdk")
// var uuid = require ("uuid")
// var async = require("async") // to call aws operation asynchronously
// creating an instance using AWS SDK tool

var ec2 = new AWS.EC2({apiVersion:"2016-11-15"})
var instanceParams = {
    ImageId: 'AMI_ID',
    InstanceType: "t2.micro",
    KeyName: "KEY_PAIR_NAME",
    MinCount: 1,
    MaxCount: 1
};
var instancePromise = new AWS.EC2 ({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

instancePromise.then (
    function (data) {
        console.log(data);
        var instanceId = data.Instances[0].InstanceId;
        console.log("Created Instance", instanceId)

        tagParams = {Resource: [instanceId], Tags: [
            {
                Key: 'Name',
                Value: 'sdk smaple'
            }
        ]}

        var tagPromis = new AWS.EC2 ({apiVersion: '2016-11-15'}).createTags(tagParams).promise()
        tagPromis.then(
            function(data){
                console.log("instance tagged")
            }
        ).catch(
            function(err){
                console.error(err, err.stack)
            }
        )
    }
)
