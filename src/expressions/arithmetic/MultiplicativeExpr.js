/*
 * XPath.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2016 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

var fFunction_sequence_atomize = require('./../../functions/sequence').atomize;
var fFunction_sequence_assertSequenceCardinality = require('./../../functions/sequence').assertSequenceCardinality;

var cUnionExpr = require('./../sequence/UnionExpr');

var cException = require('./../../classes/Exception');

var cStaticContext = require('./../../classes/StaticContext');

var cXSUntypedAtomic = require('./../../types/schema/simple/atomic/XSUntypedAtomic');
var cXSYearMonthDuration = require('./../../types/schema/simple/atomic/duration/XSYearMonthDuration');
var cXSDayTimeDuration = require('./../../types/schema/simple/atomic/duration/XSDayTimeDuration');
var cXSAnyAtomicType = require('./../../types/schema/simple/XSAnyAtomicType');

//
var hStaticContext_operators = cStaticContext.operators;

function cMultiplicativeExpr(oExpr) {
	this.left	= oExpr;
	this.items	= [];
};

cMultiplicativeExpr.prototype.left	= null;
cMultiplicativeExpr.prototype.items	= null;

//
cMultiplicativeExpr.operators	= {};
cMultiplicativeExpr.operators['*']		= function (oLeft, oRight, oContext) {
	var sOperator	= '',
		bReverse	= false;

	if (cXSAnyAtomicType.isNumeric(oLeft)) {
		if (cXSAnyAtomicType.isNumeric(oRight))
			sOperator	= "numeric-multiply";
		else
		if (oRight instanceof cXSYearMonthDuration) {
			sOperator	= "multiply-yearMonthDuration";
			bReverse	= true;
		}
		else
		if (oRight instanceof cXSDayTimeDuration) {
			sOperator	= "multiply-dayTimeDuration";
			bReverse	= true;
		}
	}
	else {
		if (oLeft instanceof cXSYearMonthDuration) {
			if (cXSAnyAtomicType.isNumeric(oRight))
				sOperator	= "multiply-yearMonthDuration";
		}
		else
		if (oLeft instanceof cXSDayTimeDuration) {
			if (cXSAnyAtomicType.isNumeric(oRight))
				sOperator	= "multiply-dayTimeDuration";
		}
	}

	// Call operator function
	if (sOperator)
		return hStaticContext_operators[sOperator].call(oContext, bReverse ? oRight : oLeft, bReverse ? oLeft : oRight);

	//
	throw new cException("XPTY0004"
//->Debug
			, "Arithmetic operator is not defined for provided arguments"
//<-Debug
	);	// Arithmetic operator is not defined for arguments of types ({type1}, {type2})
};
cMultiplicativeExpr.operators['div']	= function (oLeft, oRight, oContext) {
	var sOperator	= '';

	if (cXSAnyAtomicType.isNumeric(oLeft)) {
		if (cXSAnyAtomicType.isNumeric(oRight))
			sOperator	= "numeric-divide";
	}
	else
	if (oLeft instanceof cXSYearMonthDuration) {
		if (cXSAnyAtomicType.isNumeric(oRight))
			sOperator	= "divide-yearMonthDuration";
		else
		if (oRight instanceof cXSYearMonthDuration)
			sOperator	= "divide-yearMonthDuration-by-yearMonthDuration";
	}
	else
	if (oLeft instanceof cXSDayTimeDuration) {
		if (cXSAnyAtomicType.isNumeric(oRight))
			sOperator	= "divide-dayTimeDuration";
		else
		if (oRight instanceof cXSDayTimeDuration)
			sOperator	= "divide-dayTimeDuration-by-dayTimeDuration";
	}
	// Call operator function
	if (sOperator)
		return hStaticContext_operators[sOperator].call(oContext, oLeft, oRight);

	//
	throw new cException("XPTY0004"
//->Debug
			, "Arithmetic operator is not defined for provided arguments"
//<-Debug
	);	// Arithmetic operator is not defined for arguments of types ({type1}, {type2})
};
cMultiplicativeExpr.operators['idiv']	= function (oLeft, oRight, oContext) {
	if (cXSAnyAtomicType.isNumeric(oLeft) && cXSAnyAtomicType.isNumeric(oRight))
		return hStaticContext_operators["numeric-integer-divide"].call(oContext, oLeft, oRight);
	//
	throw new cException("XPTY0004"
//->Debug
			, "Arithmetic operator is not defined for provided arguments"
//<-Debug
	);	// Arithmetic operator is not defined for arguments of types ({type1}, {type2})
};
cMultiplicativeExpr.operators['mod']	= function (oLeft, oRight, oContext) {
	if (cXSAnyAtomicType.isNumeric(oLeft) && cXSAnyAtomicType.isNumeric(oRight))
		return hStaticContext_operators["numeric-mod"].call(oContext, oLeft, oRight);
	//
	throw new cException("XPTY0004"
//->Debug
			, "Arithmetic operator is not defined for provided arguments"
//<-Debug
	);	// Arithmetic operator is not defined for arguments of types ({type1}, {type2})
};

// Public members
cMultiplicativeExpr.prototype.evaluate	= function (oContext) {
	var oLeft	= fFunction_sequence_atomize(this.left.evaluate(oContext), oContext);

	//
	if (!oLeft.length)
		return [];
	// Assert cardinality
 	fFunction_sequence_assertSequenceCardinality(oLeft, oContext, '?'
//->Debug
 			, "first operand of '" + this.items[0][0] + "'"
//<-Debug
 	);

	var vLeft	= oLeft[0];
	if (vLeft instanceof cXSUntypedAtomic)
		vLeft	= cXSDouble.cast(vLeft);	// cast to xs:double

	for (var nIndex = 0, nLength = this.items.length, oRight, vRight; nIndex < nLength; nIndex++) {
		oRight	= fFunction_sequence_atomize(this.items[nIndex][1].evaluate(oContext), oContext);

		if (!oRight.length)
			return [];
		// Assert cardinality
 		fFunction_sequence_assertSequenceCardinality(oRight, oContext, '?'
//->Debug
 				, "second operand of '" + this.items[nIndex][0] + "'"
//<-Debug
 		);

		vRight	= oRight[0];
		if (vRight instanceof cXSUntypedAtomic)
			vRight	= cXSDouble.cast(vRight);	// cast to xs:double

		vLeft	= cMultiplicativeExpr.operators[this.items[nIndex][0]](vLeft, vRight, oContext);
	}
	return [vLeft];
};

//
module.exports = cMultiplicativeExpr;
