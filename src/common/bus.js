'use strict';

const EventEmitter = require('events');

class LREmitter extends EventEmitter {

}
const Bus = new LREmitter();
export default Bus;
