package globo.model;

/**
 * Classe que descreve um voto do paredão.
 */
extern class ParedaoVoteModel
{
	/**
	 * Origem do voto (IP)
	 */
	var from : String;
	/**
	 * Jogador que ganhou o voto.
	 */
	var to : Int;
	/**
	 * UTC seconds
	 */
	var date : Int;
	
}

/**
 * Classe que descreve um paredão.
 */
extern class ParedaoModel
{
	/**
	 * Id único do paredão.
	 */
	var _id : String;
	
	/**
	 * Nome dos participantes
	 */
	var name1 : String;
	var name2 : String;
	
	/**
	 * Lista de votos
	 */
	var votes0 : Array<ParedaoVoteModel>;
	var votes1 : Array<ParedaoVoteModel>;
	
	/**
	 * Tempos UTC em segundos do início do paredão.
	 */
	var start : Int;
	
	/**
	 * Tempos UTC em segundos da duração do paredão.
	 */
	var duration : Int;
}

/**
 * Classe que descreve os dados de listagem de um paredão.
 */
extern class ParedaoViewModel
{
	/**
	 * Id do paredão.
	 */
	var id : String;
	
	/**
	 * Nome do player 1
	 */
	var name1 : String;
	
	/**
	 * Nome do player 2
	 */
	var name2 : String;
	
	/**
	 * Número de votos do player 1
	 */
	var votes0 : Int;
	
	/**
	 * Número de votos do player 2
	 */
	var votes1 : Int;
	
	/**
	 * Votos por hora do player 1
	 */
	var vph1 : Int;
	
	/**
	 * Votos por hora do player 2
	 */
	var vph2 : Int;
	
	/**
	 * Tempo restante em segundos.
	 */
	var remain : Int;
	
	/**
	 * Tempo de início em segundos.
	 */
	var start : Int;
}

/**
 * Template de dados para ser enviado ao recaptcha.
 */
extern class RecaptchaServerModel
{
	/**
	 * hash do lado do servidor.
	 */
	var secret : String;
	
	/**
	 * resposta do usuário
	 */
	var response : String;
}
