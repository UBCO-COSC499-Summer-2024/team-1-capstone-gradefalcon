const amqp = require('amqplib/callback_api');
const { exec } = require('child_process');

amqp.connect('amqp://rabbitmq', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'omr_queue';

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, function(msg) {
      const { filePath } = JSON.parse(msg.content.toString());
      console.log(" [x] Received %s", filePath);

      const command = `docker-compose run --rm omr python3 main.py --setLayout --input ${filePath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing OMR container: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
      });
    }, {
      noAck: true
    });
  });
});
