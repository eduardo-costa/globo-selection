(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	console.log("ParedaoVoter> Init.");
	globo_model_ParedaoServerModel.LoadConfig();
	console.log("Process> Starting Daemon @ " + globo_model_ParedaoServerModel.port);
	Main.http = nws_net_HTTPServiceManager.Create(globo_model_ParedaoServerModel.port);
	Main.http.verbose = 0;
	var _g = 0;
	var _g1 = nodejs_NodeJS.get_process().argv;
	while(_g < _g1.length) {
		var a = _g1[_g];
		++_g;
		if(a.indexOf("-v") >= 0) Main.http.verbose = a.length - 1;
	}
	Main.http.Add("/paredao/list/",globo_services_ParedaoList);
	Main.http.Add("/paredao/create/",globo_services_ParedaoCreate);
	Main.http.Add("/paredao/delete/",globo_services_ParedaoDelete);
	Main.http.Add("/paredao/vote/",globo_services_ParedaoVote);
	console.log("Process> Verbose Level [" + Main.http.verbose + "]");
	nodejs_NodeJS.get_process().on(nodejs_ProcessEventType.Exception,Main.OnError);
};
Main.OnError = function(p_error) {
	console.log("Process> [error] Uncaught[" + Std.string(p_error) + "]");
};
Math.__name__ = ["Math"];
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var globo_model_ParedaoServerModel = function() { };
globo_model_ParedaoServerModel.__name__ = ["globo","model","ParedaoServerModel"];
globo_model_ParedaoServerModel.GetRecaptchaSecret = function(p_is_online) {
	if(p_is_online) return "6LfoAAcTAAAAACvCsIcJ7RT2wsBKL8LQesfKErd8";
	return "6LfM4fwSAAAAALKHyL_TnNOHs-f-Gce51YWYUnZq";
};
globo_model_ParedaoServerModel.LoadConfig = function() {
	var mdl = { };
	var str = "";
	try {
		str = (require('fs')).readFileSync("./config.json");
	} catch( p_err ) {
		if (p_err instanceof js__$Boot_HaxeError) p_err = p_err.val;
		if( js_Boot.__instanceof(p_err,Error) ) {
			str = "";
		} else throw(p_err);
	}
	if(str == "") {
		console.log("ParedaoModel> config.json not found.");
		return;
	} else {
		console.log("ParedaoModel> config.json found.");
		mdl = JSON.parse(str);
	}
	if(mdl.port != null) globo_model_ParedaoServerModel.port = mdl.port;
	if(mdl.mongoURL != null) globo_model_ParedaoServerModel.mongoURL = mdl.mongoURL;
};
var nws_service_BaseService = function(p_server) {
	this.manager = p_server;
	this.session = new nws_service_ServiceSession();
	this.content = "text/plain";
	this.origin = "*";
	this.code = 200;
	this.enabled = true;
	this.persistent = false;
};
nws_service_BaseService.__name__ = ["nws","service","BaseService"];
nws_service_BaseService.prototype = {
	Initialize: function() {
		this.OnInitialize();
		this.session.response.setHeader("Access-Control-Allow-Origin",this.origin);
		this.session.response.setHeader("Content-Type",this.content);
	}
	,OnInitialize: function() {
	}
	,OnExecute: function() {
		this.session.response.end();
	}
	,Close: function() {
		this.session.response.end();
	}
	,OnError: function(p_error) {
	}
	,__class__: nws_service_BaseService
};
var nws_service_MongoService = function(p_server) {
	nws_service_BaseService.call(this,p_server);
};
nws_service_MongoService.__name__ = ["nws","service","MongoService"];
nws_service_MongoService.__super__ = nws_service_BaseService;
nws_service_MongoService.prototype = $extend(nws_service_BaseService.prototype,{
	get_database: function() {
		return nws_service_MongoService.db;
	}
	,OnInitialize: function() {
		this.persistent = true;
	}
	,OnExecute: function() {
		if(nws_service_MongoService.db == null) (require('mongodb').MongoClient).connect(this.url,$bind(this,this.OnMongoConnect)); else this.OnMongoReady();
	}
	,OnMongoReady: function() {
	}
	,OnMongoConnect: function(p_err,p_db) {
		if(p_err != null) this.OnError(p_err); else {
			console.log("MongoService> DB Connected!");
			nws_service_MongoService.db = p_db;
			this.OnMongoReady();
		}
	}
	,OnError: function(p_error) {
		var tn = Type.getClassName(js_Boot.getClass(this));
		var tl = tn.split(".");
		console.log(tl[tl.length - 1] + "> " + Std.string(p_error));
	}
	,__class__: nws_service_MongoService
});
var globo_services_ParedaoMongoService = function(p_server) {
	nws_service_MongoService.call(this,p_server);
};
globo_services_ParedaoMongoService.__name__ = ["globo","services","ParedaoMongoService"];
globo_services_ParedaoMongoService.__super__ = nws_service_MongoService;
globo_services_ParedaoMongoService.prototype = $extend(nws_service_MongoService.prototype,{
	OnInitialize: function() {
		nws_service_MongoService.prototype.OnInitialize.call(this);
		this.url = globo_model_ParedaoServerModel.mongoURL;
	}
	,GetVPH: function(p_list) {
		if(p_list.length <= 1) return 0;
		var count = 0;
		var vph = 0;
		var elapsed = p_list[p_list.length - 1].date - p_list[0].date;
		var ms_hour = 3600000.;
		elapsed = elapsed / ms_hour;
		return Math.floor(p_list.length / elapsed);
	}
	,GetRemainTime: function(p_paredao) {
		var pm = p_paredao;
		var dt0;
		var d = new Date();
		d.setTime(pm.start);
		dt0 = d;
		var dt1 = new Date();
		var diff = dt1 - dt0;
		var dur = pm.duration * 60.0 * 60.0 * 1000.0;
		return Math.max(0,Math.floor((dur - diff) * 0.001));
	}
	,__class__: globo_services_ParedaoMongoService
});
var globo_services_ParedaoCreate = function(p_server) {
	globo_services_ParedaoMongoService.call(this,p_server);
};
globo_services_ParedaoCreate.__name__ = ["globo","services","ParedaoCreate"];
globo_services_ParedaoCreate.__super__ = globo_services_ParedaoMongoService;
globo_services_ParedaoCreate.prototype = $extend(globo_services_ParedaoMongoService.prototype,{
	OnMongoReady: function() {
		this.get_database().collection("events",$bind(this,this.OnEventsLoad));
	}
	,OnEventsLoad: function(p_err,p_collection) {
		if(p_err != null) {
			this.session.response.write("false");
			this.session.response.end();
			this.OnError(p_err);
			return;
		}
		var c = this.paredoes = p_collection;
		var res = "true";
		var d = JSON.parse(this.session.data.json);
		var pd = { };
		pd.name1 = d.name1;
		pd.name2 = d.name2;
		pd.votes0 = [];
		pd.votes1 = [];
		pd.start = new Date().getTime();
		pd.duration = d.duration;
		try {
			this.paredoes.insert(pd);
		} catch( c_err ) {
			if (c_err instanceof js__$Boot_HaxeError) c_err = c_err.val;
			if( js_Boot.__instanceof(c_err,Error) ) {
				console.log("ParedaoCreate> " + Std.string(c_err));
				res = "false";
			} else throw(c_err);
		}
		console.log("ParedaoCreate> Inserting [" + pd.name1 + "," + pd.name2 + "] res[" + res + "]");
		this.session.response.write(res);
		this.session.response.end();
	}
	,__class__: globo_services_ParedaoCreate
});
var globo_services_ParedaoDelete = function(p_server) {
	globo_services_ParedaoMongoService.call(this,p_server);
};
globo_services_ParedaoDelete.__name__ = ["globo","services","ParedaoDelete"];
globo_services_ParedaoDelete.__super__ = globo_services_ParedaoMongoService;
globo_services_ParedaoDelete.prototype = $extend(globo_services_ParedaoMongoService.prototype,{
	OnMongoReady: function() {
		this.get_database().collection("events",$bind(this,this.OnEventsLoad));
	}
	,OnEventsLoad: function(p_err,p_collection) {
		if(p_err != null) {
			this.session.response.write("false");
			this.session.response.end();
			this.OnError(p_err);
			return;
		}
		var c = this.paredoes = p_collection;
		var res = "true";
		var d = JSON.parse(this.session.data.json);
		var oid = new require('mongodb').ObjectID(d.id);
		try {
			this.paredoes.remove({ '_id' : oid});
		} catch( c_err ) {
			if (c_err instanceof js__$Boot_HaxeError) c_err = c_err.val;
			if( js_Boot.__instanceof(c_err,Error) ) {
				console.log("ParedaoDelete> OnEventsLoad " + Std.string(c_err));
				res = "false";
			} else throw(c_err);
		}
		console.log("ParedaoCreate> Removing [" + Std.string(d.id) + "] res[" + res + "]");
		this.session.response.write(res);
		this.session.response.end();
	}
	,__class__: globo_services_ParedaoDelete
});
var globo_services_ParedaoList = function(p_server) {
	globo_services_ParedaoMongoService.call(this,p_server);
};
globo_services_ParedaoList.__name__ = ["globo","services","ParedaoList"];
globo_services_ParedaoList.__super__ = globo_services_ParedaoMongoService;
globo_services_ParedaoList.prototype = $extend(globo_services_ParedaoMongoService.prototype,{
	OnMongoReady: function() {
		this.get_database().collection("events",$bind(this,this.OnListReady));
	}
	,OnListReady: function(p_err,p_collection) {
		if(p_err != null) {
			this.OnError(p_err);
			return;
		}
		if(this.session.data != null) {
			var d = JSON.parse(this.session.data.json);
			var oid = null;
			console.log("ParedaoList> Find by Id [" + Std.string(d.id) + "]");
			console.log("ParedaoList> Payload");
			console.log(d);
			try {
				oid = new require('mongodb').ObjectID(d.id);
			} catch( err ) {
				if (err instanceof js__$Boot_HaxeError) err = err.val;
				if( js_Boot.__instanceof(err,Error) ) {
					this.session.response.write(JSON.stringify("[]"));
					this.session.response.end();
					this.OnError(err);
					return;
				} else throw(err);
			}
			p_collection.find({ _id : oid}).toArray($bind(this,this.OnListRead));
		} else p_collection.find().toArray($bind(this,this.OnListRead));
	}
	,OnListRead: function(p_err,p_list) {
		if(p_err != null) {
			this.OnError(p_err);
			return;
		}
		var res = [];
		var _g = 0;
		while(_g < p_list.length) {
			var it = p_list[_g];
			++_g;
			var pm = it;
			var d = { };
			d.name1 = pm.name1;
			d.name2 = pm.name2;
			d.votes0 = pm.votes0.length;
			d.votes1 = pm.votes1.length;
			d.vph1 = this.GetVPH(pm.votes0);
			d.vph2 = this.GetVPH(pm.votes1);
			d.start = pm.start;
			d.remain = this.GetRemainTime(pm);
			d.current = new Date().getTime();
			d.id = it._id;
			res.push(d);
		}
		this.session.response.write(JSON.stringify(res));
		this.session.response.end();
	}
	,__class__: globo_services_ParedaoList
});
var globo_services_ParedaoVote = function(p_server) {
	globo_services_ParedaoMongoService.call(this,p_server);
};
globo_services_ParedaoVote.__name__ = ["globo","services","ParedaoVote"];
globo_services_ParedaoVote.__super__ = globo_services_ParedaoMongoService;
globo_services_ParedaoVote.prototype = $extend(globo_services_ParedaoMongoService.prototype,{
	OnMongoReady: function() {
		this.get_database().collection("events",$bind(this,this.OnEventsLoad));
	}
	,OnEventsLoad: function(p_err,p_collection) {
		var _g = this;
		if(p_err != null) {
			this.session.response.write("false");
			this.session.response.end();
			this.OnError(p_err);
			return;
		}
		if(this.session.data != null) {
			var d = JSON.parse(this.session.data.json);
			var oid = null;
			console.log("ParedaoVote> Adding Vote to [" + Std.string(d.id) + "]");
			console.log("ParedaoVote> Payload");
			console.log(d);
			try {
				oid = new require('mongodb').ObjectID(d.id);
			} catch( err ) {
				if (err instanceof js__$Boot_HaxeError) err = err.val;
				if( js_Boot.__instanceof(err,Error) ) {
					this.OnError(err);
					this.session.response.write("false");
					this.session.response.end();
					return;
				} else throw(err);
			}
			p_collection.find({ _id : oid}).toArray(function(f_err,p_list) {
				if(f_err != null) {
					_g.OnError(p_err);
					return;
				}
				if(p_list.length <= 0) {
					_g.session.response.write("false");
					_g.session.response.end();
					return;
				}
				var d1 = JSON.parse(_g.session.data.json);
				var vote_id = d1.vote;
				var captcha_response = d1.response;
				var captcha_id = d1.captcha;
				var recaptcha_data = { };
				recaptcha_data.secret = globo_model_ParedaoServerModel.GetRecaptchaSecret(d1.online);
				recaptcha_data.response = captcha_response;
				var req_data = { url : globo_model_ParedaoServerModel.recapcthaURL, form : recaptcha_data};
				console.log("ParedaoVote> vote_id[" + vote_id + "] captcha[" + captcha_id + "] captcha-response[" + captcha_response + "]");
				(require('request')).post(req_data,function(p_req_err,p_response,p_body) {
					if(p_req_err != null) {
						console.log("ParedaoVote> Recaptcha Error");
						console.log(p_req_err);
						_g.session.response.write("false");
						_g.session.response.end();
						return;
					}
					console.log("ParedaoVote> Recaptcha result");
					console.log("Status: " + Std.string(p_response.statusCode));
					if(p_response.statusCode == 200) {
						var result = JSON.parse(p_body);
						console.log(result);
						if(result.success) _g.WriteVote(p_collection,vote_id,p_list[0],oid); else {
							_g.session.response.write("false");
							_g.session.response.end();
						}
					}
				});
			});
		} else {
			this.session.response.write("false");
			this.session.response.end();
		}
	}
	,WriteVote: function(p_collection,p_vote_id,p_paredao,p_paredao_id) {
		var pm = p_paredao;
		var oid = new require('mongodb').ObjectID(pm._id);
		var vd = { };
		vd.date = new Date().getTime();
		vd.from = this.session.request.socket.remoteAddress + ":" + this.session.request.socket.remotePort;
		vd.to = p_vote_id;
		var remain = this.GetRemainTime(pm);
		if(remain <= 0) {
			this.session.response.write("false");
			this.session.response.end();
			return;
		}
		if(p_vote_id == 1) pm.votes0.push(vd); else if(p_vote_id == 2) pm.votes1.push(vd);
		p_collection.update({ _id : p_paredao_id},pm);
		this.session.response.write("true");
		this.session.response.end();
	}
	,__class__: globo_services_ParedaoVote
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,__class__: haxe_ds_StringMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var nodejs_NodeJS = function() { };
nodejs_NodeJS.__name__ = ["nodejs","NodeJS"];
nodejs_NodeJS.get_dirname = function() {
	return __dirname;
};
nodejs_NodeJS.get_filename = function() {
	return __filename;
};
nodejs_NodeJS.require = function(p_lib) {
	return require(p_lib);
};
nodejs_NodeJS.get_process = function() {
	return process;
};
nodejs_NodeJS.setTimeout = function(cb,ms) {
	return setTimeout(cb,ms);
};
nodejs_NodeJS.clearTimeout = function(t) {
	clearTimeout(t);
	return;
};
nodejs_NodeJS.setInterval = function(cb,ms) {
	return setInterval(cb,ms);
};
nodejs_NodeJS.clearInterval = function(t) {
	clearInterval(t);
	return;
};
nodejs_NodeJS.assert = function(value,message) {
	require('assert')(value,message);
};
nodejs_NodeJS.get_global = function() {
	return global;
};
nodejs_NodeJS.resolve = function() {
	return require.resolve();
};
nodejs_NodeJS.get_cache = function() {
	return require.cache;
};
nodejs_NodeJS.get_extensions = function() {
	return require.extensions;
};
nodejs_NodeJS.get_module = function() {
	return module;
};
nodejs_NodeJS.get_exports = function() {
	return exports;
};
nodejs_NodeJS.get_domain = function() {
	return domain.create();
};
nodejs_NodeJS.get_repl = function() {
	return require('repl');
};
var nodejs_ProcessEventType = function() { };
nodejs_ProcessEventType.__name__ = ["nodejs","ProcessEventType"];
var nodejs_REPLEventType = function() { };
nodejs_REPLEventType.__name__ = ["nodejs","REPLEventType"];
var nodejs_crypto_CryptoAlgorithm = function() { };
nodejs_crypto_CryptoAlgorithm.__name__ = ["nodejs","crypto","CryptoAlgorithm"];
var nodejs_events_EventEmitterEventType = function() { };
nodejs_events_EventEmitterEventType.__name__ = ["nodejs","events","EventEmitterEventType"];
var nodejs_fs_FSWatcherEventType = function() { };
nodejs_fs_FSWatcherEventType.__name__ = ["nodejs","fs","FSWatcherEventType"];
var nodejs_fs_FileLinkType = function() { };
nodejs_fs_FileLinkType.__name__ = ["nodejs","fs","FileLinkType"];
var nodejs_fs_FileIOFlag = function() { };
nodejs_fs_FileIOFlag.__name__ = ["nodejs","fs","FileIOFlag"];
var nodejs_fs_ReadStreamEventType = function() { };
nodejs_fs_ReadStreamEventType.__name__ = ["nodejs","fs","ReadStreamEventType"];
var nodejs_fs_WriteStreamEventType = function() { };
nodejs_fs_WriteStreamEventType.__name__ = ["nodejs","fs","WriteStreamEventType"];
var nodejs_http_HTTPMethod = function() { };
nodejs_http_HTTPMethod.__name__ = ["nodejs","http","HTTPMethod"];
var nodejs_http_HTTPClientRequestEventType = function() { };
nodejs_http_HTTPClientRequestEventType.__name__ = ["nodejs","http","HTTPClientRequestEventType"];
var nodejs_http_HTTPServerEventType = function() { };
nodejs_http_HTTPServerEventType.__name__ = ["nodejs","http","HTTPServerEventType"];
var nodejs_stream_ReadableEventType = function() { };
nodejs_stream_ReadableEventType.__name__ = ["nodejs","stream","ReadableEventType"];
var nodejs_http_IncomingMessageEventType = function() { };
nodejs_http_IncomingMessageEventType.__name__ = ["nodejs","http","IncomingMessageEventType"];
nodejs_http_IncomingMessageEventType.__super__ = nodejs_stream_ReadableEventType;
nodejs_http_IncomingMessageEventType.prototype = $extend(nodejs_stream_ReadableEventType.prototype,{
	__class__: nodejs_http_IncomingMessageEventType
});
var nodejs_http_MultipartFormEventType = function() { };
nodejs_http_MultipartFormEventType.__name__ = ["nodejs","http","MultipartFormEventType"];
var nodejs_http_ServerResponseEventType = function() { };
nodejs_http_ServerResponseEventType.__name__ = ["nodejs","http","ServerResponseEventType"];
var nodejs_http_URL = function() { };
nodejs_http_URL.__name__ = ["nodejs","http","URL"];
nodejs_http_URL.get_url = function() {
	if(nodejs_http_URL.m_url == null) return nodejs_http_URL.m_url = nodejs_NodeJS.require("url"); else return nodejs_http_URL.m_url;
};
nodejs_http_URL.get_qs = function() {
	if(nodejs_http_URL.m_qs == null) return nodejs_http_URL.m_qs = nodejs_NodeJS.require("querystring"); else return nodejs_http_URL.m_qs;
};
nodejs_http_URL.get_mp = function() {
	if(nodejs_http_URL.m_mp == null) return nodejs_http_URL.m_mp = nodejs_NodeJS.require("multiparty"); else return nodejs_http_URL.m_mp;
};
nodejs_http_URL.Parse = function(p_url) {
	var d = nodejs_http_URL.get_url().parse(p_url);
	return d;
};
nodejs_http_URL.ParseQuery = function(p_query,p_separator,p_assigment,p_max_keys) {
	if(p_max_keys == null) p_max_keys = 1000;
	if(p_assigment == null) p_assigment = "=";
	if(p_separator == null) p_separator = "&";
	if(p_query == null) return { };
	if(p_query == "") return { };
	return nodejs_http_URL.get_qs().parse(p_query,p_separator,p_assigment,{ maxKeys : p_max_keys});
};
nodejs_http_URL.ToQuery = function(p_target,p_separator,p_assigment) {
	if(p_assigment == null) p_assigment = "=";
	if(p_separator == null) p_separator = "&";
	if(p_target == null) return "null";
	return nodejs_http_URL.get_qs().stringify(p_target,p_separator,p_assigment);
};
nodejs_http_URL.ParseMultipart = function(p_request,p_callback,p_options) {
	var opt;
	if(p_options == null) opt = { }; else opt = p_options;
	var multipart = nodejs_http_URL.get_mp();
	var options = opt;
	var f = new multipart.Form(opt);
	if(p_callback == null) try {
		f.parse(p_request);
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		if( js_Boot.__instanceof(e,Error) ) {
			console.log("URL> " + Std.string(e) + "\n\t" + e.stack);
		} else throw(e);
	} else try {
		f.parse(p_request,p_callback);
	} catch( e1 ) {
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
		console.log("!!! " + Std.string(e1));
	}
	return f;
};
nodejs_http_URL.Resolve = function(p_from,p_to) {
	return nodejs_http_URL.get_url().resolve(p_from,p_to);
};
var nodejs_mongodb_MongoAuthOption = function() {
	this.authMechanism = "MONGODB - CR";
};
nodejs_mongodb_MongoAuthOption.__name__ = ["nodejs","mongodb","MongoAuthOption"];
nodejs_mongodb_MongoAuthOption.prototype = {
	__class__: nodejs_mongodb_MongoAuthOption
};
var nodejs_net_TCPServerEventType = function() { };
nodejs_net_TCPServerEventType.__name__ = ["nodejs","net","TCPServerEventType"];
var nodejs_net_TCPSocketEventType = function() { };
nodejs_net_TCPSocketEventType.__name__ = ["nodejs","net","TCPSocketEventType"];
var nodejs_stream_WritableEventType = function() { };
nodejs_stream_WritableEventType.__name__ = ["nodejs","stream","WritableEventType"];
var nws_net_HTTPServiceManager = function() {
	this.defaultService = this.service = new nws_service_BaseService(this);
	this.m_services = new haxe_ds_StringMap();
	this.m_active = new haxe_ds_StringMap();
	this.server = (require('http')).createServer($bind(this,this.RequestHandler));
	this.server.on(nodejs_http_HTTPServerEventType.Connection,$bind(this,this.OnConnection));
	this.server.on(nodejs_http_HTTPServerEventType.Error,$bind(this,this.OnError));
	this.multipart = { };
	this.multipart.uploadDir = "uploads";
	this.verbose = 0;
};
nws_net_HTTPServiceManager.__name__ = ["nws","net","HTTPServiceManager"];
nws_net_HTTPServiceManager.Create = function(p_port) {
	if(p_port == null) p_port = 80;
	var s = new nws_net_HTTPServiceManager();
	s.Listen(p_port);
	return s;
};
nws_net_HTTPServiceManager.prototype = {
	Add: function(p_id,p_service_class) {
		this.m_services.set(p_id,p_service_class);
	}
	,Listen: function(p_port) {
		if(p_port == null) p_port = 80;
		this.Log("HTTP> Listening Port [" + p_port + "]");
		this.server.listen(p_port);
	}
	,RequestHandler: function(p_request,p_response) {
		this.request = p_request;
		this.response = p_response;
		this.method = p_request.method.toUpperCase();
		this.url = nodejs_http_URL.Parse(p_request.url);
		var service_id = this.url.pathname;
		var service_exists = this.m_services.exists(service_id);
		var service_active = this.m_active.exists(service_id);
		var service_alloc = true;
		this.Log("HTTP> RequestHandler url[" + this.request.url + "][" + this.method + "] id[" + service_id + "] exists[" + (service_exists == null?"null":"" + service_exists) + "] active[" + (service_active == null?"null":"" + service_active) + "] ip[" + this.request.socket.remoteAddress + ":" + this.request.socket.remotePort + "]",1);
		if(service_exists) {
			if(service_active) {
				this.service = this.m_active.get(service_id);
				service_alloc = !this.service.persistent;
			}
			if(service_alloc) {
				console.log("creating " + service_id);
				var c = this.m_services.get(service_id);
				this.service = Type.createInstance(c,[this]);
				this.m_active.set(service_id,this.service);
			}
		} else this.service = this.defaultService;
		this.service.session.request = this.request;
		this.service.session.response = this.response;
		this.service.session.method = this.method;
		this.service.session.url = this.url;
		this.service.Initialize();
		if(this.service.enabled) this.OnRequest(); else {
			this.Log("HTTP> RequestHandler service[" + service_id + "] disabled.",1);
			if(this.response != null) this.response.end();
		}
	}
	,OnRequest: function() {
		var _g1 = this;
		var _g = this.method;
		switch(_g) {
		case "GET":
			var d = null;
			if(this.url.query != null) d = nodejs_http_URL.ParseQuery(this.url.query);
			this.OnGETRequest(this.request,this.response,d);
			this.OnRequestComplete();
			break;
		case "POST":
			var content_type = this.request.headers["content-type"];
			if(content_type == null) content_type = "";
			if(content_type.toLowerCase().indexOf("multipart") >= 0) try {
				this.ProcessMultipart(this.request,this.response);
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				if( js_Boot.__instanceof(e,Error) ) {
					this.Log("HTTP> [error] OnRequest [" + Std.string(e) + "]");
					this.Log("\t" + e.stack,1);
					this.OnError(e);
				} else throw(e);
			} else {
				this.request.on(nodejs_http_IncomingMessageEventType.Data,function(data) {
					_g1.OnPOSTRequest(_g1.request,_g1.response,nodejs_http_URL.ParseQuery(data.toString()));
				});
				this.request.on(nodejs_http_IncomingMessageEventType.End,function() {
					_g1.OnRequestComplete();
				});
			}
			break;
		default:
			this.Log("HTTP> OnRequest Ignored method[" + this.method + "] url[" + this.request.url + "]",1);
			this.OnRequestComplete();
		}
	}
	,OnRequestComplete: function() {
		this.Log("HTTP> OnRequestComplete [" + Type.getClassName(Type.getClass(this.service)) + "] url[" + this.request.url + "]",1);
		this.service.session.data = this.data;
		this.service.OnExecute();
	}
	,OnPOSTRequest: function(p_request,p_response,p_data) {
		this.data = p_data;
	}
	,OnGETRequest: function(p_request,p_response,p_data) {
		this.data = p_data;
	}
	,ProcessMultipart: function(p_request,p_response) {
		var _g = this;
		this.Log("HTTP> ProcessMultipart",3);
		var d = { };
		var f = nodejs_http_URL.ParseMultipart(p_request,null,this.multipart);
		f.on(nodejs_http_MultipartFormEventType.Error,function(p_error) {
			_g.Log("HTTP> [error] ProcessMultiPart [" + Std.string(p_error) + "]");
			_g.OnError(p_error);
		});
		f.on(nodejs_http_MultipartFormEventType.Progress,function(l,t) {
			_g.Log("HTTP> Multipart Progress [" + l + "/" + t + "]",2);
		});
		f.on(nodejs_http_MultipartFormEventType.Field,function(p_key,p_value) {
			_g.Log("HTTP> \t" + p_key + " = " + p_value,3);
			d[p_key] = p_value;
		});
		f.on(nodejs_http_MultipartFormEventType.File,function(p_name,p_file) {
			_g.Log("HTTP> \t file[" + p_name + "]\n\t" + Std.string(p_file),3);
			d[p_name] = p_file;
		});
		f.on(nodejs_http_MultipartFormEventType.Close,function() {
			_g.OnPOSTRequest(p_request,p_response,d);
			_g.OnRequestComplete();
		});
	}
	,OnConnection: function(p_socket) {
		this.Log("HTTP> OnConnection ip[" + p_socket.remoteAddress + "]",2);
	}
	,OnError: function(p_error) {
		this.service.OnError(p_error);
		this.response.end();
	}
	,Log: function(p_message,p_level) {
		if(p_level == null) p_level = 0;
		if(p_level <= this.verbose) console.log(p_message);
	}
	,__class__: nws_net_HTTPServiceManager
};
var nws_service_ServiceSession = function() {
};
nws_service_ServiceSession.__name__ = ["nws","service","ServiceSession"];
nws_service_ServiceSession.prototype = {
	__class__: nws_service_ServiceSession
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
globo_model_ParedaoServerModel.port = 9000;
globo_model_ParedaoServerModel.mongoURL = "mongodb://52.24.71.71:2700/paredao";
globo_model_ParedaoServerModel.recapcthaURL = "https://www.google.com/recaptcha/api/siteverify";
js_Boot.__toStr = {}.toString;
nodejs_ProcessEventType.Exit = "exit";
nodejs_ProcessEventType.Exception = "uncaughtException";
nodejs_REPLEventType.Exit = "exit";
nodejs_crypto_CryptoAlgorithm.SHA1 = "sha1";
nodejs_crypto_CryptoAlgorithm.MD5 = "md5";
nodejs_crypto_CryptoAlgorithm.SHA256 = "sha256";
nodejs_crypto_CryptoAlgorithm.SHA512 = "sha512";
nodejs_events_EventEmitterEventType.NewListener = "newListener";
nodejs_events_EventEmitterEventType.RemoveListener = "removeListener";
nodejs_fs_FSWatcherEventType.Change = "change";
nodejs_fs_FSWatcherEventType.Error = "error";
nodejs_fs_FileLinkType.Dir = "dir";
nodejs_fs_FileLinkType.File = "file";
nodejs_fs_FileLinkType.Junction = "junction";
nodejs_fs_FileIOFlag.Read = "r";
nodejs_fs_FileIOFlag.ReadWrite = "r+";
nodejs_fs_FileIOFlag.ReadSync = "rs";
nodejs_fs_FileIOFlag.ReadWriteSync = "rs+";
nodejs_fs_FileIOFlag.WriteCreate = "w";
nodejs_fs_FileIOFlag.WriteCheck = "wx";
nodejs_fs_FileIOFlag.WriteReadCreate = "w+";
nodejs_fs_FileIOFlag.WriteReadCheck = "wx+";
nodejs_fs_FileIOFlag.AppendCreate = "a";
nodejs_fs_FileIOFlag.AppendCheck = "ax";
nodejs_fs_FileIOFlag.AppendReadCreate = "a+";
nodejs_fs_FileIOFlag.AppendReadCheck = "ax+";
nodejs_fs_ReadStreamEventType.Open = "open";
nodejs_fs_WriteStreamEventType.Open = "open";
nodejs_http_HTTPMethod.Get = "GET";
nodejs_http_HTTPMethod.Post = "POST";
nodejs_http_HTTPMethod.Options = "OPTIONS";
nodejs_http_HTTPMethod.Head = "HEAD";
nodejs_http_HTTPMethod.Put = "PUT";
nodejs_http_HTTPMethod.Delete = "DELETE";
nodejs_http_HTTPMethod.Trace = "TRACE";
nodejs_http_HTTPMethod.Connect = "CONNECT";
nodejs_http_HTTPClientRequestEventType.Response = "response";
nodejs_http_HTTPClientRequestEventType.Socket = "socket";
nodejs_http_HTTPClientRequestEventType.Connect = "connect";
nodejs_http_HTTPClientRequestEventType.Upgrade = "upgrade";
nodejs_http_HTTPClientRequestEventType.Continue = "continue";
nodejs_http_HTTPServerEventType.Listening = "listening";
nodejs_http_HTTPServerEventType.Connection = "connection";
nodejs_http_HTTPServerEventType.Close = "close";
nodejs_http_HTTPServerEventType.Error = "error";
nodejs_http_HTTPServerEventType.Request = "request";
nodejs_http_HTTPServerEventType.CheckContinue = "checkContinue";
nodejs_http_HTTPServerEventType.Connect = "connect";
nodejs_http_HTTPServerEventType.Upgrade = "upgrade";
nodejs_http_HTTPServerEventType.ClientError = "clientError";
nodejs_stream_ReadableEventType.Readable = "readable";
nodejs_stream_ReadableEventType.Data = "data";
nodejs_stream_ReadableEventType.End = "end";
nodejs_stream_ReadableEventType.Close = "close";
nodejs_stream_ReadableEventType.Error = "error";
nodejs_http_IncomingMessageEventType.Data = "data";
nodejs_http_IncomingMessageEventType.Close = "close";
nodejs_http_IncomingMessageEventType.End = "end";
nodejs_http_MultipartFormEventType.Part = "part";
nodejs_http_MultipartFormEventType.Aborted = "aborted";
nodejs_http_MultipartFormEventType.Error = "error";
nodejs_http_MultipartFormEventType.Progress = "progress";
nodejs_http_MultipartFormEventType.Field = "field";
nodejs_http_MultipartFormEventType.File = "file";
nodejs_http_MultipartFormEventType.Close = "close";
nodejs_http_ServerResponseEventType.Close = "close";
nodejs_http_ServerResponseEventType.Finish = "finish";
nodejs_mongodb_MongoAuthOption.MONGO_CR = "MONGODB - CR";
nodejs_mongodb_MongoAuthOption.GSSAPI = "GSSAPI";
nodejs_net_TCPServerEventType.Listening = "listening";
nodejs_net_TCPServerEventType.Connection = "connection";
nodejs_net_TCPServerEventType.Close = "close";
nodejs_net_TCPServerEventType.Error = "error";
nodejs_net_TCPSocketEventType.Connect = "connect";
nodejs_net_TCPSocketEventType.Data = "data";
nodejs_net_TCPSocketEventType.End = "end";
nodejs_net_TCPSocketEventType.TimeOut = "timeout";
nodejs_net_TCPSocketEventType.Drain = "drain";
nodejs_net_TCPSocketEventType.Error = "error";
nodejs_net_TCPSocketEventType.Close = "close";
nodejs_stream_WritableEventType.Drain = "drain";
nodejs_stream_WritableEventType.Finish = "finish";
nodejs_stream_WritableEventType.Pipe = "pipe";
nodejs_stream_WritableEventType.Unpipe = "unpipe";
nodejs_stream_WritableEventType.Error = "error";
Main.main();
})();
