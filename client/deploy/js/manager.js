(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
var Main = function() { };
Main.main = function() {
	var w = window;
	console.log("ParedaoClient> route[" + globo_model_ParedaoClientModel.get_route() + "]");
	var _g = globo_model_ParedaoClientModel.get_route();
	switch(_g) {
	case "index":
		Main.voter = new globo_view_ParedaoModalView("paredao-modal");
		haxe_Timer.delay(function() {
			Main.voter.Show();
		},800);
		w.voter = Main.voter;
		break;
	case "manager":
		Main.manager = new globo_view_ParedaoManagerView();
		w.manager = Main.manager;
		break;
	}
};
var StringTools = function() { };
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var globo_model_ParedaoClientModel = function() { };
globo_model_ParedaoClientModel.get_online = function() {
	return window.location.host.toLowerCase().indexOf("localhost") < 0;
};
globo_model_ParedaoClientModel.get_root = function() {
	if(!globo_model_ParedaoClientModel.get_online()) return "http://localhost:2000/";
	return "http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/";
};
globo_model_ParedaoClientModel.get_wsRoot = function() {
	if(!globo_model_ParedaoClientModel.get_online()) return "http://localhost:9000/";
	return "http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/";
};
globo_model_ParedaoClientModel.get_route = function() {
	var path = window.location.pathname.toLowerCase();
	if(path.indexOf("manager") >= 0) return "manager";
	return "index";
};
globo_model_ParedaoClientModel.get_captchaKey = function() {
	var url = window.location.host.toLowerCase();
	if(url.indexOf("localhost") >= 0) return "6LfM4fwSAAAAAFVNYcOy3JcpmTiCMB6-N9FWku1b";
	if(url.indexOf("amazonaws") >= 0) return "6LfoAAcTAAAAAHI9eYDuCgS8j1XzsQvXh5hF1jMQ";
	return "";
};
globo_model_ParedaoClientModel.FormatSeconds = function(p_t) {
	var th = Math.floor(p_t / 60.0 / 60.0);
	var td = Math.floor(th / 24);
	th = th % 24;
	var tm = Math.floor(p_t / 60.0 % 60);
	var ts = Math.floor(p_t % 60);
	var tv;
	tv = th;
	var sh;
	if(tv < 10) sh = "0" + tv; else sh = tv + "";
	tv = tm;
	var sm;
	if(tv < 10) sm = "0" + tv; else sm = tv + "";
	tv = ts;
	var ss;
	if(tv < 10) ss = "0" + tv; else ss = tv + "";
	tv = td;
	var sd;
	if(tv < 10) sd = "0" + tv; else sd = tv + "";
	return td + "d - " + sh + ":" + sm + ":" + ss;
};
globo_model_ParedaoClientModel.Load = function(p_url,p_callback,p_method) {
	if(p_method == null) p_method = "GET";
	var req = js_Browser.createXMLHttpRequest();
	req.open(p_method,p_url,true);
	req.onload = function(ev) {
		p_callback(req.responseText);
	};
	req.send();
};
globo_model_ParedaoClientModel.Send = function(p_url,p_callback,p_data,p_method) {
	if(p_method == null) p_method = "GET";
	var req = js_Browser.createXMLHttpRequest();
	req.open(p_method,p_url,true);
	req.onload = function(ev) {
		p_callback(req.responseText);
	};
	console.log("&json=" + JSON.stringify(p_data));
	req.send("&json=" + JSON.stringify(p_data));
};
var globo_view_ParedaoManagerView = function() {
	console.log("ParedaoManagerView> CTOR");
	var click_list = ["button-create","button-tab-list"];
	var _g = 0;
	while(_g < click_list.length) {
		var id = click_list[_g];
		++_g;
		var el = window.document.getElementById(id);
		if(id == "button-create") this.button_create = el;
		el.onclick = $bind(this,this.OnClick);
	}
};
globo_view_ParedaoManagerView.prototype = {
	SetTab: function(p_id) {
		$(document).ready(function() {
			$("ul.tabs").tabs("select_tab",p_id);
		});
	}
	,ShowSpinner: function(p_type) {
		var el = window.document.getElementById("spinner-" + p_type + "");
		el.classList.remove("alpha0");
	}
	,HideSpinner: function(p_type) {
		var el = window.document.getElementById("spinner-" + p_type + "");
		el.classList.add("alpha0");
	}
	,GetParedaoNames: function() {
		var res = ["",""];
		var el;
		el = window.document.getElementById("player-name-1");
		res[0] = el.value;
		el = window.document.getElementById("player-name-2");
		res[1] = el.value;
		return res;
	}
	,GetParedaoDuration: function() {
		var el;
		el = window.document.getElementById("paredao-duration");
		return parseFloat(el.value);
	}
	,ResetParedaoForm: function() {
		var el;
		el = window.document.getElementById("player-name-1");
		el.value = "";
		el = window.document.getElementById("player-name-2");
		el.value = "";
		el = window.document.getElementById("paredao-duration");
		el.value = "1";
	}
	,OnClick: function(p_event) {
		var t = p_event.currentTarget;
		if(t == null) return;
		var id = t.id;
		switch(id) {
		case "button-create":
			var nl = this.GetParedaoNames();
			if(nl[0] == "") return;
			if(nl[1] == "") return;
			var t1 = this.GetParedaoDuration();
			var d = { name1 : nl[0], name2 : nl[1], duration : t1};
			this.ShowSpinner("create");
			globo_model_ParedaoClientModel.Send(globo_model_ParedaoClientModel.paredaoCreateURL,$bind(this,this.OnParedaoCreate),d,"POST");
			break;
		case "button-tab-list":
			this.RefreshParedaoList();
			break;
		case "button-delete":
			var paredao_id = t.getAttribute("item");
			var d1 = { };
			d1.id = paredao_id;
			globo_model_ParedaoClientModel.Send(globo_model_ParedaoClientModel.paredaoDeleteURL,$bind(this,this.OnParedaoDelete),d1,"POST");
			break;
		}
	}
	,OnParedaoCreate: function(p_data) {
		var _g = this;
		var success = p_data == "true";
		if(success) this.button_create.style.backgroundColor = "#3f3"; else this.button_create.style.backgroundColor = "#f33";
		haxor.Activity.Set(this.button_create.style,"backgroundColor","",1.0);
		if(success) haxor.Activity.Delay(function() {
			_g.SetTab("tab-list");
			_g.RefreshParedaoList();
		},2.0);
		this.HideSpinner("create");
		this.ResetParedaoForm();
	}
	,RefreshParedaoList: function() {
		console.log("ParedaoManagerView> Refresh List");
		this.ShowSpinner("list");
		globo_model_ParedaoClientModel.Load(globo_model_ParedaoClientModel.paredaoListURL,$bind(this,this.OnParedaoList));
	}
	,OnParedaoList: function(p_data) {
		var _g2 = this;
		console.log("ParedaoManagerView> OnParedaoList " + p_data);
		this.HideSpinner("list");
		var d = JSON.parse(p_data);
		var c = window.document.getElementById("paredao-list");
		var str = "";
		var _g = 0;
		while(_g < d.length) {
			var it = d[_g];
			++_g;
			var v1 = it.votes0;
			var v2 = it.votes1;
			var t = v1 + v2;
			var p1 = Math.floor((t <= 0?0:v1 / (v1 + v2)) * 100.0);
			var p2 = Math.floor((t <= 0?0:v2 / (v1 + v2)) * 100.0);
			var dt0;
			var dt1;
			var d1 = new Date();
			d1.setTime(it.start);
			dt0 = d1;
			var d2 = new Date();
			d2.setTime(it.current);
			dt1 = d2;
			var dtf = dt1 - dt0;
			var t_start = HxOverrides.dateStr(dt0);
			var t_current = HxOverrides.dateStr(dt1);
			var t_remain = globo_model_ParedaoClientModel.FormatSeconds(it.remain);
			var itt = globo_model_ParedaoClientModel.paredaoItemTemplate;
			itt = StringTools.replace(itt,"@ID",it.id);
			itt = StringTools.replace(itt,"@LNK",globo_model_ParedaoClientModel.get_root() + "index.html?id=" + it.id);
			itt = StringTools.replace(itt,"@N1",it.name1);
			itt = StringTools.replace(itt,"@N2",it.name2);
			itt = StringTools.replace(itt,"@P1",p1 + "");
			itt = StringTools.replace(itt,"@P2",p2 + "");
			itt = StringTools.replace(itt,"@C1",v1 + "");
			itt = StringTools.replace(itt,"@C2",v2 + "");
			itt = StringTools.replace(itt,"@VPH1",it.vph1 + "");
			itt = StringTools.replace(itt,"@VPH2",it.vph2 + "");
			itt = StringTools.replace(itt,"@T0",t_start + "");
			itt = StringTools.replace(itt,"@T1",t_current + "");
			itt = StringTools.replace(itt,"@R",t_remain + "");
			itt = StringTools.replace(itt,"@VT",v1 + v2 + "");
			str += itt + "\n";
		}
		c.innerHTML = str;
		haxor.Activity.Delay(function() {
			$(".collapsible").collapsible({ accordion : false});
			var elem_list = window.document.getElementsByClassName("btn-paredao-delete");
			var _g1 = 0;
			var _g3 = elem_list.length;
			while(_g1 < _g3) {
				var i = _g1++;
				elem_list.item(i).onclick = $bind(_g2,_g2.OnClick);
			}
		},0.1);
	}
	,OnParedaoDelete: function(p_data) {
		this.ShowSpinner("list");
		this.RefreshParedaoList();
	}
};
var globo_view_ParedaoModalView = function(p_container_id) {
	var _g = this;
	console.log("ParedaoModalView> CTOR");
	this.container = window.document.getElementById(p_container_id);
	this.modal_window = window.document.getElementById("modal-window");
	this.frame_back = window.document.getElementById("frame-back");
	this.frame_front = window.document.getElementById("frame-front");
	this.footer = window.document.getElementById("modal-footer");
	this.name_container = window.document.getElementById("name-container");
	this.photo_container_space = window.document.getElementById("photo-container-space");
	var captcha_html = globo_model_ParedaoClientModel.captchaTemplate;
	captcha_html = StringTools.replace(captcha_html,"@ID",globo_model_ParedaoClientModel.get_captchaKey());
	this.footer.innerHTML += captcha_html;
	haxor.Activity.Delay(function() {
		console.log("ParedaoVoter> captcha_key[" + globo_model_ParedaoClientModel.get_captchaKey() + "]");
		_g.captcha_container = window.document.getElementById("captcha");
		_g.button_submit = window.document.getElementById("button-submit");
		_g.footer = window.document.getElementById("modal-footer");
	},0.01);
	this.complete = false;
	this.m_is_blocked = false;
	var click_targets = ["button-close","modal-background","photo01","photo02","button-submit"];
	var _g1 = 0;
	while(_g1 < click_targets.length) {
		var s = click_targets[_g1];
		++_g1;
		var t = window.document.getElementById(s);
		if(t == null) continue;
		t.onclick = $bind(this,this.OnClick);
	}
	this.current = -1;
	this.names = ["",""];
	this.percents = [0,0];
	this.votes = [0,0];
	this.set_chartPercent(0);
	this.set_elapsed(0);
	var qs = window.location.search;
	qs = StringTools.replace(qs,"?","");
	var tk = qs.split("&");
	var _g2 = 0;
	while(_g2 < tk.length) {
		var it = tk[_g2];
		++_g2;
		if(it.indexOf("=") < 0) continue;
		var k = it.split("=")[0];
		var v = it.split("=")[1];
		if(k == "id") this.pid = v;
	}
	if(this.pid != null) globo_model_ParedaoClientModel.Send(globo_model_ParedaoClientModel.paredaoListURL,$bind(this,this.OnListLoad),{ id : this.pid},"POST");
};
globo_view_ParedaoModalView.prototype = {
	get_chartPercent: function() {
		return this.m_chartPercent;
	}
	,set_chartPercent: function(v) {
		this.m_chartPercent = v;
		var el = window.document.getElementById("chart-fill");
		var a = -180. + v * 180.0;
		el.style.transform = "rotate(" + a + "deg)";
		var lb;
		a = -a;
		lb = el.children.item(0);
		lb.textContent = Math.floor(v * 99) + "%";
		lb.style.transform = "rotate(" + a + "deg)";
		lb = el.children.item(1);
		lb.textContent = Math.floor((1.0 - v) * 99) + "%";
		lb.style.transform = "rotate(" + a + "deg)";
		return v;
	}
	,get_elapsed: function() {
		return this.m_elapsed;
	}
	,set_elapsed: function(v) {
		this.m_elapsed = v;
		if(this.m_elapsed <= 0) this.m_elapsed = 0;
		var el = window.document.getElementById("chart-content");
		var lb;
		lb = el.children.item(1);
		lb.textContent = globo_model_ParedaoClientModel.FormatSeconds(this.m_elapsed);
		return v;
	}
	,Show: function() {
		var _g = this;
		this.container.style.display = "block";
		haxe_Timer.delay(function() {
			_g.container.classList.remove("alpha0");
			_g.modal_window.classList.remove("up20");
		},3);
	}
	,Hide: function() {
		var _g = this;
		haxe_Timer.delay(function() {
			_g.container.style.display = "none";
		},400);
		this.container.classList.add("alpha0");
		this.modal_window.classList.add("up20");
	}
	,ShowCaptcha: function() {
		this.button_submit.classList.add("btn-move-left");
		this.captcha_container.classList.remove("g-recaptcha-hidden");
	}
	,HideCaptcha: function() {
		this.button_submit.classList.remove("btn-move-left");
		this.captcha_container.classList.add("g-recaptcha-hidden");
	}
	,Minimize: function() {
		this.frame_back.classList.add("rect10-min");
		this.frame_front.classList.add("rect-min");
		this.footer.classList.add("footer-hidden");
		this.name_container.classList.add("alpha0");
		this.photo_container_space.style.width = "155px";
		var cl;
		cl = this.container.getElementsByClassName("frame");
		cl.item(0).classList.add("frame-no-border");
		cl.item(1).classList.add("frame-no-border");
		cl = this.container.getElementsByClassName("feedback");
		cl.item(0).classList.remove("height0");
		var el = window.document.getElementById("chart-container");
		el.classList.remove("mt50");
		this.SetCurrent(-1);
	}
	,Maximize: function() {
		this.frame_back.classList.remove("rect10-min");
		this.frame_front.classList.remove("rect-min");
		this.footer.classList.remove("footer-hidden");
		this.name_container.classList.remove("alpha0");
		this.photo_container_space.removeAttribute("style");
		var cl = this.container.getElementsByClassName("frame");
		cl.item(0).classList.remove("frame-no-border");
		cl.item(1).classList.remove("frame-no-border");
		cl = this.container.getElementsByClassName("feedback");
		cl.item(0).classList.add("height0");
		this.SetCurrent(this.current);
	}
	,SetCurrent: function(p_id) {
		if(p_id >= 0) this.current = p_id;
		var t;
		t = window.document.getElementById("photo01");
		if(p_id == 1) t.classList.add("frame-toggle"); else t.classList.remove("frame-toggle");
		t = window.document.getElementById("photo02");
		if(p_id == 2) t.classList.add("frame-toggle"); else t.classList.remove("frame-toggle");
	}
	,Block: function() {
		if(this.m_is_blocked) return;
		this.Minimize();
		var el = window.document.getElementById("screen-block");
		el.style.display = "block";
		el.style.opacity = "1.0";
		this.m_is_blocked = true;
	}
	,OnClick: function(p_event) {
		var _g = this;
		var t = p_event.currentTarget;
		var id = t.id;
		switch(id) {
		case "button-close":
			haxor.Activity.Delay($bind(this,this.Hide),0.2);
			break;
		case "button-submit":
			if(t.classList.contains("disabled")) return;
			t.classList.add("disabled");
			this.ShowCaptcha();
			this.captcha = window.grecaptcha;
			haxor.Activity.Run(function(a) {
				var has_ended = _g.captcha == null || _g.captcha.getResponse() != "";
				if(has_ended) {
					_g.complete = true;
					haxor.Activity.Remove(a);
					if(_g.captcha.getResponse() != "") _g.ProcessVote(_g.captcha.getResponse());
				}
			});
			break;
		case "photo01":
			if(this.complete) return;
			if(this.get_elapsed() <= 0) return;
			this.button_submit.classList.remove("disabled");
			this.SetCurrent(1);
			break;
		case "photo02":
			if(this.complete) return;
			if(this.get_elapsed() <= 0) return;
			this.button_submit.classList.remove("disabled");
			this.SetCurrent(2);
			break;
		}
	}
	,OnListLoad: function(p_data) {
		var _g = this;
		var l = JSON.parse(p_data);
		if(l.length <= 0) return;
		var d = l[0];
		if(d != null) {
			var lbl;
			lbl = window.document.getElementsByClassName("lb-name-1");
			var _g1 = 0;
			while(_g1 < lbl.length) {
				var it = lbl[_g1];
				++_g1;
				it.textContent = d.name1;
			}
			lbl = window.document.getElementsByClassName("lb-name-2");
			var _g2 = 0;
			while(_g2 < lbl.length) {
				var it1 = lbl[_g2];
				++_g2;
				it1.textContent = d.name2;
			}
			this.names[0] = d.name1;
			this.names[1] = d.name2;
			this.set_elapsed(d.remain);
			this.votes[0] = d.votes0;
			this.votes[1] = d.votes1;
			var t = d.votes0 + d.votes1;
			var p1;
			p1 = t <= 0?0:d.votes0 / (d.votes0 + d.votes1);
			this.set_chartPercent(p1);
			console.log("ParedaoModalView> OnListLoad");
			console.log(d);
			haxor.Activity.Run(function(a) {
				var _g11 = _g;
				_g11.set_elapsed(_g11.get_elapsed() - haxor.Time.delta);
				if(_g.get_elapsed() <= 0) {
					if(!_g.m_is_blocked) _g.Block();
				}
			});
		}
	}
	,ProcessVote: function(p_captcha) {
		var _g = this;
		globo_model_ParedaoClientModel.Send(globo_model_ParedaoClientModel.paredaoVoteURL,function(p_result) {
			if(p_result == "false") {
				console.log("ParedaoModalView> ProcessVote Failed");
				return;
			}
			if(p_result == "") return;
			console.log("ParedaoModalView> ProcessVote [" + p_result + "]");
			_g.votes[_g.current - 1]++;
			var v1 = _g.votes[0];
			var v2 = _g.votes[1];
			var t = v1 + v2;
			var p1;
			p1 = t <= 0?0:v1 / (v1 + v2);
			var p2;
			p2 = t <= 0?0:v2 / (v1 + v2);
			_g.percents[0] = p1;
			_g.percents[1] = p2;
			_g.set_chartPercent(p1);
			var feedback_field = _g.container.getElementsByClassName("feedback").item(0);
			feedback_field.innerHTML = "<strong>Parabéns!</strong> Seu voto para <strong>" + _g.names[_g.current - 1] + "</strong> foi enviado com sucesso.";
			haxor.Activity.Delay($bind(_g,_g.HideCaptcha),1.0);
			haxor.Activity.Delay($bind(_g,_g.Minimize),1.2);
			haxor.Activity.Delay(function() {
				_g.footer.remove();
			},2.2);
		},{ id : this.pid, vote : this.current, response : p_captcha, captcha : globo_model_ParedaoClientModel.get_captchaKey(), online : globo_model_ParedaoClientModel.get_online()},"POST");
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Browser = function() { };
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") return new XMLHttpRequest();
	if(typeof ActiveXObject != "undefined") return new ActiveXObject("Microsoft.XMLHTTP");
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
globo_model_ParedaoClientModel.paredaoCreateURL = globo_model_ParedaoClientModel.get_wsRoot() + "paredao/create/";
globo_model_ParedaoClientModel.paredaoListURL = globo_model_ParedaoClientModel.get_wsRoot() + "paredao/list/";
globo_model_ParedaoClientModel.paredaoDeleteURL = globo_model_ParedaoClientModel.get_wsRoot() + "paredao/delete/";
globo_model_ParedaoClientModel.paredaoVoteURL = globo_model_ParedaoClientModel.get_wsRoot() + "paredao/vote/";
globo_model_ParedaoClientModel.paredaoItemTemplate = "\r\n\t<li>\r\n\t\t<a id=\"button-delete\" item=\"@ID\" class=\"btn-paredao-delete btn-floating waves-effect waves-light red abs\"><i class=\"mdi-action-delete rel\"></i></a>\r\n\t\t<div class=\"collapsible-header\"><p class=\"header-names ib\">@N1 vs @N2</p></div>\r\n\t\t<div class=\"collapsible-body pd10\">\t\r\n\t\t\t<a href=\"@LNK\" target=\"_blank\"><p class=\"pd1\">id: @ID</p></a>\r\n\t\t\t<p class=\"pd1\">Ínicio: @T0</p>\r\n\t\t\t<p class=\"pd1\">Horário: @T1</p>\r\n\t\t\t<p class=\"pd1\">Tempo Restante: @R</p>\r\n\t\t\t<div class=\"input-field col fw\">\r\n\t\t\t\t<span>@N1 - @P1% - @C1 votos - @VPH1 votos/h</span>\r\n\t\t\t\t<div class=\"progress\">\r\n\t\t\t\t\t<div class=\"determinate\" style=\"width: @P1%\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"input-field col fw\">\r\n\t\t\t\t<span>@N2 - @P2% - @C2 votos - @VPH2 votos/h</span>\r\n\t\t\t\t<div class=\"progress\">\r\n\t\t\t\t\t<div class=\"determinate\" style=\"width: @P2%\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<p class=\"pd1\">Total Votos: @VT</p>\r\n\t\t</div>\t\t\t\t\t\t\t\r\n\t</li>\r\n\t";
globo_model_ParedaoClientModel.captchaTemplate = "\r\n\t<div id=\"captcha\" class=\"g-recaptcha g-recaptcha-hidden tw-margin abs\" data-sitekey=\"@ID\"></div>\r\n\t";
Main.main();
})();
