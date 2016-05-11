package globo.services;
import globo.model.ParedaoModel;
import globo.model.ParedaoServerModel;
import haxe.Json;
import js.Error;
import nodejs.mongodb.MongoCollection;
import nodejs.mongodb.MongoOption.MongoCollectionFetchOption;
import nodejs.mongodb.ObjectID;
import nws.service.BaseService;



/**
 * Webservice que destroi um paredão
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoDelete extends ParedaoMongoService
{

	public var paredoes : MongoCollection;
	
	/**
	 * DB ready.
	 */
	override public function OnMongoReady():Void 
	{
		database.collection("events",OnEventsLoad);
	}
	
	/**
	 * Callback chamado quando a lista de paredoes foi recuperada.
	 * @param	p_err
	 * @param	p_collection
	 */
	private function OnEventsLoad(p_err:Error,p_collection : MongoCollection):Void
	{
		if (p_err != null) 
		{
			session.response.write("false");
			session.response.end();
			OnError(p_err); return;
		}
		var c : MongoCollection = paredoes = p_collection;		
				
		var res : String = "true";
		var d : Dynamic = Json.parse(session.data.json);		
		
		var oid : Dynamic = new ObjectID(d.id);
		
		try
		{	
			paredoes.remove({"_id": oid });
		}
		catch (c_err :Error)
		{
			trace("ParedaoDelete> OnEventsLoad " + c_err);
			res = "false";
		}
		
		trace("ParedaoCreate> Removing ["+d.id+"] res["+res+"]");
		
		session.response.write(res);
		session.response.end();		
	}
	
}