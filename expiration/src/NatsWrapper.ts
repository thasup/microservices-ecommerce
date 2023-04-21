import nats, { type Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  get client (): Stan {
    if (this._client == null) {
      throw new Error('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  async connect (clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url,
      waitOnFirstConnect: true
    });

    await new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
