var cException = require('./../../../../../classes/Exception');

var cXSConstants = require('./../../../XSConstants');

var cXSInteger = require('./XSInteger');
var cXSShort = require('./XSShort');

function cXSByte(nValue) {
	this.value	= nValue;
};

cXSByte.prototype	= new cXSShort;
cXSByte.prototype.builtInKind	= cXSConstants.BYTE_DT;

cXSByte.cast	= function(vValue) {
	var oValue;
	try {
		oValue	= cXSInteger.cast(vValue);
	}
	catch (oError) {
		throw oError;
	}
	// facet validation
	if (oValue.value <= 127 && oValue.value >= -128)
		return new cXSByte(oValue.value);
	//
	throw new cException("FORG0001");
};

module.exports = cXSByte;
