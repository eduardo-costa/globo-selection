package nodejs.http;
import nodejs.NodeJS;
import js.html.ArrayBufferView;
import nodejs.events.EventEmitter;

/**
 * Enum with the events supported by the Server class.
 */
class ServerEvent
{
	/**
	 * Emitted when the server has been bound after calling server.listen.
	 */
	static public var Listening : String = "listening";
	
	/**
	 * Emitted when a new connection is made. socket is an instance of net.Socket.
	 */
	static public var Connection : String = "connection";
	
	/**
	 * Emitted when the server closes. Note that if connections exist, this event is not emitted until all connections are ended. 
	 */
	static public var Close : String = "close";
	
	/**
	 * Emitted when an error occurs. The 'close' event will be called directly following this event. See example in discussion of server.listen.
	 */
	static public var Error : String = "error";
}

/**
 * HTTP Server EventEmitter. This class is used to create a TCP or UNIX server.
 * @author Eduardo Pons - eduardo@thelaborat.org
 */
extern class Server extends EventEmitter
{	
	
	/**
	 * Limits maximum incoming headers count, equal to 1000 by default. If set to 0 - no limit will be applied.
	 */
	var maxHeadersCount : Int;
	
	/**
	 * Begin accepting connections on the specified port and hostname. If the hostname is omitted, the server will accept connections directed to any IPv4 address (INADDR_ANY).
	 * To listen to a unix socket, supply a filename instead of port and hostname.
	 * Backlog is the maximum length of the queue of pending connections. The actual length will be determined by your OS through sysctl settings such as tcp_max_syn_backlog and somaxconn on linux.
	 * The default value of this parameter is 511 (not 512).
	 * This function is asynchronous. The last parameter callback will be added as a listener for the 'listening' event. See also net.Server.listen(port).
	 */
	@:overload( function (handle : Dynamic):Void { })
	@:overload( function (handle : Dynamic, on_listening_callback : Dynamic):Void { })
	@:overload( function (path : String):Void { })
	@:overload( function (path : String, on_listening_callback : Dynamic):Void { })
	@:overload( function (port : Int):Void { })
	@:overload( function (port : Int, hostname:String):Void { })
	@:overload( function (port : Int, hostname:String, backlog:Int):Void { })
	function listen(port : Int, hostname : String, backlog : Int, on_listening_callback : Dynamic) : Void;
	
}