const s3 = require('../awsConfig');

const uploadFile = (folder, fileName, fileContent) => {
  const params = {
    Bucket: 'gradefalcon-storage',
    Key: `${folder}/${fileName}`, // Store file in the specified folder
    Body: fileContent
  };

  return s3.upload(params).promise();
};

const listObjects = (folder) => {
  const params = {
    Bucket: 'gradefalcon-storage',
    Prefix: '${folder}' // List objects within the specified folder
  };

  return s3.listObjectsV2(params).promise();
};

module.exports = { uploadFile, listObjects };
