# Transcription Tool

## ⌨️ Tech stack
React / Shadcn / Tailwind / Speechmatics / pnpm / Express (Backend) / Render (Backend)

## 🍼 Introduction
After working with my team to integrate AI note-taking into our web application, I wanted to explore other transcription services. I found Speechmatics and have produced a simple demo to explore its features.  
  
⚠️ This repo does not have a live demo attached due to using Speechmatics free tier, which has limits. If you're interested in running this code locally, you will need to create a Speechmatics account, generate an API key and inject it into the server code. To run the demo, run the server script alongside localhost from package.json.

## 🛠️ Features
- View speech-to-text transcription in real time
- Configure transcription settings
    -  Filter out filler words (disfluencies), e.g. um, err
    -  Display partial transcription (the words it thinks it has detected before adding to the main transcript)
    -  Adjust number of speakers, delays, speaker sensitivity and curse word (profanity) visibility
    -  Simple logging to show websocket messages and changes
- Speaker diarization - detecting when a speaker changes
    - Adjust speaker labels
- Mobile and desktop views
- 2-minute timer to prevent overrunning during development
- Microphone permission check before starting transcription
- Copy transcript into clipboard
- Save transcript as a markdown file, text file or json

## Speechmatics
The live transcription service uses websockets which means there is an open connection which sends messages (pings) to the server and receives messages (pongs) from the server.
The logic for recording, transcribing and detecting server messages are provided by the Speechmatics JS SDKs.

## Backend / Render
Express was used to create a small script to generate a JWT, which was injected into the frontend to start transcribing.  
This uses Speechmatics' auth library where the API key, transcription service type and time-to-live are set. 
The server code is available to run the app locally. To host the server code on Render, a separate repo exists. Environment variables are injected.

## 📚 Resources
- Speechmatics - https://www.speechmatics.com/
- Speechmatics documentation - https://docs.speechmatics.com/
- Speechmatics JS SDK documentation - https://github.com/speechmatics/speechmatics-js-sdk
- Render - https://render.com/ 

## 🤖 AI chats
ChatGPT helped set up the transcription service, including speaker diarization, integrating the JS SDKs and hosting the server code on Render. 
Here are some example chats. These were sometimes used as starting points to integrate into the current code
- https://chatgpt.com/s/t_6a52787b0ba48191be11f136f54074cd <-- Diagnosis
- https://chatgpt.com/s/t_6a529eb6b4708191b91ac477a140a819 <-- Speaker diarization
- https://chatgpt.com/s/t_6a529e9b8fbc81919372a62268f0c883 <-- Transcribing 
- https://chatgpt.com/s/t_6a529fbfcfe48191baa9670914743416 <-- Segments than transcript
- https://chatgpt.com/s/t_6a5543b56e688191889f2a754287dc46 <-- Changing name during transcription session
- https://chatgpt.com/s/t_6a55449115c88191ad470b1c1217a509 <-- Part 2
- https://chatgpt.com/s/t_6a55461f91f481919b30e58bc604bcf0 <-- Logging

