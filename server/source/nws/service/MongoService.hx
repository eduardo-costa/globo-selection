package nws.service;
import js.Error;
import nodejs.mongodb.MongoClient;
import nodejs.mongodb.MongoDatabase;
import nodejs.mongodb.MongoOption;
import nodejs.mongodb.MongoServer;
import nws.service.BaseService;

/**
 * Classe que implementa serviços que usarão a conexão ao mongodb.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class MongoService extends BaseService
{
	
	/**
	 * Referência para estruturas mongo.
	 */
	static var db 	 : MongoDatabase;
	
	/**
	 * Referencia para o banco de dados conectado.
	 */
	public var database(get, never):MongoDatabase;
	private function get_database():MongoDatabase { return db; }
	
	/**
	 * URL do banco de dados.
	 */
	public var url : String;
	
	/**
	 * Inicialização.
	 */
	override public function OnInitialize():Void 
	{		
		persistent = true;		
	}
	
	/**
	 * Executa o webservice.
	 */
	override public function OnExecute():Void 
	{
		//caso o DB não exista, irá conectar com o mongo
		if (db == null)
		{
			MongoClient.connect(url, OnMongoConnect);
		}
		else
		{
			OnMongoReady();
		}
	}
	
	/**
	 * Callback chamado quando o mongo conectou e possui o DB.
	 */
	public function OnMongoReady():Void { }
	

	/**
	 * Callback de conexão no banco de dados.
	 * @param	p_err
	 * @param	p_db
	 */
	private function OnMongoConnect(p_err : Error, p_db : MongoDatabase):Void
	{		
		if (p_err != null)
		{
			OnError(p_err);
		}
		else
		{
			trace("MongoService> DB Connected!");
			db = p_db;
			OnMongoReady();
		}
	}
	
	/**
	 * Callback chamado quando ocorre algum erro.
	 * @param	p_error
	 */
	override public function OnError(p_error:Dynamic):Void 
	{
		var tn : String = Type.getClassName(Type.getClass(this));
		var tl : Array<String> = tn.split(".");
		trace(tl[tl.length-1]+"> "+p_error);
	}
	
}