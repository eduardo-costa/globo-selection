package globo.view;
import globo.model.ParedaoClientModel;
import haxe.Json;
import haxe.Timer;
import haxor.Activity;
import js.Browser;
import js.html.DOMElement;
import js.html.HTMLCollection;
import js.html.InputElement;
import js.html.MouseEvent;

/**
 * Classe que implementa a funcionalidade de gerencia de paredão.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoManagerView
{

	/**
	 * Referência para os elementos de UI
	 */
	private var button_create : DOMElement;
	
	/**
	 * Inicia a classe com o ID do container da interface no HTML.
	 * @param	p_container_id
	 */
	public function new() 
	{
		trace("ParedaoManagerView> CTOR");		
		
		var click_list : Array<String> = ["button-create","button-tab-list"];
		
		for (id in click_list) 
		{
			var el : DOMElement = Browser.document.getElementById(id);
			if (id == "button-create") button_create = el;
			el.onclick = OnClick;
		}
		
	}
	
	/**
	 * Seleciona uma das tabs do manager.
	 * @param	p_id
	 */
	public function SetTab(p_id:String):Void
	{
		untyped { $(document).ready(function(){ $('ul.tabs').tabs('select_tab', p_id); }); }
	}
	
	/**
	 * Controla a visibilidade do spinner.
	 */
	private function ShowSpinner(p_type:String):Void {	var el : DOMElement = Browser.document.getElementById("spinner-"+p_type+""); el.classList.remove("alpha0"); }	
	private function HideSpinner(p_type:String):Void {	var el : DOMElement = Browser.document.getElementById("spinner-"+p_type+""); el.classList.add("alpha0"); }
	
	/**
	 * Retorna o nome dos participantes do paredao sendo criado.
	 * @return
	 */
	private function GetParedaoNames():Array<String>
	{
		var res : Array<String> = ["", ""];
		var el : InputElement;
		el = cast Browser.document.getElementById("player-name-1");	res[0] = el.value;
		el = cast Browser.document.getElementById("player-name-2");	res[1] = el.value;
		return res;
	}
	
	/**
	 * Retorna a duração do paredão em horas.
	 * @return
	 */
	private function GetParedaoDuration():Float
	{
		var el : InputElement;
		el = cast Browser.document.getElementById("paredao-duration");
		return Std.parseFloat(el.value);
	}
	
	/**
	 * Reseta o form de nomes.
	 */
	private function ResetParedaoForm():Void
	{
		var el : InputElement;
		el = cast Browser.document.getElementById("player-name-1");	el.value = "";
		el = cast Browser.document.getElementById("player-name-2");	el.value = "";
		el = cast Browser.document.getElementById("paredao-duration");	el.value = "1";
	}
	
	/**
	 * Trata os eventos de mouse.
	 * @param	p_event
	 */
	private function OnClick(p_event:MouseEvent):Void
	{
		var t : DOMElement = cast p_event.currentTarget;
		if (t == null) return;
		var id : String = t.id;
		
		switch(id)
		{
			case "button-create":
			{
				var nl : Array<String> = GetParedaoNames();
				if (nl[0] == "") return;
				if (nl[1] == "") return;
				var t : Float = GetParedaoDuration();
				var d : Dynamic = 
				{
					name1: nl[0],
					name2: nl[1],
					duration: t
				};				
				ShowSpinner("create");
				ParedaoClientModel.Send(ParedaoClientModel.paredaoCreateURL, OnParedaoCreate, d, "POST");
			}
			
			case "button-tab-list":
				RefreshParedaoList();
				
			case "button-delete":
			{
				var paredao_id : String = t.getAttribute("item");
				var d : Dynamic = { };
				d.id = paredao_id;
				ParedaoClientModel.Send(ParedaoClientModel.paredaoDeleteURL, OnParedaoDelete, d, "POST");
			}
				
		}		
	}
	
	/**
	 * Callback chamado quando o paredão for criado.
	 * @param	p_data
	 */
	private function OnParedaoCreate(p_data:String):Void
	{
		var success : Bool = p_data == "true";		
		button_create.style.backgroundColor = success ? "#3f3" : "#f33";
		Activity.Set(button_create.style,"backgroundColor","", 1.0);			
		if (success) Activity.Delay(function()
		{ 
			SetTab("tab-list"); 		
			RefreshParedaoList();
		}, 2.0);		
		HideSpinner("create");
		ResetParedaoForm();
	}
	
	/**
	 * Recarrega a lista de paredões.
	 */
	private function RefreshParedaoList():Void
	{
		trace("ParedaoManagerView> Refresh List");
		ShowSpinner("list");
		ParedaoClientModel.Load(ParedaoClientModel.paredaoListURL, OnParedaoList);
	}
	
	/**
	 * Callback chamado quando a lista de paredoes é carregada.
	 * @param	p_data
	 */
	private function OnParedaoList(p_data:String):Void
	{
		trace("ParedaoManagerView> OnParedaoList " + p_data);
		HideSpinner("list");
		var d : Array<ParedaoViewModel> = Json.parse(p_data);		
		var c : DOMElement = Browser.document.getElementById("paredao-list");
		var str : String = "";
		
		for (it in d)
		{
			var v1 : Float = it.votes0;
			var v2 : Float = it.votes1;
			var t : Float = v1 + v2;
			var p1 : Int = Math.floor((t <= 0 ? 0 : (v1 / (v1 + v2)))*100.0);
			var p2 : Int = Math.floor((t <= 0 ? 0 : (v2 / (v1 + v2)))*100.0);
			
			var dt0 : Date;
			var dt1 : Date;
			
			dt0 = Date.fromTime(it.start);			
			dt1 = Date.fromTime(untyped it.current);
			
			var dtf : Int = untyped dt1 - dt0;
			
			var t_start  	: String = dt0.toString();			
			var t_current	: String = dt1.toString();			
			var t_remain 	: String = ParedaoClientModel.FormatSeconds(it.remain);			
			
			var itt : String = ParedaoClientModel.paredaoItemTemplate;
			itt = StringTools.replace(itt, "@ID", it.id);
			itt = StringTools.replace(itt,"@LNK", ParedaoClientModel.root+"index.html?id="+it.id);
			itt = StringTools.replace(itt, "@N1", it.name1);
			itt = StringTools.replace(itt, "@N2", it.name2);
			itt = StringTools.replace(itt, "@P1", p1 + "");
			itt = StringTools.replace(itt, "@P2", p2 + "");
			itt = StringTools.replace(itt, "@C1", v1 + "");
			itt = StringTools.replace(itt, "@C2", v2 + "");
			itt = StringTools.replace(itt, "@VPH1", it.vph1 + "");
			itt = StringTools.replace(itt, "@VPH2", it.vph2 + "");
			itt = StringTools.replace(itt, "@T0", t_start + "");
			itt = StringTools.replace(itt, "@T1", t_current + "");
			itt = StringTools.replace(itt, "@R", t_remain + "");
			itt = StringTools.replace(itt, "@VT", (v1+v2) + "");
			
			str += itt + "\n";
			
		}
		
		c.innerHTML = str;
		
		Activity.Delay(function()
		{ 
			untyped { $('.collapsible').collapsible( { accordion : false } ); }
			
			var elem_list : HTMLCollection = Browser.document.getElementsByClassName("btn-paredao-delete");
			for (i in 0...elem_list.length)
			{				
				elem_list.item(i).onclick = OnClick;
			}
			
		}, 0.1);
		
	}
	
	/**
	 * Callback chamado após a operaçao de delete paredao.
	 * @param	p_data
	 */
	private function OnParedaoDelete(p_data:String):Void
	{
		ShowSpinner("list");
		RefreshParedaoList();
	}
	
	
}