# node-red-contrib-redis-storage
[![npm version](https://badge.fury.io/js/node-red-contrib-redis-storage.svg)](https://badge.fury.io/js/node-red-contrib-redis-storage)
[![license](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://opensource.org/licenses/ISC)

An implementation of the [Node-RED Storage API](http://nodered.org/docs/api/storage/) using Redis.

This works particularly well if you want to host Node-RED on a Heroku instance, or any other provider that uses an ephemeral filesystem.

## Requirements

- Node.js 14+
- Redis 3.0+
- Node-RED 1.0+

## Installation

Install the npm package:
```bash
npm install node-red-contrib-redis-storage
```

## Configuration

Add the following configuration to your Node-RED `settings.js` file:

### Basic Configuration
```javascript
module.exports = {
  // ... other settings
  redis: {
    host: 'localhost',
    port: 6379
  },
  storageModule: require('node-red-contrib-redis-storage')
}
```

### With Authentication
```javascript
module.exports = {
  // ... other settings
  redis: {
    host: 'your.redis.host',
    port: 6379,
    password: 'your.redis.password'
  },
  storageModule: require('node-red-contrib-redis-storage')
}
```

### Advanced Configuration
```javascript
module.exports = {
  // ... other settings
  redis: {
    host: 'your.redis.host',
    port: 6379,
    password: 'your.redis.password',
    database: 0,
    username: 'your.redis.username', // Redis 6.0+ ACL
    socket: {
      tls: true, // Enable TLS
      connectTimeout: 10000,
      lazyConnect: true
    }
  },
  storageModule: require('node-red-contrib-redis-storage')
}
```

### Redis URL Configuration
You can also use a Redis URL (useful for cloud deployments):
```javascript
module.exports = {
  // ... other settings
  redis: {
    url: 'redis://username:password@host:port/database'
    // or for TLS: 'rediss://username:password@host:port/database'
  },
  storageModule: require('node-red-contrib-redis-storage')
}
```

### Environment Variables
For production deployments, you can use environment variables:
```javascript
module.exports = {
  // ... other settings
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    database: process.env.REDIS_DB || 0
  },
  storageModule: require('node-red-contrib-redis-storage')
}
```

## What Gets Stored

The following Node-RED data is persisted to Redis:
- **Flows** (`nr:flows`) - Your Node-RED flow configuration
- **Credentials** (`nr:credentials`) - Encrypted node credentials
- **Settings** (`nr:settings`) - Runtime settings
- **Sessions** (`nr:sessions`) - User session data
- **Library entries** (`nr:lib:*`) - Flow library items

## Cloud Deployment Examples

### Heroku with Redis To Go
```javascript
redis: {
  url: process.env.REDISTOGO_URL
},
storageModule: require('node-red-contrib-redis-storage')
```

### AWS ElastiCache
```javascript
redis: {
  host: 'your-cluster.cache.amazonaws.com',
  port: 6379,
  password: 'your-auth-token',
  socket: {
    tls: true
  }
},
storageModule: require('node-red-contrib-redis-storage')

## Troubleshooting

### Connection Issues
- Ensure Redis server is running and accessible
- Check firewall settings and network connectivity
- Verify credentials and connection parameters

### Performance
- Consider using Redis clustering for high availability
- Monitor Redis memory usage with large flows
- Use appropriate Redis persistence settings (RDB/AOF)

## Migration from v1.x

This version uses the modern `redis@4.x` client. Key changes:
- Async/await instead of callbacks
- Improved error handling and reconnection
- Better TypeScript support
- No breaking changes to the Node-RED storage API

## Contributing

Pull requests are welcome! Please post feature requests, bug reports and suggestions in the GitHub issue tracker.

## License

### ISC License (ISC)
Copyright 2017, Andrew Allen

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
