package globo.services;
import globo.model.ParedaoModel;
import globo.model.ParedaoServerModel;
import haxe.Json;
import js.Error;
import nodejs.mongodb.MongoCollection;
import nodejs.mongodb.MongoOption.MongoCollectionFetchOption;
import nws.service.BaseService;



/**
 * Webservice que lista os paredões disponíveis.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoCreate extends ParedaoMongoService
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
		var pd : ParedaoModel = cast { };
		pd.name1 	= d.name1;
		pd.name2 	= d.name2;
		pd.votes0 	= [];		
		pd.votes1 	= [];
		pd.start  	= cast (Date.now().getTime());
		pd.duration = d.duration;
		
		try
		{				
			paredoes.insert(pd);
		}
		catch (c_err :Error)
		{
			trace("ParedaoCreate> " + c_err);
			res = "false";
		}
		
		trace("ParedaoCreate> Inserting ["+pd.name1+","+pd.name2+"] res["+res+"]");
		
		session.response.write(res);
		session.response.end();		
	}
	
	
}