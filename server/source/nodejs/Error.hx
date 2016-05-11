package nodejs;

/**
 * Error class (probably)
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
@:native("Error")
extern class Error
{
	/**
	 * 
	 * @param	msg
	 */
	function new(msg:String):Void;
	
}