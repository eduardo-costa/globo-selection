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
 * Webservice que lista os paredões disponíveis e seus dados.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoList extends ParedaoMongoService
{

	/**
	 * DB ready.
	 */
	override public function OnMongoReady():Void 
	{
		database.collection("events",OnListReady);
	}
	
	/**
	 * Callback chamado quando a lista de paredoes foi recuperada.
	 * @param	p_err
	 * @param	p_collection
	 */
	private function OnListReady(p_err:Error,p_collection : MongoCollection):Void
	{
		if (p_err != null) { OnError(p_err); return; }			
		
		//Se o id do paredão foi passado retorna apenas a instância encontrada.
		if (session.data != null)
		{
			var d : Dynamic = Json.parse(session.data.json);				
			var oid : Dynamic = null;
			
			trace("ParedaoList> Find by Id [" + d.id + "]");
			trace("ParedaoList> Payload");
			trace(d);
			
			try
			{
				oid = new ObjectID(d.id);
			}
			catch (err:Error)
			{
				session.response.write(Json.stringify("[]"));
				session.response.end();
				OnError(err);
				return;
			}
						
			p_collection.find({_id : oid }).toArray(OnListRead);
		}
		else
		{
			p_collection.find().toArray(OnListRead);					
		}
		
	}
	
	/**
	 * Callback chamado quando a coleção gera o array de elementos.
	 * @param	p_err
	 * @param	p_list
	 */
	private function OnListRead(p_err : Error, p_list : Array<ParedaoModel>):Void
	{
		if (p_err != null) { OnError(p_err); return; }		
		
		//Converte para o formato "model" usado nas views.
		var res : Array<ParedaoViewModel> = [];
		
		for (it in p_list)
		{
			var pm : ParedaoModel = it;
			var d : ParedaoViewModel = cast { };
			d.name1 = pm.name1;
			d.name2 = pm.name2;
			d.votes0 = pm.votes0.length;
			d.votes1 = pm.votes1.length;			
			d.vph1 = GetVPH(pm.votes0);
			d.vph2 = GetVPH(pm.votes1);			
						
			d.start  = pm.start;
			d.remain = GetRemainTime(pm);
			
			untyped d.current = Date.now().getTime();
			
			d.id = it._id;			
			res.push(d);
		}
		
		session.response.write(Json.stringify(res));
		session.response.end();
	}
	
	
}