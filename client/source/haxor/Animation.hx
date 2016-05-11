package haxor;


/**
 * Classe que implementa animações via script. Utiliza a classe 'Activity' como task manager.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
@:native("haxor.Animation")
extern class Animation
{	
	/**
	 * Adiciona uma animação.
	 * @param	p_target
	 * @param	p_property
	 * @param	p_value
	 * @param	p_duration
	 * @param	p_delay
	 * @param	p_easing
	 * @param	p_run_on_background = true
	 * @return
	 */
	static public function Add(p_target : Dynamic, p_property : String, p_value : Dynamic, p_duration:Float = 0.3, p_delay:Float = 0, p_easing:Float->Float = null, p_run_on_background : Bool = true) : Animation;
	
	/**
	 * Limpa as animações executando seguindo os critérios. Caso nenhum seja especificado, todas as animações serão interrompidas.
	 * @param	p_target
	 * @param	p_property
	 * @param	p_ignore_list
	 */
	static public function Clear(p_target:Dynamic=null,p_property:String="",p_ignore_list:Array<Animation>=null):Void;
		
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
	
	/**
	 * Elemento sendo animado.
	 */
	public var target : Dynamic;
	
	/**
	 * Properiedade alvo.
	 */
	public var property : String;
	
	/**
	 * Valor alvo da propriedade.
	 */
	public var value : Dynamic;
	
	
}