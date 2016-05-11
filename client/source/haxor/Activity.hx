package haxor;



/**
 * Classe que implementa um task runner rodando no loop de RequestAnimationFrame ou setInterval.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
@:native("haxor.Activity")
extern class Activity
{

	/**
	 * Inicia a execução.
	 */
	static public function Start():Void;
	
	/**
	 * Interrompe a execução.
	 */
	static public function Stop():Void;
	
	/**
	 * Limpa todos os processos executando.
	 */
	static public function Clear():Void;
	
	/**
	 * Adiciona um nodo de execução.
	 * @param	p_node
	 * @param	p_run_on_background
	 */
	static public function Add(p_node:Activity, p_run_on_background:Bool = true):Void;
	
	/**
	 * Remove o nodo da lista de execução.
	 * @param	p_node
	 */
	static public function Remove(p_node:Activity):Activity;
	
	/**
	 * Executa o callback por 'duration' segundos, esperando 'delay' segundos antes de começar.
	 * @param	p_callback
	 * @param	p_duration
	 * @param	p_delay
	 * @param	p_run_on_background
	 * @return
	 */
	static public function Run(p_callback : Activity->Void, p_duration:Float = 0xffffff, p_delay:Float = 0, p_run_on_background:Bool = true):Activity;
	
	/**
	 * Espera 'delay' segundos e executa o callback.
	 * @param	p_callback
	 * @param	p_delay
	 * @param	p_run_on_background
	 * @return
	 */
	static public function Delay(p_callback : Dynamic, p_delay:Float, p_run_on_background:Bool = true, p_args : Array<Dynamic> = null) : Activity;
	
	/**
	 * Espera 'delay' segundos e aplica o valor 'value' na propriedade 'property' de 'target'.
	 * @param	p_target
	 * @param	p_property
	 * @param	p_value
	 * @param	p_delay
	 * @param	p_run_on_background
	 * @return
	 */
	static public function Set(p_target : Dynamic, p_property : String, p_value : Dynamic, p_delay : Float, p_run_on_background:Bool = true):Activity;
	
	/**
	 * Itera assincronamente os elementos do array. Chamando o callback para cada visita.
	 * @param	p_callback
	 * @param	p_list
	 * @param	p_step
	 * @param	p_timeout
	 * @param	p_run_on_background
	 * @return
	 */
	static public function Iterate(p_callback : Dynamic->Int->Int, p_list : Array<Dynamic>, p_step:Int, p_timeout:Float=0xffffff, p_run_on_background:Bool = true):Activity;
	
	/**
	 * Tempo de execução.
	 */
	public var elapsed : Float;
	
	/**
	 * Progress de execução.
	 */
	public var progress : Float;
	
	/**
	 * Duração da execução.
	 */
	public var duration : Float;
	
	
}