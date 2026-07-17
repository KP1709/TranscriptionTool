import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { RealtimeTranscriptionProvider } from "@speechmatics/real-time-client-react";
import { PCMAudioRecorderProvider } from "@speechmatics/browser-audio-input-react";
import workletScriptURL from "@speechmatics/browser-audio-input/pcm-audio-worklet.min.js?url";
const audioContext = new AudioContext({ sampleRate: 16000 });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RealtimeTranscriptionProvider>
      <PCMAudioRecorderProvider workletScriptURL={workletScriptURL} audioContext={audioContext}>
        <App />
      </PCMAudioRecorderProvider>
    </RealtimeTranscriptionProvider>
  </React.StrictMode>
);