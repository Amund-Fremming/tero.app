import * as signalR from "@microsoft/signalr";
import React, { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { useModalProvider } from "./ModalProvider";
import { useNavigation } from "expo-router";
import Screen from "../constants/Screen";
import { ok, err, Result } from "../utils/result";
import { SpinGameState } from "@/src/SpinGame/constants/SpinTypes";
import { resetToHomeScreen } from "../utils/navigation";
import { useAuthProvider } from "./AuthProvider";
import { useGlobalSessionProvider } from "./GlobalSessionProvider";

interface IHubConnectionContext {
  connect: (hubAddress: string) => Promise<Result<signalR.HubConnection>>;
  disconnect: () => Promise<Result>;
  debugDisconnect: () => Promise<void>;
  setListener: <T>(channel: string, fn: (item: T) => void) => Result;
  invokeFunction: (functionName: string, ...params: any[]) => Promise<Result<any>>;
}

const defaultContextValue: IHubConnectionContext = {
  connect: async (_hubAddress: string) => err(""),
  disconnect: async () => err(""),
  debugDisconnect: async () => {},
  setListener: (_channel: string, _fn: (item: any) => void) => err(""),
  invokeFunction: async (_functionName: string, ..._params: any[]) => err(""),
};

const HubConnectionContext = createContext<IHubConnectionContext>(defaultContextValue);

export const useHubConnectionProvider = () => useContext(HubConnectionContext);

interface HubConnectionProviderProps {
  children: ReactNode;
}

export const HubConnectionProvider = ({ children }: HubConnectionProviderProps) => {
  const connectionRef = useRef<signalR.HubConnection | undefined>(undefined);
  const connectedStateRef = useRef<boolean>(false);
  const hubAddressRef = useRef<string | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const isReconnectingRef = useRef(false);
  const listenersRef = useRef<Map<string, (item: any) => void>>(new Map());

  const { gameKey, setIsHost } = useGlobalSessionProvider();
  const { displayLoadingModal, closeLoadingModal } = useModalProvider();
  const { pseudoId } = useAuthProvider();
  const navigation: any = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectionRef.current) return;

      if (connectedStateRef.current && !connectionRef.current && !isReconnectingRef.current) {
        handleConnectionLost();
        return;
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  const handleConnectionLost = async () => {
    if (isReconnectingRef.current || !hubAddressRef.current) return;

    isReconnectingRef.current = true;
    reconnectAttemptsRef.current = 0;

    displayLoadingModal(() => {
      console.log("Manual closing triggered");
      resetToHomeScreen(navigation);
      clearValues();
    });

    const reconnected = await attemptReconnect();

    if (reconnected) {
      closeLoadingModal();
      connectedStateRef.current = true;
      reconnectAttemptsRef.current = 0;
      isReconnectingRef.current = false;

      return;
    }

    clearValues();
    closeLoadingModal();
    resetToHomeScreen(navigation);
  };

  const attemptReconnect = async (): Promise<boolean> => {
    const maxAttempts = 5;
    const baseDelay = 1000;

    // TODO - this is a temp fix, should be handled on reconnect for the "host" listener in the game screen.
    setIsHost(false);

    if (!hubAddressRef.current) {
      console.error("Failed to reconnect to hub. Address is undefined");
      return false;
    }

    while (reconnectAttemptsRef.current < maxAttempts) {
      const delay = baseDelay * Math.pow(2, reconnectAttemptsRef.current);
      console.warn(`Reconnect attempt ${reconnectAttemptsRef.current + 1}/${maxAttempts} after ${delay}ms`);

      await new Promise((resolve) => setTimeout(resolve, delay));
      const result = await connect(hubAddressRef.current);

      if (result.isError()) {
        reconnectAttemptsRef.current++;
        console.debug("Reconnect error:", result.error);
        continue;
      }

      let invokeResult = await invokeFunction("ConnectToGroup", gameKey, pseudoId, true);
      if (invokeResult.isError()) {
        console.error("Failed to invoke reconnect function:", invokeResult.error);
        return false;
      }

      connectionRef.current = result.value;
      reattachListeners();
      console.info("Reconnected successfully");
      return true;
    }

    console.error("Failed to reconnect after max attempts");
    return false;
  };

  async function connect(hubAddress: string): Promise<Result<signalR.HubConnection>> {
    try {
      hubAddressRef.current = hubAddress;
      if (connectionRef.current) {
        const curHubName = (connectionRef.current as any)._hubName;
        const curHubId = (connectionRef.current as any)._hubId;

        if (curHubName !== hubAddress) {
          return err("Finnes allerede en åpen socket til feil hub. (HubConnectionProvider)");
        }

        return ok(connectionRef.current);
      }

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubAddress)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      (hubConnection as any)._hubName = hubAddress;

      await hubConnection.start();
      hubConnection.onclose(async () => {
        // If we were connected and this close was unexpected, trigger reconnection
        if (connectedStateRef.current && !isReconnectingRef.current) {
          connectionRef.current = undefined;
          await handleConnectionLost();
        } else {
          clearValues();
        }
      });

      connectionRef.current = hubConnection;
      connectedStateRef.current = true;

      console.info(`Established connection: ${hubAddress}`);
      return ok(hubConnection);
    } catch (error) {
      connectedStateRef.current = false;
      return err("En feil skjedde ved tilkoblingen. (HubConnectionProvider)");
    }
  }

  async function disconnect(): Promise<Result> {
    try {
      connectedStateRef.current = false;
      if (!connectionRef.current) {
        clearValues();
        return ok();
      }

      await connectionRef.current.stop();
      clearValues();

      console.info("Manually disconnected user");
      return ok();
    } catch (error) {
      clearValues();
      console.error("Failed to close down websocket");
      return err("Failed to close down websocket");
    }
  }

  async function debugDisconnect(): Promise<void> {
    try {
      if (!connectionRef.current) {
        console.warn("No connection to disconnect");
        return;
      }

      console.info("DEBUG: Forcing disconnect to test reconnection");
      // Just stop the connection - this will trigger onclose handler
      // which will detect it as unexpected and trigger reconnection
      await connectionRef.current.stop();
    } catch (error) {
      console.error("DEBUG: Failed to force disconnect", error);
    }
  }

  function setListener<T>(channel: string, fn: (item: T) => void): Result {
    try {
      if (!connectionRef.current) {
        return err("Ingen tilkobling opprettet. (HubConnectionProvider)");
      }

      // Store the listener for reconnection
      listenersRef.current.set(channel, fn);

      // Overwrite old listeners
      connectionRef.current.off(channel);
      connectionRef.current.on(channel, fn);

      return ok();
    } catch (error) {
      console.error("setListener");
      return err("Noe gikk galt.");
    }
  }

  async function invokeFunction(functionName: string, ...params: any[]): Promise<Result<any>> {
    try {
      if (!connectionRef?.current) {
        return err("Ingen tilkobling opprettet.");
      }

      let state: any = await connectionRef.current?.invoke(functionName, ...params);
      return ok(state);
    } catch (error) {
      console.error("invokeFunction", error);
      return err("Tilkoblingen ble butt");
    }
  }

  const reattachListeners = () => {
    if (!connectionRef.current) {
      console.warn("Cannot reattach listeners - no connection");
      return;
    }

    console.info(`Reattaching ${listenersRef.current.size} listeners after reconnection`);
    listenersRef.current.forEach((fn, channel) => {
      connectionRef.current!.off(channel);
      connectionRef.current!.on(channel, fn);
    });
  };

  const clearValues = () => {
    connectionRef.current = undefined;
    reconnectAttemptsRef.current = 0;
    isReconnectingRef.current = false;
    connectedStateRef.current = false;
    hubAddressRef.current = undefined;
    listenersRef.current.clear();
  };

  const value = {
    invokeFunction,
    setListener,
    connect,
    disconnect,
    debugDisconnect,
  };

  return <HubConnectionContext.Provider value={value}>{children}</HubConnectionContext.Provider>;
};

export default HubConnectionProvider;
