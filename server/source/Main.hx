package;
import globo.model.ParedaoServerModel;
import globo.services.ParedaoCreate;
import globo.services.ParedaoDelete;
import globo.services.ParedaoList;
import globo.services.ParedaoVote;
import haxe.Json;
import js.html.Event;
import nodejs.fs.File;
import nodejs.NodeJS;
import nodejs.Process.ProcessEventType;
import nws.net.HTTPServiceManager;

/**
 * Classe principal.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class Main
{

	/**
	 * Referência para o HTTP server.
	 */
	static var http : HTTPServiceManager;
	
	/**
	 * Entry point
	 */
	static function main():Void
	{
		trace("ParedaoVoter> Init.");
				
		//carrega configurações do config.json
		ParedaoServerModel.LoadConfig();
				
		trace("Process> Starting Daemon @ "+ParedaoServerModel.port);		
		http = HTTPServiceManager.Create(ParedaoServerModel.port);
		
		http.verbose = 0;
		
		//Check args for [-vvv...] and set the level of verbose.
		for (a in NodeJS.process.argv) if (a.indexOf("-v") >= 0) http.verbose = a.length - 1;
		
		
		http.Add("/paredao/list/", ParedaoList);
		http.Add("/paredao/create/", ParedaoCreate);
		http.Add("/paredao/delete/", ParedaoDelete);
		http.Add("/paredao/vote/", ParedaoVote);
		
		trace("Process> Verbose Level ["+http.verbose+"]");		
		NodeJS.process.on(ProcessEventType.Exception, OnError);	
	}
	
	static function OnError(p_error:Event):Void
	{
		trace("Process> [error] Uncaught[" + p_error + "]");
	}
	
	
}