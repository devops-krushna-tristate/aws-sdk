var AWS  = require ("aws-sdk")
var uuid = require ("uuid")
var async = require("async") // to call aws operation asynchronously

// creating an s3 bucket in specific region -

if (process.argv.length < 4) {
    console.log('Usage: node s3.js \n' + 'Example: node s3.js my-test-bucket us-east-2');
    process.exit(1);
  }

  var AWS = require('aws-sdk'); // To set the AWS credentials and region.
  var async = require('async'); // To call AWS operations asynchronously.

  AWS.config.update({
    region: region
  });

  var s3 = new AWS.S3({apiVersion: '2006-03-01'});
  var bucket_name = process.argv[2];
  var region = process.argv[3];

  var create_bucket_params = {
    Bucket: bucket_name,
    CreateBucketConfiguration: {
      LocationConstraint: region
    }
  };

  var delete_bucket_params = {Bucket: bucket_name};

  // List all of your available buckets in this AWS Region.
  function listMyBuckets(callback) {
    s3.listBuckets(function(err, data) {
      if (err) {

      } else {
        console.log("My buckets now are:\n");

        for (var i = 0; i < data.Buckets.length; i++) {
          console.log(data.Buckets[i].Name);
        }
      }

      callback(err);
    });
  }

  // Create a bucket in this AWS Region.
  function createMyBucket(callback) {
    console.log('\nCreating a bucket named ' + bucket_name + '...\n');

    s3.createBucket(create_bucket_params, function(err, data) {
      if (err) {
        console.log(err.code + ": " + err.message);
      }

      callback(err);
    });
  }

  // Delete the bucket you just created.
  function deleteMyBucket(callback) {
    console.log('\nDeleting the bucket named ' + bucket_name + '...\n');

    s3.deleteBucket(delete_bucket_params, function(err, data) {
      if (err) {
        console.log(err.code + ": " + err.message);
      }

      callback(err);
    });
  }

  // Call the AWS operations in the following order.
  async.series([
    listMyBuckets,
    createMyBucket,
    listMyBuckets,
    deleteMyBucket,
    listMyBuckets
  ]);
//adding the files to the s3 bucket.
AWS.config.update({region:'REGION'}) // will provide the region or check the region configured in the aws credentials.
AWS.config.getCredentials(function(err) 
{
    if (err) console.log(err.stack);  // getting the credentials from the ~/.aws/credentials file  and if dont have then please through an error with the message
    else {
        console.log("Access Key:", AWS.config.getCredentials.accessKeyId)  // else fetch the access key and the region out of it.
        console.log("Region", AWS.config.region);
    }
})

var bucketName = "node-sdk-sample-" + uuid.v4();   // bucketname and the id for the same

var KeyName = "hello_world.txt";

var bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();  // will create new bucket named as given 

bucketPromise.then (

    function (data) {
    var objectParams = {Bucket: bucketName, Key:KeyName, Body: 'Hello World!'};  
    var uploadPromise = new AWS.S3 ({apiVersion: '2006-03-01'}).putObject(objectParams).promise();  // it will put the object hello_world.txt in the s3 bucket on the specific path which we have provided. 
    uploadPromise.then(
        function(data) {
            console.log("Successfully uploaded date to " + bucketName + "/" + KeyName);   // will put the code at specific path which we have denoted.
        })
}).catch(
    function(err){
        console.error(err,err.stack)   // else give an error
});

// Creating aws S3 policy for bucket.

s3 = new AWS.S3({apiVersion: '2006-03-01'})

var readOnlyAnonUserPolicy = {
    Version: "2012-10-07",
    Statement: [
        {
            Sid: "AddPrem",
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:getObject"
            ],
            Resource: [
                "*"
            ]
        }
    ]
}

var bucketResource = "arn:aws:s3:::" + process.argv[2] + "/*";

readOnlyAnonUserPolicy.Statement[0].Resource[0] = bucketResource;

var bucketPolicyParams = { Bucket: process.argv[2], Policy: JSON.stringify(readOnlyAnonUserPolicy)};

s3.putBucketPolicy(bucketPolicyParams, function (err, data){
    if (err) {
        console.log("Error",err)
    }else {
        console.log("success", data)
    }
})


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
