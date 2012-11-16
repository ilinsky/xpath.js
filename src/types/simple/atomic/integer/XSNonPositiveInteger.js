/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cXSNonPositiveInteger(nValue) {
	this.value	= nValue;
};

cXSNonPositiveInteger.prototype	= new cXSInteger;

cXSNonPositiveInteger.cast	= function(vValue) {
	return new cXSNonPositiveInteger(cNumber(vValue));
};

//
fXPath2StaticContext_defineSystemDataType("nonPositiveInteger",	cXSNonPositiveInteger);