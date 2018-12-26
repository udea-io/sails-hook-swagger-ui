// const Sails = require('sails');
const _ = require('lodash');
const rc = require('rc');
const Sails = require('sails').constructor;
const chai = require('chai');
const env = require('../config/env/test');
chai.use(require('chai-datetime'));

global.request = require('supertest');

global.should = chai.should();
global.sinon = require('sinon');

const sailsApp = new Sails();

before((done) => {
  const config = rc('sails');
  if (process.env.TEST_MODE === 'STRESS') {
    // ref from https://segmentfault.com/a/1190000004888348
    const fs = require('fs');
    let logFileName = './test/stress/';
    if (process.env.STRESS_TAG) {
      logFileName += `${process.env.STRESS_TAG}/`;
    }
    logFileName += 'output_serverMemory.xls';

    // write header
    try {
      fs.statSync(logFileName);
      console.log('logging file alreay exist');
    } catch (e) {
      fs.appendFile(logFileName,
        'memory-rss\t'
        + 'memory-heapUsed\t'
        + 'memory-heapTotal\t',
        'utf8');
      setInterval(() => {
        const mem = process.memoryUsage();
        fs.appendFile(logFileName,
          `${mem.rss / 1024 / 1024}\t${
            mem.heapUsed / 1024 / 1024}\t${
            mem.heapTotal / 1024 / 1024}\n`, 'utf8');
      }, 1000);
    }
    // write data
    config.environment = 'production';
  } else {
    config.environment = 'test';
  }

  sailsApp.lift(config, (err, server) => {
    if (err) return done(err);
    // force reassignment
    // eslint-disable-next-line no-param-reassign
    server.config = _.merge(
      {},
      server.config,
      env,
      {
        environment: 'test',
        autoreload: false,
      },
    );
    // eslint-disable-next-line no-param-reassign
    server.config.autoreload = false;
    sails.log('\n\n======== config.environment ==>', server.config.environment);
    return done(err, server);
  });
});

after((done) => {
  sailsApp.lower(done());
});
