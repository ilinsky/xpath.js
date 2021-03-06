var cException = require('./../classes/Exception');
var cSequence = require('./../classes/Sequence');
var cStaticContext = require('./../classes/StaticContext');

var cXSBoolean = require('./../types/schema/simple/atomic/XSBoolean');
var cXSString = require('./../types/schema/simple/atomic/XSString');
var cXSDouble = require('./../types/schema/simple/atomic/XSDouble');
var cXSAnyURI = require('./../types/schema/simple/atomic/XSAnyURI');

var nNaN = global.NaN;

/*
	14 Functions and Operators on Nodes
		name
		local-name
		namespace-uri
		number
		lang
		root
*/

var exports = {};

// 14 Functions on Nodes
// fn:name() as xs:string
exports.name = function(oNode) {
	if (!arguments.length) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "name() function called when the context item is not a node"
//<-Debug
			);
		oNode	= this.item;
	}
	else
	if (oNode == null)
		return new cXSString('');
	//
	var vValue	= cStaticContext.functions["node-name"].call(this, oNode);
	return new cXSString(vValue == null ? '' : vValue.toString());
};

// fn:local-name() as xs:string
// fn:local-name($arg as node()?) as xs:string
exports.localName = function(oNode) {
	if (!arguments.length) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "local-name() function called when the context item is not a node"
//<-Debug
			);
		oNode	= this.item;
	}
	else
	if (oNode == null)
		return new cXSString('');
	//
	return new cXSString(this.DOMAdapter.getProperty(oNode, "localName") || '');
};

// fn:namespace-uri() as xs:anyURI
// fn:namespace-uri($arg as node()?) as xs:anyURI
exports.namespaceUri = function(oNode) {
	if (!arguments.length) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "namespace-uri() function called when the context item is not a node"
//<-Debug
			);
		oNode	= this.item;
	}
	else
	if (oNode == null)
		return cXSAnyURI.cast(new cXSString(''));
	//
	return cXSAnyURI.cast(new cXSString(this.DOMAdapter.getProperty(oNode, "namespaceURI") || ''));
};

// fn:number() as xs:double
// fn:number($arg as xs:anyAtomicType?) as xs:double
exports.number = function(/*[*/oItem/*]*/) {
	if (!arguments.length) {
		if (!this.item)
			throw new cException("XPDY0002");
		oItem	= cSequence.atomize([this.item], this)[0];
	}

	// If input item cannot be cast to xs:decimal, a NaN should be returned
	var vValue	= new cXSDouble(nNaN);
	if (oItem != null) {
/* eslint-disable no-empty */
		try {
			vValue	= cXSDouble.cast(oItem);
		}
		catch (e) {

		}
/* eslint-enable no-empty */
	}
	return vValue;
};

// fn:lang($testlang as xs:string?) as xs:boolean
// fn:lang($testlang as xs:string?, $node as node()) as xs:boolean
exports.lang = function(sLang, oNode) {
	if (arguments.length < 2) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "lang() function called when the context item is not a node"
//<-Debug
			);
		oNode	= this.item;
	}

	var fGetProperty	= this.DOMAdapter.getProperty;
	if (fGetProperty(oNode, "nodeType") == 2)
		oNode	= fGetProperty(oNode, "ownerElement");

	// walk up the tree looking for xml:lang attribute
	for (var aAttributes; oNode; oNode = fGetProperty(oNode, "parentNode"))
		if (aAttributes = fGetProperty(oNode, "attributes"))
			for (var nIndex = 0, nLength = aAttributes.length; nIndex < nLength; nIndex++)
				if (fGetProperty(aAttributes[nIndex], "nodeName") == "xml:lang")
					return new cXSBoolean(fGetProperty(aAttributes[nIndex], "value").replace(/-.+/, '').toLowerCase() == sLang.valueOf().replace(/-.+/, '').toLowerCase());
	//
	return new cXSBoolean(false);
};

// fn:root() as node()
// fn:root($arg as node()?) as node()?
exports.root = function(oNode) {
	if (!arguments.length) {
		if (!this.DOMAdapter.isNode(this.item))
			throw new cException("XPTY0004"
//->Debug
					, "root() function called when the context item is not a node"
//<-Debug
			);
		oNode	= this.item;
	}
	else
	if (oNode == null)
		return null;

	var fGetProperty	= this.DOMAdapter.getProperty;

	// If context node is Attribute
	if (fGetProperty(oNode, "nodeType") == 2)
		oNode	= fGetProperty(oNode, "ownerElement");

	for (var oParent = oNode; oParent; oParent = fGetProperty(oNode, "parentNode"))
		oNode	= oParent;

	return oNode;
};

module.exports = exports;