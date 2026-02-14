export class RedisKeys {
  private static readonly prefix = 'app:v1';

  static user = {
    all: () => `${this.prefix}:user:list`,
    byId: (id: string | number) => `${this.prefix}:user:${id}`,
  };

  static auth = {
    accessToken: (userId: string | number) =>
      `${this.prefix}:auth:access:${userId}`,
    refreshToken: (userId: string | number) =>
      `${this.prefix}:auth:refresh:${userId}`,
  };
}