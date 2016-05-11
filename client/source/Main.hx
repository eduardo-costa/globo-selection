package;

#if manager
import globo.view.ParedaoManagerView;
#end

import globo.model.ParedaoClientModel;
import globo.view.ParedaoModalView;
import haxe.Timer;
import haxor.Activity;
import haxor.Animation;
import haxor.Time;
import js.Browser;
import js.html.Event;

/**
 * Classe principal da aplicação cliente.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class Main
{

	/**
	 * Referência para as views.
	 */
	static public var voter : ParedaoModalView;	
	
	//Evita código do manager nas views "publicas"
	#if manager
	static public var manager : ParedaoManagerView;
	#end
	
	/**
	 * Ponto de entrada de execução.
	 */
	static function main():Void
	{	
		var w : Dynamic = Browser.window;		
		
		trace("ParedaoClient> route["+ParedaoClientModel.route+"]");
		
		switch(ParedaoClientModel.route)
		{
			case "index":
				voter = new ParedaoModalView("paredao-modal");	
				Timer.delay(function() { voter.Show(); }, 800);			
				//debug
				//deixa a instancia do voter global
				w.voter = untyped voter;
			
			case "manager":
				#if manager
				manager = new ParedaoManagerView();
				w.manager = untyped manager;
				#end
		}		
		
	}
	
	
}