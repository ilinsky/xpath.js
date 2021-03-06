var cException = require('./../../classes/Exception');
var cSequence = require('./../../classes/Sequence');
var cStaticContext = require('./../../classes/StaticContext');

var cXSAnyAtomicType = require('./../../types/schema/simple/XSAnyAtomicType');

var cArray = global.Array;

function cFunctionCall(sPrefix, sLocalName, sNameSpaceURI) {
	this.prefix			= sPrefix;
	this.localName		= sLocalName;
	this.namespaceURI	= sNameSpaceURI;
	this.args	= [];
};

cFunctionCall.prototype.prefix			= null;
cFunctionCall.prototype.localName		= null;
cFunctionCall.prototype.namespaceURI	= null;
cFunctionCall.prototype.args	= null;

// Public members
cFunctionCall.prototype.evaluate	= function (oContext) {
	var aArguments	= [],
		aParameters,
		fFunction;

	// Evaluate arguments
	for (var nIndex = 0, nLength = this.args.length; nIndex < nLength; nIndex++)
		aArguments.push(this.args[nIndex].evaluate(oContext));

	var sUri	= (this.namespaceURI ? '{' + this.namespaceURI + '}' : '') + this.localName;
	// Call function
	if (this.namespaceURI == cStaticContext.NS_XPF) {
		if (fFunction = cStaticContext.functions[this.localName]) {
			// Validate/Cast arguments
			if (aParameters = cStaticContext.signatures[this.localName])
				fFunctionCall_prepare(this.localName, aParameters, aArguments, oContext);
			//
			var vResult	= fFunction.apply(oContext, aArguments);
			//
			return vResult == null ? [] : vResult instanceof cArray ? vResult : [vResult];
		}
		throw new cException("XPST0017"
//->Debug
				, "Unknown system function: " + sUri + '()'
//<-Debug
		);
	}
	else
	if (this.namespaceURI == cStaticContext.NS_XSD) {
		if ((fFunction = cStaticContext.dataTypes[this.localName]) && this.localName != "NOTATION" && this.localName != "anyAtomicType") {
			//
			fFunctionCall_prepare(this.localName, [[cXSAnyAtomicType, '?']], aArguments, oContext);
			//
			return aArguments[0] === null ? [] : [fFunction.cast(aArguments[0])];
		}
		throw new cException("XPST0017"
//->Debug
				, "Unknown type constructor function: " + sUri + '()'
//<-Debug
		);
	}
	else
	if (fFunction = oContext.staticContext.getFunction(sUri)) {
		//
		var vResult	= fFunction.apply(oContext, aArguments);
		//
		return vResult == null ? [] : vResult instanceof cArray ? vResult : [vResult];
	}
	//
	throw new cException("XPST0017"
//->Debug
			, "Unknown user function: " + sUri + '()'
//<-Debug
	);
};

//->Debug
var aFunctionCall_numbers	= ["first", "second", "third", "fourth", "fifth"];
//<-Debug
function fFunctionCall_prepare(sName, aParameters, aArguments, oContext) {
	var oArgument,
		nArgumentsLength	= aArguments.length,
		oParameter,
		nParametersLength	= aParameters.length,
		nParametersRequired	= 0;

	// Determine amount of parameters required
	while ((nParametersRequired < aParameters.length) && !aParameters[nParametersRequired][2])
		nParametersRequired++;

	// Validate arguments length
	if (nArgumentsLength > nParametersLength)
		throw new cException("XPST0017"
//->Debug
				, "Function " + sName + "() must have " + (nParametersLength ? " no more than " : '') + nParametersLength + " argument" + (nParametersLength > 1 || !nParametersLength ? 's' : '')
//<-Debug
		);
	else
	if (nArgumentsLength < nParametersRequired)
		throw new cException("XPST0017"
//->Debug
				, "Function " + sName + "() must have " + (nParametersRequired == nParametersLength ? "exactly" : "at least") + ' ' + nParametersRequired + " argument" + (nParametersLength > 1 ? 's' : '')
//<-Debug
		);

	for (var nIndex = 0; nIndex < nArgumentsLength; nIndex++) {
		oParameter	= aParameters[nIndex];
		oArgument	= aArguments[nIndex];
		// Check sequence cardinality
		cSequence.assertSequenceCardinality(oArgument, oContext, oParameter[1]
//->Debug
				, aFunctionCall_numbers[nIndex] + " argument of " + sName + '()'
//<-Debug
		);
		// Check sequence items data types consistency
		cSequence.assertSequenceItemType(oArgument, oContext, oParameter[0]
//->Debug
				, aFunctionCall_numbers[nIndex] + " argument of " + sName + '()'
//<-Debug
		);
		if (oParameter[1] != '+' && oParameter[1] != '*')
			aArguments[nIndex]	= oArgument.length ? oArgument[0] : null;
	}
};

//
module.exports = cFunctionCall;
