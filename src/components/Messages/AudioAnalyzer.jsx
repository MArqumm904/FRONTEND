
import { useEffect, useRef } from "react"

export default function AudioAnalyzer({ isRecording, onAnalyzerData }) {
  const analyzerRef = useRef(null)
  const dataArrayRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const analyzer = audioContext.createAnalyser()
          const microphone = audioContext.createMediaStreamSource(stream)

          analyzer.fftSize = 256
          const bufferLength = analyzer.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)

          microphone.connect(analyzer)
          analyzerRef.current = analyzer
          dataArrayRef.current = dataArray

          const updateAnalyzer = () => {
            if (analyzerRef.current && dataArrayRef.current) {
              analyzerRef.current.getByteFrequencyData(dataArrayRef.current)
              onAnalyzerData(dataArrayRef.current)
              animationRef.current = requestAnimationFrame(updateAnalyzer)
            }
          }

          updateAnalyzer()
        })
        .catch((err) => console.error("Error accessing microphone:", err))
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRecording, onAnalyzerData])

  return null
}
