export type HostedAs = "pod" | "tab";
export type Screens = "Ticket" | "Company" | "Contact" | "SalesOrder";
export type Id = string | number;

export type ScreenObject = {
  hostedAs: HostedAs;
  id: Id;
  screen: Screens;
};

export type EventCallbackData = {
  onSuccess: () => void;
  onFailure: (errors: string[]) => void;
  screenObject: ScreenObject;
};

export type EventHandler = {
  event: "beforeSave" | "onLoad";
  callback: (event: EventCallbackData) => void;
};

type EventHandlers = {
  eventHandlers: EventHandler[];
};

type MemberAuthenticationData = {
  site: string;
  companyId: string;
  memberId: string;
  memberHash: string;
  memberContext: string;
  memberEmail: string;
};

export class ConnectWiseHostedAPI {
  private static version = "1.0";
  private _debug = false;
  private _origin: string | null = null;
  private _frameID: string | null = null;
  private _callbacks: { [key: string]: ((data: any) => void) | null } = {};

  constructor(origin: string, handlers: EventHandlers, debug = false) {
    if (window === parent) {
      this.log("No parent to send messages to or receive messages from");
      return;
    }

    this._debug = debug;
    this._origin = origin;

    this.registerHandlers(handlers);

    window.addEventListener("message", (e) => this.messageReceiver(e), false);

    this.ready();
  }

  private registerHandlers(handlers: EventHandlers) {
    if (handlers === null) {
      return;
    }

    this.validateHandlers(handlers);

    handlers.eventHandlers.forEach((handler) => {
      this.log(`registering handler ${handler.event}`);
      this._callbacks[handler.event] = handler.callback;
    });
  }

  private validateHandlers(handlers: EventHandlers) {
    if (!handlers.eventHandlers) {
      throw new Error("ConnectWiseHostedAPI: invalid handler format!");
    }
  }

  private messageReceiver(e: MessageEvent) {
    this.log(`received message ${e.data}`);
    const json = JSON.parse(e.data);

    if (json.MessageFrameID) {
      this.log(`setting frameID to ${json.MessageFrameID}`);
      this._frameID = json.MessageFrameID;
      return;
    }

    if (json.response) {
      if (this._callbacks[json.response] !== null) {
        this._callbacks[json.response]!(json.data);
        this._callbacks[json.response] = null;
      }
      return;
    }

    if (json.event && this._callbacks[json.event]) {
      json.data.onSuccess = () => {
        this._postMessage({
          event: json.event,
          _id: json._id,
          result: "success",
        });
      };

      json.data.onFailure = (data: any) => {
        this._postMessage({
          event: json.event,
          _id: json._id,
          result: "failure",
          errors: data,
        });
      };

      this._callbacks[json.event]!(json.data);
    } else {
      this._postMessage({
        event: json.event,
        _id: json._id,
        result: "success",
      });
    }
  }

  private ready() {
    this._postMessage({ message: "ready" });
  }

  public setDirty() {
    this._postMessage({ request: "setDirty", args: { dirty: true } });
  }

  public getMemberAuthentication(
    callback: (data: MemberAuthenticationData) => void,
  ) {
    this.post({ request: "getMemberAuthentication" }, callback);
  }

  public refreshScreen() {
    this._postMessage({ request: "refreshScreen" });
  }

  public post(message: any, callback?: (data: any) => void) {
    if (typeof callback !== "undefined") {
      this._callbacks[message.request.toLowerCase()] = callback;
    }

    message.hosted_request = message.request;
    message.request = undefined;

    this._postMessage(message);
  }

  private _postMessage(message: any) {
    if (this._frameID != null) {
      message.frameID = this._frameID;
    }

    this.log(`posting message ${JSON.stringify(message)}`);
    parent.postMessage(JSON.stringify(message), this._origin ?? "");
  }

  private log(msg: string) {
    if (this._debug) {
      console.log(`ConnectWiseHostedAPI: ${msg}`);
    }
  }
}
