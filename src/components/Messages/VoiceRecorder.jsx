import { useState, useRef, useEffect } from "react"
import { ReactMic } from "react-mic"
import { Mic, Square, Play, Pause, SendHorizontal } from "lucide-react"
import WaveSurfer from "wavesurfer.js"

export default function VoiceRecorder({ onSendVoiceMessage }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  const intervalRef = useRef(null)

  const startRecording = () => {
    setIsRecording(true)
    setRecordedBlob(null)
    setDuration(0)
    setCurrentTime(0)

    intervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const onData = (recordedData) => {
    // This function receives the audio data while recording
  }

  const onStop = (recordedData) => {
    setRecordedBlob(recordedData)
  }

  useEffect(() => {
    if (recordedBlob && waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#0017E7",
        progressColor: "#0017E780",
        height: 30,
        barWidth: 2,
        barGap: 1,
        responsive: true,
        normalize: true,
        cursorWidth: 0,
        barRadius: 2
      })

      wavesurfer.current.load(recordedBlob.blobURL)

      wavesurfer.current.on("audioprocess", () => {
        if (wavesurfer.current) {
          setCurrentTime(Math.floor(wavesurfer.current.getCurrentTime()))
        }
      })

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy()
        }
      }
    }
  }, [recordedBlob])

  const playRecording = () => {
    if (wavesurfer.current) {
      wavesurfer.current.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
    if (wavesurfer.current) {
      wavesurfer.current.pause()
      setIsPlaying(false)
    }
  }

  const sendVoiceMessage = () => {
    if (recordedBlob) {
      // Get actual duration from the audio file
      const actualDuration = wavesurfer.current ? Math.floor(wavesurfer.current.getDuration()) : duration
      onSendVoiceMessage(recordedBlob, actualDuration)
      setRecordedBlob(null)
      setDuration(0)
      setCurrentTime(0)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (wavesurfer.current) {
        wavesurfer.current.destroy()
      }
    }
  }, [])

  if (recordedBlob) {
    return (
      <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 w-full">
        <button
          onClick={isPlaying ? pauseRecording : playRecording}
          className="p-2 rounded-full bg-[#0017E7] text-white"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div ref={waveformRef} className="w-full" />
        </div>
        
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {formatTime(isPlaying ? currentTime : duration)}
        </span>
        
        <button 
          onClick={sendVoiceMessage} 
          className="p-2 rounded-full bg-[#0017E7] text-white"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => {
            setRecordedBlob(null)
            setDuration(0)
            setCurrentTime(0)
          }}
          className="p-2 rounded-full bg-gray-500 text-white"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 w-full">
      <ReactMic
        record={isRecording}
        className="hidden"
        onStop={onStop}
        onData={onData}
        strokeColor="#0017E7"
        backgroundColor="#f3f4f6"
        mimeType="audio/webm"
      />

      {isRecording ? (
        <div className="flex items-center space-x-2 bg-red-100 rounded-full px-4 py-2 w-full">
          <button 
            onClick={stopRecording} 
            className="p-2 rounded-full bg-red-500 text-white animate-pulse"
          >
            <Square className="w-4 h-4" />
          </button>
          <div className="flex-1 h-8 flex items-center">
            <div className="w-full h-4 bg-red-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(duration % 10) * 10}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-red-600 whitespace-nowrap">
            {formatTime(duration)}
          </span>
        </div>
      ) : (
        <button 
          onClick={startRecording} 
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Mic className="w-5 h-5 text-[#0017E7]" />
        </button>
      )}
    </div>
  )
}