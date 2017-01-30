'use strict';

const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;
const Queue = require('../src/queue.js');
const TestQueue = require('../src/queues/event-queue.js');
const EE2 = require('eventemitter2').EventEmitter2;
const EventEmitter = require('events');
// add tests
const queue = new Queue();
const test = new TestQueue();
const ee = new EE2();
const eclassic = new EventEmitter();

queue.on('counter', x => x.resolve());
test.on('counter', x => x.resolve());
ee.on('counter', x => x.resolve());
eclassic.on('counter', x => x.resolve());

suite.add('wrapped queue', {
    defer: true,
    fn: function(defered) {
      queue.emit('counter', defered);

    }
  })
  .add('raw event queue', {
    defer: true,
    fn: function(defered) {
      test.emit('counter', defered);
    }
  })
  .add('ee2', {
    defer: true,
    fn: function(defered) {
      ee.emit('counter', defered);
    }
  })
  .add('ee classic', {
    defer: true,
    fn: function(defered) {
      eclassic.emit('counter', defered);
    }
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({
    'async': !0
  });
