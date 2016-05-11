package globo.model;
import haxe.Json;
import js.Browser;
import js.html.Event;
import js.html.FormData;
import js.html.XMLHttpRequest;

/**
 * Classe que descreve os dados de listagem de um paredão.
 */
extern class ParedaoViewModel
{
	var id : String;
	var name1 : String;
	var name2 : String;
	var votes0 : Int;
	var votes1 : Int;
	var vph1 : Int;
	var vph2 : Int;
	var remain : Int;
	var start : Int;
}

/**
 * Classe de gerência dos dados da aplicação cliente.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoClientModel
{
	/**
	 * Flag que indica se o script está rodando localmente.
	 */
	static public var online(get, never):Bool;
	static function get_online():Bool { return Browser.window.location.host.toLowerCase().indexOf("localhost") < 0; }
	
	/**
	 * Root URL.
	 */
	static public var root(get, never):String;
	static function get_root():String
	{
		if (!online) return "http://localhost:2000/";
		return "http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/";
	}
	
	/**
	 * Root URL dos webservices.
	 */
	static public var wsRoot(get, never):String;
	static function get_wsRoot():String
	{
		if (!online) return "http://localhost:9000/";
		//return "http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com:9000/";
		return "http://ec2-52-24-71-71.us-west-2.compute.amazonaws.com/";
	}
	
	
	/**
	 * Rota da página atual.
	 */
	static public var route(get, never):String;
	static private function get_route():String
	{
		var path : String = Browser.window.location.pathname.toLowerCase();		
		if (path.indexOf("manager") >= 0) return "manager";	
		return "index";
	}
	
	/**
	 * Chave de configuração do captcha
	 */
	static public var captchaKey(get, never):String;
	static private function get_captchaKey():String
	{
		var url : String = Browser.window.location.host.toLowerCase();				
		if (url.indexOf("localhost") >= 0) return "6LfM4fwSAAAAAFVNYcOy3JcpmTiCMB6-N9FWku1b";
		if (url.indexOf("amazonaws") >= 0) return "6LfoAAcTAAAAAHI9eYDuCgS8j1XzsQvXh5hF1jMQ";
		return "";
	}
	
	/**
	 * URLs dos serviços usados.
	 */
	static public var paredaoCreateURL  : String = wsRoot + "paredao/create/";
	static public var paredaoListURL 	: String = wsRoot + "paredao/list/";
	static public var paredaoDeleteURL 	: String = wsRoot + "paredao/delete/";	
	static public var paredaoVoteURL 	: String = wsRoot + "paredao/vote/";
		
	
	/**
	 * Template HTML de um elemento da lista de paredoes do manager.
	 */
	static public var paredaoItemTemplate : String = 
	'
	<li>
		<a id="button-delete" item="@ID" class="btn-paredao-delete btn-floating waves-effect waves-light red abs"><i class="mdi-action-delete rel"></i></a>
		<div class="collapsible-header"><p class="header-names ib">@N1 vs @N2</p></div>
		<div class="collapsible-body pd10">	
			<a href="@LNK" target="_blank"><p class="pd1">id: @ID</p></a>
			<p class="pd1">Ínicio: @T0</p>
			<p class="pd1">Horário: @T1</p>
			<p class="pd1">Tempo Restante: @R</p>
			<div class="input-field col fw">
				<span>@N1 - @P1% - @C1 votos - @VPH1 votos/h</span>
				<div class="progress">
					<div class="determinate" style="width: @P1%"></div>
				</div>
			</div>
			<div class="input-field col fw">
				<span>@N2 - @P2% - @C2 votos - @VPH2 votos/h</span>
				<div class="progress">
					<div class="determinate" style="width: @P2%"></div>
				</div>
			</div>
			<p class="pd1">Total Votos: @VT</p>
		</div>							
	</li>
	';
	
	/**
	 * Template do recaptcha
	 */
	static public var captchaTemplate : String = 
	'
	<div id="captcha" class="g-recaptcha g-recaptcha-hidden tw-margin abs" data-sitekey="@ID"></div>
	';
	
	
	/**
	 * Returns seconds formatted to HH:MM:SS
	 * @param	p_t
	 * @return
	 */
	static public function FormatSeconds(p_t:Int):String
	{	
		var th : Int = Math.floor((p_t / 60.0) / 60.0);		
		var td : Int = Math.floor(th / 24);
		th = th % 24;
		var tm : Int = Math.floor(((p_t / 60.0)%60));
		var ts : Int = Math.floor((p_t % 60));
		var tv : Int;
		tv = th; var sh : String = tv < 10 ? ("0" + tv) : (tv + "");
		tv = tm; var sm : String = tv < 10 ? ("0" + tv) : (tv + "");
		tv = ts; var ss : String = tv < 10 ? ("0" + tv) : (tv + "");		
		tv = td; var sd : String = tv < 10 ? ("0" + tv) : (tv + "");
		return td+"d - " + sh + ":" +sm+":"+ss;
	}
	
	/**
	 * Carrega dados da URL especificada.
	 * @param	p_url
	 * @param	p_data
	 */
	static public function Load(p_url:String, p_callback : String->Void,p_method:String="GET"):Void
	{
		var req : XMLHttpRequest = Browser.createXMLHttpRequest();
		req.open(p_method, p_url, true);
		req.onload = function(ev:Event):Void
		{
			p_callback(req.responseText);
		};
		req.send();		
	}
	
	/**
	 * Envia dados para a URL especificada.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @param	p_method
	 */
	static public function Send(p_url:String, p_callback : String->Void, p_data : Dynamic, p_method:String = "GET"):Void
	{
		var req : XMLHttpRequest = Browser.createXMLHttpRequest();
		req.open(p_method, p_url, true);
		req.onload = function(ev:Event):Void
		{
			p_callback(req.responseText);
		};				
		trace("&json=" + Json.stringify(p_data));
		req.send("&json="+ Json.stringify(p_data));
	}
	
	
}