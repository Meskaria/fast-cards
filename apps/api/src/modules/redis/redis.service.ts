import { Inject, Injectable } from '@nestjs/common';

import { KeyType, Redis } from 'ioredis';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  REDIS_EXPIRE_KEY_NAME,
  REDIS_EXPIRE_TIME_IN_SECONDS,
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from '@app/modules/redis/redis.constants';

export interface IRedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly subClient: Redis,
    @Inject(REDIS_PUBLISHER_CLIENT) private readonly pubClient: Redis
  ) {}

  public fromEvent<T>(eventName: string): Observable<T> {
    this.subClient.subscribe(eventName);

    return Observable.create((observer: Observer<IRedisSubscribeMessage>) =>
      this.subClient.on('message', (channel, message) =>
        observer.next({ channel, message })
      )
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }: {message: any}) => JSON.parse(message))
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.pubClient.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error) {
            return reject(error);
          }

          return resolve(reply);
        }
      );
    });
  }
  public async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.count(key)
        .then((count) => {
          return resolve(count >= 1);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  public getAllKeys(wildcard: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.pubClient.keys(wildcard, async (error, results) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results);
        }
      });
    });
  }

  public getAllKeyValue(wildcard: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.pubClient.keys(wildcard, async (error, results) => {
        if (error) {
          return reject(error);
        } else {
          const allResults = await Promise.all(
            results.map(async (key) => {
              const value = await this.get(key);
              return { key, value };
            })
          );
          return resolve(allResults);
        }
      });
    });
  }

  public async set(key: KeyType, value: unknown) {
    await this.pubClient.set(
      key,
      JSON.stringify(value),
      REDIS_EXPIRE_KEY_NAME,
      REDIS_EXPIRE_TIME_IN_SECONDS
    );
  }

  public async get(key: KeyType) {
    const res = await this.pubClient.get(key);

    return await JSON.parse(res as string);
  }

  public async del(key: KeyType) {
    return await this.pubClient.del(key);
  }
}
