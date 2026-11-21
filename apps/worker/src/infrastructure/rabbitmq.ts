// Establishing a RabbitMQ connection.
// Creating channels.
// Declaring exchanges and queues.
// Binding queues to exchanges.
// Publishing messages.
// Consuming messages.
// Handling connection failures and reconnections.
// Managing publisher confirms.


import amqp, { type ChannelModel } from 'amqplib';

class RabbitMQManager {
    private static instance: RabbitMQManager;
    private connection: ChannelModel | null = null;

    private constructor() {}

    public static getInstance(): RabbitMQManager {
        if(!RabbitMQManager.instance) {
            RabbitMQManager.instance = new RabbitMQManager();
        }

        return RabbitMQManager.instance;
    }

    public async getConnection(): Promise<ChannelModel | null> {
        if(!this.connection) {
            this.connection = await amqp.connect("amqp://localhost");

            this.connection.on('close', () => {
                console.warn("RabbitMQ connection closed.");
                this.connection = null;
            });
        }

        return this.connection;
    }
}

async function createConfirmChannel() {
    const rabbitMq = RabbitMQManager.getInstance();

    const connection = await rabbitMq.getConnection();

    const channel = await connection?.createConfirmChannel();

    return channel;
}

async function publishMessage(queue: string, payload: any) {
    const channel = await createConfirmChannel();

    if (!channel) {
        throw new Error('Could not create a RabbitMQ confirm channel.');
    }

    await channel.assertQueue(queue, {
        durable: true,
        arguments: { 'x-queue-type': 'quorum' }
    });

    const sent = channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        persistent: true
    });

    if (!sent) {
        throw new Error(`RabbitMQ is not accepting writes to queue "${queue}".`);
    }

    await channel.waitForConfirms();

    console.log(" [x] Sent '%s'", JSON.stringify(payload));
}

async function consumeMessage(queue: string) {
    const channel = await createConfirmChannel();

    if (!channel) {
        throw new Error('Could not create a RabbitMQ confirm channel.');
    }

    await channel.assertQueue(queue, {
        durable: true,
        arguments: { 'x-queue-type': 'quorum' }
    });

    console.log('Inside of consume message');
    console.log('Queue name: ', queue);
    channel.prefetch(1);
    await channel.consume(queue, function(msg) {
        console.log('Before the return statement');
        if(!msg) {
            console.warn(`Consumer for queue "${queue}" was cancelled.`);
            return;
        }

        console.log('came here func');

        console.log(" [x] Received: %s", msg.content.toString());
        setTimeout(function() {
            console.log(" [x] Done");
            channel.ack(msg);
        }, 3000);
    }, {
        noAck: false
    });
}

export { createConfirmChannel, publishMessage, consumeMessage };