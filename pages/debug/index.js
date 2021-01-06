import React from "react";
import io from 'socket.io-client';

import {
  ROOM_DEBUG,
  EVENT_NOTIFY_LOAD_INLET_FACES,
  EVENT_NOTIFY_SAVE_INLET_FACES,
} from "../../common/constants";


// ServerAppへメッセージを送るためのページ
export default function DebugPage() {
  const loadInletFacesButtonRef = React.useRef();
  const saveInletFacesButtonRef = React.useRef();
  React.useEffect(() => {
    const room = ROOM_DEBUG;
    const options = {
      query: {
        room,
      },
    };
    const socket = io(options);

    loadInletFacesButtonRef.current.addEventListener("click", () => {
      socket.emit(EVENT_NOTIFY_LOAD_INLET_FACES, {});
    });
    saveInletFacesButtonRef.current.addEventListener("click", () => {
      socket.emit(EVENT_NOTIFY_SAVE_INLET_FACES, {});
    });
    return () => {
      socket.close();
    };
  });
  return (
    <>
      <h2>Debug Page</h2>
      <button ref={loadInletFacesButtonRef}>load inlet faces</button>
      <button ref={saveInletFacesButtonRef}>save inlet faces</button>
    </>
  );
}