var cException = require('./../../../../../classes/Exception');

var cXSConstants = require('./../../../XSConstants');

var cXSInteger = require('./XSInteger');
var cXSUnsignedInt = require('./XSUnsignedInt');

function cXSUnsignedShort(nValue) {
	this.value	= nValue;
};

cXSUnsignedShort.prototype	= new cXSUnsignedInt;
cXSUnsignedShort.prototype.builtInKind	= cXSConstants.UNSIGNEDSHORT_DT;

cXSUnsignedShort.cast	= function(vValue) {
	var oValue;
	try {
		oValue	= cXSInteger.cast(vValue);
	}
	catch (oError) {
		throw oError;
	}
	// facet validation
	if (oValue.value >= 1 && oValue.value <= 65535)
		return new cXSUnsignedShort(oValue.value);
	//
	throw new cException("FORG0001");
};

//
module.exports = cXSUnsignedShort;
