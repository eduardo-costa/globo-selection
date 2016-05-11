package globo.services;
import globo.model.ParedaoModel;
import globo.model.ParedaoServerModel;
import haxe.Json;
import js.Error;
import nodejs.mongodb.MongoCollection;
import nodejs.mongodb.MongoOption.MongoCollectionFetchOption;
import nodejs.mongodb.ObjectID;
import nodejs.request.Request;
import nws.service.BaseService;



/**
 * Webservice que processa uma requisição de voto.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoVote extends ParedaoMongoService
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
			OnError(p_err); 
			return; 			
		}
		
		if (session.data != null)
		{			
			var d : Dynamic 	= Json.parse(session.data.json);				
			var oid : Dynamic 	= null;
			
			trace("ParedaoVote> Adding Vote to [" + d.id + "]");
			trace("ParedaoVote> Payload");
			trace(d);
			
			try
			{
				oid = new ObjectID(d.id);
			}
			catch (err:Error)
			{
				OnError(err);
				session.response.write("false");
				session.response.end();	
				return;
			}
			
			p_collection.find({_id:oid}).toArray(function(f_err:Error, p_list:Array<ParedaoModel>)
			{
				if (f_err != null) { OnError(p_err); return; }	
				if (p_list.length <= 0)
				{
					session.response.write("false");
					session.response.end();	
					return;
				}
				var d : Dynamic = Json.parse(session.data.json);
				var vote_id 			: Int		= d.vote;
				var captcha_response 	: String 	= d.response;
				var captcha_id 			: String 	= d.captcha;
				
				var recaptcha_data : RecaptchaServerModel = cast { };
				
				
				recaptcha_data.secret   = ParedaoServerModel.GetRecaptchaSecret(d.online);
				recaptcha_data.response = captcha_response;
				
				var req_data : Dynamic =
				{
					url:  ParedaoServerModel.recapcthaURL,
					form: recaptcha_data
				};
				
				//request.post({url:'http://service.com/upload', form: {key:'value'}}, function(err,httpResponse,body){ /* ... */ })
				
				trace("ParedaoVote> vote_id[" + vote_id + "] captcha["+captcha_id+"] captcha-response["+captcha_response+"]");		
				
				//Requisita confirmação do serviço de recaptcha
				Request.post(req_data, function(p_req_err:Error, p_response:Dynamic, p_body:String)
				{	
					if (p_req_err != null)
					{
						trace("ParedaoVote> Recaptcha Error");
						trace(p_req_err);
						session.response.write("false");
						session.response.end();
						return;
					}
					
					trace("ParedaoVote> Recaptcha result");
					trace("Status: " + p_response.statusCode);
					
					if (p_response.statusCode == 200) 
					{						
						var result : Dynamic = Json.parse(p_body);
						
						trace(result);
						
						if (result.success)
						{
							WriteVote(p_collection, vote_id, p_list[0], oid);							
						}
						else
						{
							session.response.write("false");
							session.response.end();
						}						
					}
				});
				
			});
		}
		else
		{
			session.response.write("false");
			session.response.end();					
		}
	}
	
	/**
	 * Escreve o voto.
	 */
	public function WriteVote(p_collection : MongoCollection,p_vote_id:Int,p_paredao:ParedaoModel,p_paredao_id : ObjectID):Void
	{
		var pm : ParedaoModel = p_paredao;
		
		var oid : Dynamic = new ObjectID(pm._id);
		
		var vd : ParedaoVoteModel = cast { };				
		vd.date = cast Date.now().getTime();
		vd.from = session.request.socket.remoteAddress + ":" + session.request.socket.remotePort;
		vd.to   = p_vote_id;		
		var remain:Int = GetRemainTime(pm);				
		//Se o tempo se esgotou não processa o voto
		if (remain <= 0)
		{
			session.response.write("false");
			session.response.end();
			return;
		}
		if (p_vote_id == 1) pm.votes0.push(vd);
		else
		if (p_vote_id == 2) pm.votes1.push(vd);				
		p_collection.update( { _id: p_paredao_id }, pm);			
		session.response.write("true");
		session.response.end();
	}
	
}