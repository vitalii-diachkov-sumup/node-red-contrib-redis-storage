const { createClient } = require('redis');

// Private variables
let settings;
let client;
let debug = false;

const log = {
  info: (message) => {
    if (debug) {
      console.info(message);
    }
  },
};

const saveJSON = async (key, json) => {
  const string = JSON.stringify(json);
  await client.set(key, string);
};

const fetchJSON = async (key, fallback = {}) => {
  try {
    const reply = await client.get(key);
    if (reply === null) {
      return fallback;
    }
    return JSON.parse(reply);
  } catch (error) {
    log.info(`Error fetching JSON for key ${key}: ${error.message}`);
    return fallback;
  }
};

// Public API
const redisStorage = {
  async init(_settings) {
    settings = _settings;
    log.info('initialized with settings:');
    log.info(JSON.stringify(settings, null, 2));

    // Create Redis client with modern configuration
    client = createClient({
      ...settings.redis,
      // Add default error handling
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        ...settings.redis?.socket,
      },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await client.connect();
  },

  async getFlows() {
    log.info('getFlows called');
    return fetchJSON('nr:flows', []);
  },

  async saveFlows(flows) {
    log.info('saveFlows called with:');
    log.info(flows);
    return saveJSON('nr:flows', flows);
  },

  async getCredentials() {
    log.info('getCredentials called');
    return fetchJSON('nr:credentials');
  },

  async saveCredentials(credentials) {
    log.info('saveCredentials called with:');
    log.info(credentials);
    return saveJSON('nr:credentials', credentials);
  },

  async getSettings() {
    log.info('getSettings called');
    return fetchJSON('nr:settings');
  },

  async saveSettings(newSettings) {
    log.info('saveSettings called with:');
    log.info(JSON.stringify(newSettings, null, 2));
    return saveJSON('nr:settings', newSettings);
  },

  async getSessions() {
    log.info('getSessions called');
    return fetchJSON('nr:sessions');
  },

  async saveSessions(sessions) {
    log.info('saveSessions called with:');
    log.info(JSON.stringify(sessions, null, 2));
    return saveJSON('nr:sessions', sessions);
  },

  async getLibraryEntry(type, path) {
    log.info('getLibraryEntry called with:');
    log.info(`type: ${type}`);
    log.info(`path: ${path}`);

    if (path[0] === '/') {
      // List library files in directory
      const _path = path.substr(1); // drop leading slash
      const prefix = `nr:lib:${type}:${_path}*`;
      const replies = await client.keys(prefix);
      const entries = [];

      replies.forEach((reply) => {
        let filepath = reply.substr(prefix.length - 1);
        if (filepath[0] === '/') {
          filepath = filepath.substr(1);
        }
        
        const entry = filepath.includes('/')
          ? filepath.split('/')[0]
          : { fn: filepath };
        
        entries.push(entry);
      });

      return entries;
    } else {
      // Return content of requested library file
      const key = `nr:lib:${type}:${path}`;
      const reply = await client.get(key);
      if (reply) {
        const json = JSON.parse(reply);
        return json.body;
      }
      return null;
    }
  },

  async saveLibraryEntry(type, path, meta, body) {
    log.info('saveLibraryEntry called with:');
    log.info(`type: ${type}`);
    log.info(`path: ${path}`);
    log.info(`meta: ${JSON.stringify(meta, null, 2)}`);
    log.info(`body: ${body}`);

    const key = `nr:lib:${type}:${path}`;
    const entry = { meta, body };
    return saveJSON(key, entry);
  },

  // Add cleanup method for graceful shutdown
  async close() {
    if (client) {
      await client.quit();
    }
  },
};

module.exports = redisStorage;
