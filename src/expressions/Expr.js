/*
 * XPath2.js - Pure JavaScript implementation of XPath 2.0 parser and evaluator
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 *
 *
 */

function cExpr() {
	this.items	= [];
};

cExpr.prototype.items	= null;

// Static members
cExpr.parse	= function(oLexer, oResolver) {
	//
	var oExpr	= new cExpr,
		oItem;
	do {
		if (oLexer.eof() ||!(oItem = cExprSingle.parse(oLexer, oResolver)))
			throw "Expr.parse: expected ExprSingle expression";
		oExpr.items.push(oItem);
	}
	while (oLexer.peek() == ',' && oLexer.next());
	//
	if (oLexer.peek(-1) == ',')
		throw "Expr.parse: Expected ExprSingle expression";

	//
	return oExpr;
};

// Public members
cExpr.prototype.evaluate	= function(oContext) {
	var aSequence	= new cXPath2Sequence;
	for (var nIndex = 0, nLength = this.items.length; nIndex < nLength; nIndex++)
		aSequence.add(this.items[nIndex].evaluate(oContext));
	return aSequence;
};