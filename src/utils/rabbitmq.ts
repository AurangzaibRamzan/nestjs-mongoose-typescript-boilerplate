import * as amqp from 'amqplib';
import { RabbitMQ_URL } from '../config';

export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect(): Promise<void> {
    console.log('connect to  RabbitMQ');
    // this.connection = await amqp.connect(RabbitMQ_URL);
    // this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    console.log(`Published message to ${queue}:`, message);
    // this.channel.assertQueue(queue, { durable: false });
    // this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }
}
