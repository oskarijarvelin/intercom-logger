# Changes Summary

## 1. Reversed Log Order

**What changed:** Message log now displays newest messages at the top instead of at the bottom.

**How to test:**
1. Start the application: `npm run dev`
2. Open http://localhost:3000 in a browser (Chrome recommended for Web Speech API support)
3. Click the blue microphone button to start recording
4. Speak multiple phrases in Finnish (the app is configured for Finnish language)
5. Observe that each new transcribed message appears at the **top** of the message log
6. Verify timestamps show newest messages have later times

**Code change:** Line 75 in `app/views/HomeView.tsx`
```typescript
// Before:
setMessageLog(prev => [...prev, { text: transcript, timestamp }]);

// After:
setMessageLog(prev => [{ text: transcript, timestamp }, ...prev]);
```

## 2. Speech Recognition Freeze Prevention

**What was the problem:**
The Web Speech API can stop unexpectedly due to:
- No speech detected for a period (timeout)
- Network issues (API requires network connectivity)
- Audio capture problems
- Browser-imposed limits on continuous recognition

When this happens, the UI shows no indication - it just silently stops transcribing, creating a "freeze" appearance.

**What changed:** Added comprehensive error handling and auto-restart mechanism:

1. **Error Handler (`onerror`)**: Detects and logs errors, automatically restarts on recoverable errors
2. **End Handler (`onend`)**: Detects when recognition stops and automatically restarts if user hasn't manually stopped
3. **State Tracking**: Uses `shouldTranscribeRef` to reliably track intended transcription state
4. **Console Logging**: Provides visibility into when and why recognition stops/restarts

**How to test:**
1. Start the application and begin recording
2. Open browser console (F12) to see logging
3. Try these scenarios:
   - Stay silent for 30+ seconds - should see auto-restart logs
   - Speak continuously - recognition should keep running smoothly
   - Stop and start recording multiple times - should work reliably
4. Check console for messages like:
   - "Speech recognition ended" 
   - "Auto-restarting recognition..."
   - "Speech recognition error: [error type]"

**Code changes:** Lines 87-119 in `app/views/HomeView.tsx`
- Added `shouldTranscribeRef` to track transcription state
- Added `onerror` event handler with auto-restart logic
- Added `onend` event handler with auto-restart logic
- Updated `startTranscription` to set `shouldTranscribeRef.current = true`
- Updated `stopTranscription` to set `shouldTranscribeRef.current = false` before stopping

## Technical Details

### Why use a ref instead of state for auto-restart?
Event handlers like `onend` and `onerror` capture the state values at the time they were created. Using a ref ensures we always check the current transcription status, preventing race conditions where old event handlers might reference stale state.

### Which errors trigger auto-restart?
- `no-speech`: No speech detected for a period
- `audio-capture`: Issues with microphone access
- `network`: Network connectivity problems

Other errors (like `not-allowed` for permissions) do not trigger auto-restart as they require user action.

### Browser Compatibility
This application uses the Web Speech API which is primarily supported in Chrome/Edge. Firefox and Safari have limited or no support.
