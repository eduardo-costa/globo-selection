package globo.model;
import haxe.Json;
import js.Error;
import nodejs.fs.File;

/**
 * Classe model com os dados de configuração.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoServerModel
{

	/**
	 * Porta de conexão do webservice.
	 */
	static public var port : Int = 9000;
		
	/**
	 * URL do servidor mongo.
	 */
	static public var mongoURL : String = "mongodb://52.24.71.71:2700/paredao";
	
	/**
	 * URL para verificação do recaptcha
	 */
	static public var recapcthaURL : String = "https://www.google.com/recaptcha/api/siteverify";
	
	/**
	 * Retorna o hash do recaptcha para 'localhost' ou servidor online
	 * @param	p_is_online
	 * @return
	 */
	static public function GetRecaptchaSecret(p_is_online:Bool) : String
	{								 
		if (p_is_online) return "6LfoAAcTAAAAACvCsIcJ7RT2wsBKL8LQesfKErd8";
		return "6LfM4fwSAAAAALKHyL_TnNOHs-f-Gce51YWYUnZq";
	}
			
	/**
	 * Carrega o arquivo config.json
	 */
	static public function LoadConfig():Void
	{
		var mdl : Dynamic = { };		
		
		var str : String = "";
		try						{ str = File.readFileSync("./config.json"); }
		catch (p_err : Error)	{ str = ""; }
		
		if (str == "")
		{
			trace("ParedaoModel> config.json not found.");
			return;
		}
		else
		{
			trace("ParedaoModel> config.json found.");
			mdl = Json.parse(str);			
		}		
		if (mdl.port != null) port = mdl.port;
		if (mdl.mongoURL != null) mongoURL = mdl.mongoURL;		
	}
	
}