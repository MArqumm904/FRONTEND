import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import WaveSurfer from "wavesurfer.js"

export default function VoiceMessage({ audioUrl, duration, isOwn }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration)
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      console.log("ayaa anadrr");
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isOwn ? "#ffffff" : "#0017E7",
        progressColor: isOwn ? "#ffffff80" : "#0017E780",
        height: 30,
        barWidth: 2,
        barGap: 1,
        responsive: true,
        normalize: true,
        cursorWidth: 0,
        barRadius: 2,
        partialRender: true
      })

      wavesurfer.current.load(audioUrl)

      wavesurfer.current.on("ready", () => {
        // Update duration when audio is loaded
        setTotalDuration(Math.floor(wavesurfer.current.getDuration()))
      })

      wavesurfer.current.on("play", () => setIsPlaying(true))
      wavesurfer.current.on("pause", () => setIsPlaying(false))
      wavesurfer.current.on("finish", () => setIsPlaying(false))
      wavesurfer.current.on("audioprocess", () => {
        setCurrentTime(Math.floor(wavesurfer.current.getCurrentTime()))
      })

      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy()
        }
      }
    }
  }, [audioUrl, isOwn])

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`flex items-center space-x-3 px-4 py-3 rounded-2xl max-w-xs ${
        isOwn ? "bg-[#0017E7] text-white" : "bg-gray-200 text-gray-900"
      }`}
    >
      <button
        onClick={togglePlayPause}
        className={`p-2 rounded-full ${isOwn ? "bg-white/20 text-white" : "bg-[#0017E7] text-white"}`}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div ref={waveformRef} className="w-full" />
      </div>

      <span className={`text-xs ${isOwn ? "text-white/80" : "text-gray-600"}`}>
        {formatTime(isPlaying ? currentTime : totalDuration)}
      </span>
    </div>
  )
}