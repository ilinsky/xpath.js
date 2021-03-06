var cException = require('./../../../../../classes/Exception');

var cXSConstants = require('./../../../XSConstants');

var cXSInteger = require('./XSInteger');
var cXSNonPositiveInteger = require('./XSNonPositiveInteger');

function cXSNegativeInteger(nValue) {
	this.value	= nValue;
};

cXSNegativeInteger.prototype	= new cXSNonPositiveInteger;
cXSNegativeInteger.prototype.builtInKind	= cXSConstants.NEGATIVEINTEGER_DT;

cXSNegativeInteger.cast	= function(vValue) {
	var oValue;
	try {
		oValue	= cXSInteger.cast(vValue);
	}
	catch (oError) {
		throw oError;
	}
	// facet validation
	if (oValue.value <= -1)
		return new cXSNegativeInteger(oValue.value);
	//
	throw new cException("FORG0001");
};

//
module.exports = cXSNegativeInteger;
