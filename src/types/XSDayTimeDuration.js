function cXSDayTimeDuration(nDay, nHour, nMinute, nSecond, bNegative) {
	cXSDuration.call(this, null, null, nDay, nHour, nMinute, nSecond, bNegative);
};

cXSDayTimeDuration.RegExp	= /^(-)?P(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:((?:(?:[0-9]+(?:.[0-9]*)?)|(?:.[0-9]+)))S)?)?$/;

cXSDayTimeDuration.prototype	= new cXSDuration;

/*cXSDayTimeDuration.prototype.toString	= function() {

};*/

cXSDayTimeDuration.parse	= function(sValue) {
	if (sValue.match(cXSDayTimeDuration.RegExp))
		return new cXSDayTimeDuration;
	throw new cXPath2Error("FORG0001");
};