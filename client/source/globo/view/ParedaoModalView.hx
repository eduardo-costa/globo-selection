package globo.view;
import globo.model.ParedaoClientModel;
import haxe.Json;
import haxe.Timer;
import haxor.Activity;
import haxor.Animation;
import haxor.Time;
import js.Browser;
import js.html.DOMElement;
import js.html.HTMLCollection;
import js.html.MouseEvent;
import js.html.URL;

/**
 * Classe que implementa a funcionalidade de voto do paredão.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoModalView
{

	/**
	 * Referência para os elementos de UI
	 */
	public var container : DOMElement;	
	public var modal_window : DOMElement;
	public var button_submit : DOMElement;
	public var captcha_container : DOMElement;	
	public var frame_back : DOMElement;
	public var frame_front : DOMElement;
	public var footer : DOMElement;
	public var photo_container_space : DOMElement;
	public var name_container : DOMElement;
	
	/**
	 * Participante escolhido no momento.
	 */
	public var current : Int;
	
	/**
	 * Flag que indica que a votação foi finalizada.
	 */
	public var complete : Bool;
	
	/**
	 * Referencia para a instancia do captcha.
	 */
	public var captcha : Dynamic;
	
	/**
	 * Dados do paredao carregados.
	 */
	public var names    : Array<String>;
	public var percents : Array<Float>;
	public var votes    : Array<Int>;
	public var pid		: String;
	
	/**
	 * Porcentagem do gráfico.
	 */
	public var chartPercent(get, set):Float;
	private function get_chartPercent() : Float { return m_chartPercent; }
	private function set_chartPercent(v:Float) : Float
	{
		m_chartPercent = v;
		var el : DOMElement = Browser.document.getElementById("chart-fill");
		
		var a : Int = cast (-180.0 + (v * 180.0));
		el.style.transform = "rotate(" + a + "deg)";
		
		var lb : DOMElement;		
		a = -a;
		lb = el.children.item(0); lb.textContent = Math.floor(v * 99) + "%"; lb.style.transform = "rotate("+a+"deg)";
		lb = el.children.item(1); lb.textContent = Math.floor((1.0-v) * 99) + "%"; lb.style.transform = "rotate("+a+"deg)";
		return v;
	}	
	private var m_chartPercent : Float;
	
	/**
	 * Tempo para acabar o paredão.
	 */
	public var elapsed(get, set):Float;
	private function get_elapsed() : Float { return m_elapsed; }
	private function set_elapsed(v:Float) : Float
	{
		m_elapsed = v;
		if (m_elapsed <= 0)
		{
			m_elapsed = 0;			
		}
		
		
		
		var el : DOMElement = Browser.document.getElementById("chart-content");		
		var lb : DOMElement;				
		lb = el.children.item(1); 
		lb.textContent = ParedaoClientModel.FormatSeconds(cast m_elapsed);
		return v;
	}	
	private var m_elapsed : Float;
	
	/**
	 * Flag que indica se o bloqueio foi aplicado.
	 */
	private var m_is_blocked:Bool;
	
	
	/**
	 * Inicia a classe com o ID do container da interface no HTML.
	 * @param	p_container_id
	 */
	public function new(p_container_id : String) 
	{
		trace("ParedaoModalView> CTOR");		
		//localiza o container da modal.
		container 	  = Browser.document.getElementById(p_container_id);
		modal_window  = Browser.document.getElementById("modal-window");
		
		frame_back   = Browser.document.getElementById("frame-back");
		frame_front  = Browser.document.getElementById("frame-front");
		footer		 = Browser.document.getElementById("modal-footer");
		name_container = Browser.document.getElementById("name-container");
		photo_container_space = Browser.document.getElementById("photo-container-space");
		
		
		var captcha_html : String = ParedaoClientModel.captchaTemplate;
		captcha_html = StringTools.replace(captcha_html,"@ID", ParedaoClientModel.captchaKey);		
		footer.innerHTML += captcha_html;
		
		//Delay para que os dados estejam disponiveis.
		Activity.Delay(function() 
		{ 
			trace("ParedaoVoter> captcha_key[" + ParedaoClientModel.captchaKey + "]");
			captcha_container = Browser.document.getElementById("captcha");
			button_submit	  = Browser.document.getElementById("button-submit");
			footer		 = Browser.document.getElementById("modal-footer");
		},0.01);
		
		complete = false;
		
		//Reseta a flag de bloqueio
		m_is_blocked = false;
		
		var click_targets : Array<String> = ["button-close", "modal-background", "photo01", "photo02", "button-submit"];
		for (s in click_targets)
		{
			var t : DOMElement = Browser.document.getElementById(s);
			if (t == null) continue;
			t.onclick = OnClick;
		}
		
		current = -1;
		
		names = ["", ""];
		percents = [0, 0];
		votes = [0, 0];
		
		chartPercent = 0;
		elapsed = 0;
		
		//Carrega os dados do paredão requisitado
		var qs : String = Browser.window.location.search;
		qs = StringTools.replace(qs, "?", "");
		var tk : Array<String> = qs.split("&");
		for (it in tk)
		{
			if (it.indexOf("=") < 0) continue;
			var k : String = it.split("=")[0];
			var v : String = it.split("=")[1];
			if (k == "id") pid = v;
		}
		//pid = Browser.document.getElementById("paredao-modal").getAttribute("paredao-id");		
		//paredao-id="555d8b4e6ac486d84a88f3e4"
		if (pid != null) ParedaoClientModel.Send(ParedaoClientModel.paredaoListURL,OnListLoad, { id: pid },"POST");
		
	}
	
	/**
	 * Mostra a modal.
	 */
	public function Show():Void
	{
		container.style.display = "block";
		Timer.delay(function()
		{ 
			container.classList.remove("alpha0");
			modal_window.classList.remove("up20");
		}, 3);		
	}
	
	/**
	 * Esconde a modal.
	 */
	public function Hide():Void
	{
		Timer.delay(function() { container.style.display = "none"; }, 400);
		container.classList.add("alpha0");
		modal_window.classList.add("up20");
	}
	
	/**
	 * Exibe o captcha.
	 */
	public function ShowCaptcha():Void
	{
		button_submit.classList.add("btn-move-left");
		captcha_container.classList.remove("g-recaptcha-hidden");
	}
	
	/**
	 * Esconde o captcha.
	 */
	public function HideCaptcha():Void
	{
		button_submit.classList.remove("btn-move-left");
		captcha_container.classList.add("g-recaptcha-hidden");
	}
	
	/**
	 * Maximiza a modal
	 */
	public function Minimize():Void
	{
		frame_back.classList.add("rect10-min");
	    frame_front.classList.add("rect-min");
		footer.classList.add("footer-hidden");
		name_container.classList.add("alpha0");
		photo_container_space.style.width = "155px";
		var cl : HTMLCollection;
		cl = container.getElementsByClassName("frame");
		cl.item(0).classList.add("frame-no-border");
		cl.item(1).classList.add("frame-no-border");
		
		cl = container.getElementsByClassName("feedback");
		cl.item(0).classList.remove("height0");
		
		var el : DOMElement = Browser.document.getElementById("chart-container");
		el.classList.remove("mt50");
		
		SetCurrent( -1);
		
	}
	/**
	 * Minimiza a modal
	 */
	public function Maximize():Void
	{
		frame_back.classList.remove("rect10-min");
	    frame_front.classList.remove("rect-min");
		footer.classList.remove("footer-hidden");
		name_container.classList.remove("alpha0");
		photo_container_space.removeAttribute("style");
		var cl : HTMLCollection = container.getElementsByClassName("frame");
		cl.item(0).classList.remove("frame-no-border");
		cl.item(1).classList.remove("frame-no-border");
		
		cl = container.getElementsByClassName("feedback");
		cl.item(0).classList.add("height0");
		SetCurrent(current);
	}
	
	/**
	 * Seleciona o concorrente atual.
	 * @param	p_id
	 */
	public function SetCurrent(p_id:Int):Void
	{
		if (p_id >= 0) current = p_id;
		var t : DOMElement;		
		t = Browser.document.getElementById("photo01"); if (p_id == 1) t.classList.add("frame-toggle"); else t.classList.remove("frame-toggle");
		t = Browser.document.getElementById("photo02"); if (p_id == 2) t.classList.add("frame-toggle"); else t.classList.remove("frame-toggle");
	}
	
	/**
	 * Ativao bloqueio de tela.
	 */
	public function Block():Void
	{
		if (m_is_blocked) return;
		Minimize();
		var el : DOMElement = cast Browser.document.getElementById("screen-block");
		el.style.display = "block";
		el.style.opacity = "1.0";
		m_is_blocked = true;
	}
	
	/**
	 * Trata os eventos de mouse.
	 * @param	p_event
	 */
	private function OnClick(p_event:MouseEvent):Void
	{
		var t : DOMElement = cast p_event.currentTarget;
		var id : String = t.id;
		
		switch(id)
		{
			case "button-close": Activity.Delay(Hide, 0.2);
			
			case "button-submit": 
			if (t.classList.contains("disabled")) return;
			
			t.classList.add("disabled");
			
			ShowCaptcha();
			
			//Recupera a instancia global do recaptcha.
			captcha = untyped Browser.window.grecaptcha;
			
			Activity.Run(function(a : Activity):Void
			{
				var has_ended : Bool = (captcha == null) || (captcha.getResponse() != "");				
				if (has_ended)
				{
					complete = true;					
					Activity.Remove(a);
					if(captcha.getResponse()!="")ProcessVote(captcha.getResponse());
				}
				
			});
			
			case "photo01":			
			if (complete) return;
			if (elapsed <= 0) return;
			button_submit.classList.remove("disabled");
			SetCurrent(1);
			
			
			case "photo02":
			if (complete) return;
			if (elapsed <= 0) return;
			button_submit.classList.remove("disabled");
			SetCurrent(2);
			
		}		
	}
	
	/**
	 * Callback chamado após o carregamento de dados do paredão.
	 * @param	p_data
	 */
	private function OnListLoad(p_data:String):Void
	{
		var l : Array<ParedaoViewModel> = Json.parse(p_data);
		
		if (l.length <= 0) return;
		
		var d : ParedaoViewModel = l[0];
				
		if (d != null)
		{
			var lbl : HTMLCollection;
			lbl = Browser.document.getElementsByClassName("lb-name-1"); for (it in lbl) it.textContent = d.name1;
			lbl = Browser.document.getElementsByClassName("lb-name-2"); for (it in lbl) it.textContent = d.name2;			
					
			names[0] = d.name1;
			names[1] = d.name2;			
			elapsed = untyped d.remain;
			votes[0] = d.votes0;
			votes[1] = d.votes1;

			var t : Int = d.votes0 + d.votes1;
			var p1 : Float = cast (t <= 0 ? 0 : (d.votes0 / (d.votes0 + d.votes1)));
			chartPercent = p1;
			
			trace("ParedaoModalView> OnListLoad");
			trace(d);
			
			//Ativa o contador de tempo.
			Activity.Run(function(a:Activity)
			{
				elapsed -= Time.delta;	
				
				//Checa se o tempo acabou e bloqueia a UI
				if(elapsed<=0) if (!m_is_blocked) Block();
			});

			
			
		}		
		
	}
	
	/**
	 * Callback chamado pare processar o voto.
	 * @param	p_captcha
	 */
	private function ProcessVote(p_captcha:String):Void
	{
		ParedaoClientModel.Send(ParedaoClientModel.paredaoVoteURL, function(p_result:String):Void
		{
			
			if (p_result == "false")
			{
				trace("ParedaoModalView> ProcessVote Failed");
				return;
			}
			if (p_result == "") return;
			
			trace("ParedaoModalView> ProcessVote ["+p_result+"]");
			votes[current-1]++;
			
			var v1 : Float = votes[0];
			var v2 : Float = votes[1];
			var t : Float = v1 + v2;
			var p1 : Float = cast (t <= 0 ? 0 : (v1 / (v1 + v2)));
			var p2 : Float = cast (t <= 0 ? 0 : (v2 / (v1 + v2)));
			
			percents[0] = p1;
			percents[1] = p2;
			
			chartPercent = p1;
			
			var feedback_field : DOMElement = container.getElementsByClassName("feedback").item(0);
			feedback_field.innerHTML = "<strong>Parabéns!</strong> Seu voto para <strong>"+names[current-1]+"</strong> foi enviado com sucesso.";
			
			Activity.Delay(HideCaptcha, 1.0);
			Activity.Delay(Minimize, 1.2);
			Activity.Delay(function() { footer.remove(); }, 2.2);		
			
		},{ id: pid, vote: current, response: p_captcha, captcha: ParedaoClientModel.captchaKey, online: ParedaoClientModel.online },"POST");		
	}
	
	
}