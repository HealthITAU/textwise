// @ts-nocheck
export const ConnectWiseHostedAPI = (() => {
	var version = "1.0";

	var _debug;
	var _origin;
	var _frameID;
	var _self;

	var _callbacks = {};

	/**
	 * constructor
	 * @param {origin} domain of the iframe
	 * @param {handlers} collection of event handlers in the format
	 *	{
	 *	"eventHandlers" :[
	 *		{"event": "onLoad", "callback" : function}
	 *		]
	 *	}
	 * @param {boolean} true to set debug mode on
	 */
	var connectWiseHostedAPIConstructor =
		function ConnectWiseHostedAPIConstructor(origin, handlers, debug) {
			if (false == this instanceof ConnectWiseHostedAPI) {
				return new ConnectWiseHostedAPI();
			}

			// guard
			if (window === parent) {
				log("No parent to send messages to or receive messages from");
				return;
			}

			if (window === undefined) {
				log("No window to send messages to or receive messages from");
				return;
			}

			_self = this;
			_debug = debug;
			_origin = origin;

			// register event handlers
			registerHandlers(handlers);

			// callback listener
			window.addEventListener(
				"message",
				(e) => {
					messageReceiver(e);
				},
				false,
			);

			ready();
		};

	function registerHandlers(handlers) {
		if (handlers === null) {
			return;
		}

		console.log("HostedApi registerHandlers ", handlers);

		validateHandlers(handlers);

		handlers.eventHandlers.forEach(function register(handler) {
			_callbacks[handler.event + ""] = handler.callback;
		});
	}

	function validateHandlers(handlers) {
		log("handlers " + handlers);
		if (!handlers.eventHandlers) {
			throw new exception("invalid handler format!");
		}
	}

	// private methods
	function messageReceiver(e) {
		log("received message " + e.data);
		var json = JSON.parse(e.data);

		if (json.MessageFrameID) {
			log("setting frameID to " + json.MessageFrameID);
			_self._frameID = json.MessageFrameID;
			return;
		}

		if (json.response) {
			if (_callbacks[json.response] !== null) {
				_callbacks[json.response](json.data);
				_callbacks[json.response] = null;
			}
			return;
		}

		if (json.event && _callbacks[json.event]) {
			json.data.onSuccess = () => {
				_self._postMessage({
					event: json.event,
					_id: json._id,
					result: "success",
				});
			};

			json.data.onFailure = (data) => {
				_self._postMessage({
					event: json.event,
					_id: json._id,
					result: "failure",
					errors: data,
				});
			};

			_callbacks[json.event](json.data);
		} else {
			_self._postMessage({
				event: json.event,
				_id: json._id,
				result: "success",
			});
		}
	}

	function ready() {
		_self._postMessage({ message: "ready" });
	}

	connectWiseHostedAPIConstructor.prototype.post = (message, callback) => {
		if (typeof callback !== "undefined") {
			_callbacks[message.request.toLowerCase() + ""] = callback;
		}

		// need to pre-pend hosted_ to request to avoid confusion with vendor hosted api.
		message.hosted_request = message.request;
		delete message.request;

		_self._postMessage(message);
	};

	connectWiseHostedAPIConstructor.prototype._postMessage = function (message) {
		if (this._frameID != null) {
			message["frameID"] = this._frameID;
		}

		log("posting message " + JSON.stringify(message));
		parent.postMessage(JSON.stringify(message), _origin);
	};

	function log(msg) {
		if (_debug == true) {
			console.log("ConnectWiseHostedAPI: " + msg);
		}
	}

	return connectWiseHostedAPIConstructor;
})();
