var cException = require('./../../../../classes/Exception');

var cXSConstants = require('./../../XSConstants');

var cXSAnySimpleType = require('./../../XSAnySimpleType');
var cXSAnyAtomicType = require('./../XSAnyAtomicType');
var cXSString = require('./XSString');
var cXSDateTime = require('./XSDateTime');

var cString = global.String;
var fString_trim = function (sValue) {
	return cString(sValue).trim();
};

function cXSGMonth(nMonth, nTimezone) {
	this.month		= nMonth;
	this.timezone	= nTimezone;
};

cXSGMonth.prototype	= new cXSAnyAtomicType;
cXSGMonth.prototype.builtInKind		= cXSConstants.GMONTH_DT;
cXSGMonth.prototype.primitiveKind	= cXSAnySimpleType.PRIMITIVE_GMONTH;

cXSGMonth.prototype.month		= null;
cXSGMonth.prototype.timezone	= null;

cXSGMonth.prototype.toString	= function() {
	return '-'
			+ '-' + cXSDateTime.pad(this.month)
			+ cXSDateTime.getTZComponent(this);
};

var rXSGMonth	= /^--(0[1-9]|1[0-2])(Z|([+\-])(0\d|1[0-4]):([0-5]\d))?$/;
cXSGMonth.cast	= function(vValue) {
	if (vValue instanceof cXSGMonth)
		return vValue;
	if (vValue instanceof cXSString || vValue instanceof cXSUntypedAtomic) {
		var aMatch	= fString_trim(vValue).match(rXSGMonth);
		if (aMatch) {
			var nMonth	= +aMatch[1];
			return new cXSGMonth(	nMonth,
									aMatch[2] ? aMatch[2] == 'Z' ? 0 : (aMatch[3] == '-' ? -1 : 1) * (aMatch[4] * 60 + aMatch[5] * 1) : null
			);
		}
		throw new cException("FORG0001");
	}
	if (vValue instanceof cXSDate || vValue instanceof cXSDateTime)
		return new cXSGMonth(vValue.month, vValue.timezone);
	//
	throw new cException("XPTY0004"
//->Debug
			, "Casting value '" + vValue + "' to xs:gMonth can never succeed"
//<-Debug
	);
};

//
module.exports = cXSGMonth;
