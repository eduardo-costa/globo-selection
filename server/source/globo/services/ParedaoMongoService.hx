package globo.services;

import globo.model.ParedaoModel;
import globo.model.ParedaoModel.ParedaoVoteModel;
import globo.model.ParedaoServerModel;
import nws.service.MongoService;

/**
 * Classe base para os webservices do Paredao.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
class ParedaoMongoService extends MongoService
{

	/**
	 * Inicializa o serviço;
	 */
	override public function OnInitialize():Void 
	{
		super.OnInitialize();
		url = ParedaoServerModel.mongoURL;
	}
	
	/**
	 * Calcula os votos/hora.
	 * @param	p_list
	 * @return
	 */
	public function GetVPH(p_list:Array<ParedaoVoteModel>):Int
	{
		if (p_list.length <= 1) return 0;			
		var count : Int = 0;
		var vph : Int = 0;
		//Tempo discorrido entre o primeiro voto e o último.
		var elapsed: Int = p_list[p_list.length - 1].date - p_list[0].date;
		//Conversão para horas.
		var ms_hour : Int = cast (60.0 * 60.0 * 1000.0);
		elapsed = cast (elapsed / ms_hour);	
		//Retorna Votos / Hora
		return Math.floor(p_list.length / elapsed);		
	}
	
	/**
	 * Retorna o tempo restante em segundos.
	 * @param	p_paredao
	 * @return
	 */
	public function GetRemainTime(p_paredao : ParedaoModel):Int	
	{
		var pm : ParedaoModel = p_paredao;
		var dt0 : Date = Date.fromTime(pm.start);
		var dt1 : Date = cast Date.now();			
		var diff : Int = cast (untyped (dt1 - dt0));
		var dur  : Int = cast (((pm.duration * 60.0) * 60.0)*1000.0);
		return cast Math.max(0,Math.floor((dur - diff) * 0.001));
	}
	
}