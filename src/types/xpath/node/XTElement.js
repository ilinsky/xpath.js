/*
 * XPath.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2016 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

var cXTNode = require('./../XTNode');

function cXTElement() {

};

cXTElement.prototype	= new cXTNode;

//
module.exports = cXTElement;