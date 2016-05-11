package haxor;

/**
 * ...
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
@:native("haxor.Time")
extern class Time
{

	/**
	 * Tempo total de execução do script.
	 */
	static public var elapsed : Float;
	
	/**
	 * Tempo entre atualizações.
	 */
	static public var delta : Float;
	
}