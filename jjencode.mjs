import Shift from 'shift-ast';
import parser from 'shift-parser'
import { refactor } from 'shift-refactor';
let parse = parser.parseScript;
function makeid(length,opts={}) {
	var result = [];
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + (!opts.nn && '0123456789') + (!opts.eo && 'АБЦДЕФГЧИЙКЛМНОПЯРСТУВЖХЫЗШЩЭЮЁЬЪабцдефгчийклмнопярстувжхызшщэюёьъ');
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() *
			charactersLength)));
	}
	return result.join('');
}
function splitRandom(s) {
	var pivot = Math.floor(Math.random() * s.length);
	var v = [];
	v[0] = s.substring(0, pivot);
	v[1] = s.substring(pivot);
	return v;
}
function ra(items){
	return items[Math.floor(Math.random() * items.length)];
}
function replaceRandomExpr(s) {
	return new Shift.CallExpression({ callee: new Shift.StaticMemberExpression({ object: s, property: "replace" }), arguments: [new Shift.LiteralStringExpression({ value: makeid(10) }), new Shift.LiteralStringExpression({ value: makeid(10) })] })
}
function parseExpr(s){
	return parseStmt(s).expression;
}
function parseStmt(s){
	return parse(s).statements[0];
}
function s2e(s){
	return new Shift.CallExpression({callee:new Shift.ArrowExpression({params: new Shift.FormalParameters({items: [],rest: null}),isAsync: false,body: new Shift.FunctionBody({directives: [],statements: s[0] ? s : [s]})}),arguments:[]});
}
export function jjencode(gv, text, level = 1, opts = {}) {
	if (level <= 0) return text;
	function dts(t) {
		let u = t;
		u = `try{${u};}finally{try{"${makeid(5)}";}finally{}}`;
		let ast = parse(u);
		let sess = refactor(ast);
		//try{	
			let stmts = [];
		let sa = (sess) => sess(":statement").append(_ => {
			let a = makeid(5,{nn: true});
			let b = makeid(5);
			return parseStmt(`let ${a} = "${b}";`)
		}).append(_ => {
			if(!opts.dce)return new Shift.BlockStatement({block: new Shift.Block({statements: []})});
			return new Shift.IfStatement({test: dl(new Shift.LiteralBooleanExpression({value: false})),consequent: ra(stmts),alternate: parseStmt(`eval("");`)});
		}).append(_ => {
			let [a,c] = [makeid(5,{nn: true}),makeid(5,{nn: true})];
			return Math.random() > 0.2 ? new Shift.BlockStatement({block: new Shift.Block({statements: []})}) : new Shift.ExpressionStatement({expression: s2e(parse(`let ${a} = Date.now();debugger;let ${c} = Date.now();n = n || (${c} - ${a}) > ${opts.timeout || 2000};`).statements)})
		})//(`let ${makeid(5)} = "${makeid(5)}";`);
		sess(":statement").forEach(n => stmts.push(n));
		sa(sess);
		sess("VariableDeclarator").forEach(n => (!opts.amitb_trigger || !opts.amitb_trigger.includes(n.name)) && sess("VariableDeclarator[name=\"" + n.name + "\"]").rename('_' + makeid(5).split('').join('_')));
		function dl(expr){
			if(!opts.dl)return expr;
			return new Shift.ConditionalExpression({consequent: expr,test: s2e(parse(`let a = document.location;return "${makeid(5)}" != "${makeid(5)} && a == eval("\"${opts.dl.replaceAll("\\","\\\\",'"',"\\\"")}\"")`).statements),alternate: new Shift.LiteralInfinityExpression({})});
		}
		function amitb(expr){
			if(!opts.amitb_trigger)return expr;
			if(!expr instanceof Shift.CallExpression)return expr;
			if(!expr.callee instanceof Shift.IdentifierExpression)return expr;
			if(!opts.amitb_trigger.includes(expr.callee.name))return expr;
			return s2e([parseStmt(`let a = Date.now()`),parseStmt('let b;'),new Shift.ExpressionStatement({expression: new Shift.AssignmentExpression({binding: new Shift.BindingIdentifier({name: 'b'}),expression: expr})}),parseStmt(`let c = Date.now()`),parseStmt(`n = n || (c - a) > ${opts.amitb_timeout}`),parseStmt(`return b;`)]);
		};
		function amh(expr){
			if(expr instanceof Shift.AssignmentExpression)return expr;
			if(expr instanceof Shift.StaticMemberExpression || expr instanceof Shift.ComputedMemberExpression)return expr;
			if(Math.random() > 0.2)return expr;
			if(expr instanceof Shift.ObjectExpression)return new Shift.CallExpression({callee: parseExpr(`x=>new Proxy(x,{get: (o,k) => n ? k : o[k]})`),arguments: [expr]});
			return new Shift.ConditionalExpression({test: parseExpr('!n'),alternate: parseExpr(`(() => {throw 0;})()`),consequent: expr})
		}
		function splitString(v){
			if(!v)return v;
			let [a, b] = splitRandom(v);
			let [fa,fb] =[Math.random() > 0.03 ? Math.random() > 0.1 ? x => x : x => splitString(x.value) : onLitString,Math.random() > 0.03 ? Math.random() > 0.1 ? x => x : x => splitString(x.value) : onLitString];
			if(!a.length)fa = x => x;
			if(!b.length)fb = x => x;
			return dl(new Shift.ConditionalExpression({consequent: new Shift.BinaryExpression({
				operator: "+",
				left: replaceRandomExpr(fa(new Shift.LiteralStringExpression({ value: a }))),
				right: replaceRandomExpr(fb(new Shift.LiteralStringExpression({ value: b })))
			}),test: s2e(new Shift.ReturnStatement({expression: parseExpr('true')})),alternate: new Shift.LiteralStringExpression({value: makeid(5)})}));
		}
		function onLitString(n){
			let v = `"${n.value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"").replaceAll("\n", "\\n")}"`;
			return new Shift.CallExpression({
				arguments: [
					splitString(v)
					], callee: dl(new Shift.IdentifierExpression({ name: 'eval' }))
			});
		}
		sess("LiteralStringExpression").replace(n => {
			return onLitString(n);
		});
		sess("StaticMemberExpression").replace(n=>new Shift.ComputedMemberExpression({object: n.object,expression: onLitString(new Shift.LiteralStringExpression({value: n.property}))}));
		sa(sess);
		sess(":expression").replace(amh);
		sess("Script > :statement").first().prepend(`let n=false;`);
		sess(":expression").replace(amitb);
		sess("VariableDeclarator").forEach(n => sess("VariableDeclarator[name=\"" + n.name + "\"]").rename('_' + makeid(5).split('').join('_')));
		u = sess.print();
		//}catch(err){};
		u = u.replaceAll("\n", ";").replaceAll("\t"," ").replaceAll("  "," ");
		return u;
	}
	text = dts(text);
	var r = "";
	var n;
	var t;
	var b = ["___", "__$", "_$_", "_$$", "$__", "$_$", "$$_", "$$$", "$___", "$__$", "$_$_", "$_$$", "$$__", "$$_$", "$$$_", "$$$$",];
	var s = "";
	function cls(f2) {
		if (s) {
			let i1 = makeid(5);
			let i2 = makeid(5);
			let t1 = makeid(1);
			let t2 = makeid(1);
			let t = s.replaceAll(t1, t1 + i1).replaceAll(t2, t2 + i2);
			let i3 = makeid(5);
			let t3 = makeid(1);
			t = t.replaceAll(t3, t3 + i3);
			if (s) r += `"${t}".replace(/${i1}/g,"").replace(/${i2}/g,"").replace(/${i3}/g,"")+`;
		};
		var v = f2();
		s = "";
		return v;
	}
	/*
	for( var i = 0; i < text.length; i++ ){
		n = text.charCodeAt( i );
		if( n == 0x22 || n == 0x5c ){
			s += "\\\\\\" + text.charAt( i ).toString(16);
		}else if( (0x21 <= n && n <= 0x2f) || (0x3A <= n && n <= 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) && (text.charAt(i+1) != 'u')){
		//}else if( (0x20 <= n && n <= 0x2f) || (0x3A <= n == 0x40) || ( 0x5b <= n && n <= 0x60 ) || ( 0x7b <= n && n <= 0x7f ) ){
			s += `\\"+String.fromCharCode(Math.sqrt(${n * n}))+\\"`
		}else if(text.charAt(i) === ';'){
			s += ';';
		}else if( (0x30 <= n && n <= 0x39 ) || (0x61 <= n && n <= 0x66 ) ){
			cls(() => r += "(() => " + gv + "." + b[ n < 0x40 ? n - 0x30 : n - 0x57 ] + ")()+");
		}else if( n == 0x6c ){ // 'l'
			cls(() => r += "(![]+\"\")[" + gv + "._$_]+");
		}else if( n == 0x6f ){ // 'o'
			cls(() => r += gv + "._$+");
		}else if( n == 0x74 ){ // 'u'
			cls(() =>r += gv + ".__+");
		}else if( n == 0x75 ){ // 'u'
			cls(() => r += gv + "._+");
		}else if( n < 128 ){
			if( s ) r += "\"" + s;
			else r += "\"";
			r += "\\\\\"+" + n.toString( 8 ).replace( /[0-7]/g, function(c){ return gv + "."+b[ c ]+"+" } );
			s = "";
		}else{
			if( s ) r += "\"" + s;
			else r += "\"";
			r += "\\\\\"+" + gv + "._+" + n.toString(16).replace( /[0-9a-f]/gi, function(c){ return gv + "."+b[parseInt(c,16)]+"+"} );
			s = "";
		}
	}
	if( s ) r += "\"" + s + "\"+";

	r = dts(
	'(() => {' +
	'var ' + gv + "=~[];" + 
	gv + "={___:++" + gv +",$$$$:(![]+\"\")["+gv+"],__$:++"+gv+",$_$_:(![]+\"\")["+gv+"],_$_:++"+
	gv+",$_$$:({}+\"\")["+gv+"],$$_$:("+gv+"["+gv+"]+\"\")["+gv+"],_$$:++"+gv+",$$$_:(!\"\"+\"\")["+
	gv+"],$__:++"+gv+",$_$:++"+gv+",$$__:({}+\"\")["+gv+"],$$_:++"+gv+",$$$:++"+gv+",$___:++"+gv+",$__$:++"+gv+"};"+
	gv+".$_="+
	"("+gv+".$_="+gv+"+\"\")["+gv+".$_$]+"+
	"("+gv+"._$="+gv+".$_["+gv+".__$])+"+
	"("+gv+".$$=("+gv+".$+\"\")["+gv+".__$])+"+
	"((!"+gv+")+\"\")["+gv+"._$$]+"+
	"("+gv+".__="+gv+".$_["+gv+".$$_])+"+
	"("+gv+".$=(!\"\"+\"\")["+gv+".__$])+"+
	"("+gv+"._=(!\"\"+\"\")["+gv+"._$_])+"+
	gv+".$_["+gv+".$_$]+"+
	gv+".__+"+
	gv+"._$+"+
	gv+".$;"+
	gv+".$$="+
	gv+".$+"+
	"(!\"\"+\"\")["+gv+"._$$]+"+
	gv+".__+"+
	gv+"._+"+
	gv+".$+"+
	gv+".$$;"+
	gv+".$=("+gv+".___)["+gv+".$_]["+gv+".$_];"+
	'return '+gv+".$("+gv+".$("+gv+".$$+\"\\\"\"+" + r + "\"\\\"\")())();})()");
*/
	r = text;

	for (let i = 0; i < 3; i++) {
		let id1 = makeid(5);
		let id2 = makeid(5);
		r = dts(`let _ = "${((opts.deno ? `data:text/javascript;charset=utf-8,`: '') + r).split('').reverse().join('').replaceAll("\\", "\\\\").replaceAll("\"", "\\\"").replaceAll("\n", "\\n").replaceAll("noitcnuf nruter", "!a)").replaceAll("romCh", "!b)").replaceAll("ecalper", "!d)").replaceAll(")", ")" + id1).replaceAll("}", "}" + id2)}".replaceAll("${id1}","").replaceAll("${id2}","").replaceAll("!d)","ecalper").replaceAll("!b)","romCh").replaceAll("!a)","noitcnuf nruter").split('').reverse().join('');${opts.deno ? 'await import' : 'eval'}(_)`);
	};
	return jjencode(gv + '_next', r, level - 1, opts);
}
