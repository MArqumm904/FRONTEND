import profile from "../../assets/images/profile.png";
import send from "../../assets/images/send.png";
import Paper from "../../assets/images/file.png";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../firebase";
import {
  ref,
  onChildAdded,
  onValue,
  set,
  onDisconnect,
} from "firebase/database";
import {
  MoreVertical,
  Plus,
  Smile,
  Send,
  Mic,
  Shield,
  Trash2,
  Paperclip,
  ImageIcon,
  FileText,
  Camera,
  Ban,
  CirclePlus,
  SendHorizontal,
  CircleX,
  Clock,
  Pause,
  Play,
  ChevronLeft,
  LoaderCircle,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import PostCard from "./Post";
import Video from "./Video";
import TextPost from "./TextPost";
import Reel from "./Reel";
import Page from "./Page";
import Group from "./Group";
import { toast, ToastContainer } from "react-toastify";

export default function ChatArea({
  chat,
  onBack,
  forceScroll,
  setLastClearedAt,
  onClearChat,
}) {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const currentUserId = Number(localStorage.getItem("user_id"));
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  // const MAX_RECORDING_TIME = 10;
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const generateId = () => Math.floor(Math.random() * 1000000);
  const [friendOnline, setFriendOnline] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);
  const fileAnyInputRef = useRef(null);
  const docsInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // { file, preview?, name, size }
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileCaption, setFileCaption] = useState("");
  const filePreviewVideoRef = useRef(null);
  const [isFileVideoPlaying, setIsFileVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingIntervalRef = useRef(null);
  // Camera capture state
  const [showCameraModal, setShowCameraModal] = useState(false);
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const videoRecorderRef = useRef(null);
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = useState(0);
  const videoChunksRef = useRef([]);
  const timerRef = useRef(null);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentlyPlayingVoice, setCurrentlyPlayingVoice] = useState(null);
  const [isClearingChat, setIsClearingChat] = useState(false);
  const voiceAudioRefs = useRef({});

  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
      if (voiceUrl) {
        URL.revokeObjectURL(voiceUrl);
      }
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [voiceUrl]);

  const formatVoiceDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleVoicePlay = (msg) => {
    const audio = voiceAudioRefs.current[msg.id];
    if (!audio) return;

    if (currentlyPlayingVoice === msg.id) {
      audio.pause();
      setCurrentlyPlayingVoice(null);
    } else {
      // Pause any currently playing audio
      if (currentlyPlayingVoice) {
        const currentAudio = voiceAudioRefs.current[currentlyPlayingVoice];
        if (currentAudio) currentAudio.pause();
      }

      audio
        .play()
        .then(() => setCurrentlyPlayingVoice(msg.id))
        .catch((err) => console.error("Playback failed:", err));
    }
  };

  const handleVoiceEnd = (id) => {
    if (currentlyPlayingVoice === id) {
      setCurrentlyPlayingVoice(null);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrolledFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollToBottom(scrolledFromBottom > 100); // Show button if not at bottom
  };

  // Helpers for file rendering
  const getFileExtension = (name, mime) => {
    try {
      if (name && name.includes(".")) {
        const ext = name.split(".").pop();
        if (ext) return ext.toUpperCase();
      }
      if (mime && mime.includes("/")) {
        return mime.split("/").pop().toUpperCase();
      }
      return "FILE";
    } catch (_) {
      return "FILE";
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === undefined || bytes === null) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    let i = 0;
    let num = Number(bytes);
    while (num >= 1024 && i < sizes.length - 1) {
      num /= 1024;
      i += 1;
    }
    return `${Math.round(num)} ${sizes[i]}`;
  };

  useEffect(() => {
    // Use setTimeout to ensure scrolling happens after render
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    // console.log(messages);

    return () => clearTimeout(timer);
  }, [messages, chat]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setRecordingTime(0);
      setIsRecordingVoice(true);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        setVoiceUrl(URL.createObjectURL(blob));

        // Calculate duration
        const audioContext = new AudioContext();
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setVoiceDuration(Math.floor(audioBuffer.duration));

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Microphone access denied or not available");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current?.state === "inactive") {
      return Promise.resolve(voiceBlob); 
    }

    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);

        setVoiceUrl(URL.createObjectURL(blob));

        // Calculate duration

        const audioContext = new AudioContext();
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const duration = Math.floor(audioBuffer.duration);
        setVoiceDuration(duration);
        clearInterval(timerRef.current);
        setIsRecordingVoice(false);
        resolve({ blob, duration });
      };
      mediaRecorderRef.current.stop();
    });
  };

  const cancelVoiceRecording = () => {
    stopVoiceRecording();
    setVoiceBlob(null);
    setVoiceUrl("");
    setVoiceDuration(0);
  };

  const sendVoiceMessage = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      let blobToSend = voiceBlob;
      let durationToSend = voiceDuration;

      // If still recording, stop and get the blob

      if (isRecordingVoice) {
        const { blob, duration } = await stopVoiceRecording();
        blobToSend = blob;
        durationToSend = duration;
      }

      if (!blobToSend) {
        throw new Error("No voice recording to send");
      }

      const formData = new FormData();
      formData.append("voice", blobToSend, `voice-${Date.now()}.webm`);
      formData.append("receiver_id", chat.id);
      formData.append("duration", durationToSend || 0);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/messages/voice`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send voice message");
      }

      // Reset after successful send
      cancelVoiceRecording();
    } catch (err) {
      console.error("Error sending voice message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);
    // Start loading animation
    // setIsLoading(true);
    // setLoadingProgress(0);

    // Simulate progress from 0 to 90% during send
    // loadingIntervalRef.current = setInterval(() => {
    //   setLoadingProgress(prev => {
    //     if (prev >= 90) {
    //       clearInterval(loadingIntervalRef.current);
    //       return 90;
    //     }
    //     return prev + 10;
    //   });
    // }, 100);

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ receiver_id: chat.id, message }),
      });
      setMessage("");
      // Reset our typing flag right after sending
      const friendId = Number(chat?.id);
      if (friendId) {
        const currentChatId =
          currentUserId < friendId
            ? `chat_${currentUserId}_${friendId}`
            : `chat_${friendId}_${currentUserId}`;
        const myTypingRef = ref(db, `typing/${currentChatId}/${currentUserId}`);
        set(myTypingRef, false);
      }
      // Do not optimistically append; Firebase child_added will update the UI
    } catch (e) {
      console.error("Failed to send message", e);
      // Stop loading on error
      // setIsLoading(false);
      // setLoadingProgress(0);
      // clearInterval(loadingIntervalRef.current);
    } finally {
      setIsSending(false);
    }
  };

  const handleOptionsClick = () => {
    setShowOptionsMenu(!showOptionsMenu);
    setShowAttachMenu(false);
  };

  const handleAttachClick = () => {
    setShowAttachMenu(!showAttachMenu);
    setShowOptionsMenu(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
        });
        setShowImageModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnyFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // If image, create preview like image flow; otherwise just set metadata
    if (file.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedFile({
          file,
          preview: ev.target.result,
          name: file.name,
          size: file.size,
          mime: file.type,
        });
        setShowFileModal(true);
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({
        file,
        name: file.name,
        size: file.size,
        mime: file.type || "application/octet-stream",
      });
      setShowFileModal(true);
      setShowAttachMenu(false);
    }
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile.file);
      formData.append("caption", fileCaption);
      formData.append("receiver_id", chat.id);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/messages/file`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload file");

      // Cleanup blob URL if any
      if (selectedFile.preview && selectedFile.preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(selectedFile.preview);
        } catch (_) {}
      }
      setLoading(false);
      setSelectedFile(null);
      setFileCaption("");
      setShowFileModal(false);
      setShowAttachMenu(false);
    } catch (err) {
      console.error("Failed to send file:", err);
      setLoading(false);
    }
  };

  const handleCancelFile = () => {
    if (selectedFile?.preview && selectedFile.preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(selectedFile.preview);
      } catch (_) {}
    }
    setSelectedFile(null);
    setFileCaption("");
    setShowFileModal(false);
    setShowAttachMenu(false);
  };

  const toggleFileVideoPlay = () => {
    const v = filePreviewVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsFileVideoPlaying(true);
    } else {
      v.pause();
      setIsFileVideoPlaying(false);
    }
  };

  // Camera handlers
  const attachStreamToVideo = () => {
    const stream = cameraStreamRef.current;
    const video = videoRef.current;
    if (!stream || !video) return;
    try {
      video.srcObject = stream;
      const play = () => {
        video.play().catch(() => {});
      };
      if (video.readyState >= 2) {
        play();
      } else {
        video.onloadedmetadata = play;
      }
    } catch (_) {}
  };

  const openCamera = async () => {
    try {
      // Prefer back camera on mobile; gracefully fallback
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      cameraStreamRef.current = stream;
      setShowCameraModal(true);
      setShowAttachMenu(false);
      // Attach when modal renders
      setTimeout(attachStreamToVideo, 0);
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const closeCamera = () => {
    if (videoRecorderRef.current && isVideoRecording) {
      try {
        videoRecorderRef.current.stop();
      } catch (_) {}
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const capturePhoto = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;
      const canvas = document.createElement("canvas");
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], `camera-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const preview = URL.createObjectURL(blob);
          setSelectedImage({ file, preview });
          setShowImageModal(true); // reuse same image modal for caption + send
          closeCamera();
        },
        "image/jpeg",
        0.92
      );
    } catch (err) {
      console.error("Failed to capture photo:", err);
    }
  };

  // Ensure stream attaches if modal toggles or ref becomes ready
  useEffect(() => {
    if (showCameraModal) {
      attachStreamToVideo();
    }
  }, [showCameraModal]);

  // Video recording controls
  const startVideoRecording = () => {
    const stream = cameraStreamRef.current;
    if (!stream) return;
    try {
      videoChunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
        ? "video/webm;codecs=vp8"
        : "video/webm";
      const recorder = new MediaRecorder(stream, {
        mimeType: mime,
        videoBitsPerSecond: 2_000_000,
      });
      videoRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) videoChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
        const file = new File([blob], `camera-video-${Date.now()}.webm`, {
          type: "video/webm",
        });
        const preview = URL.createObjectURL(blob);
        setSelectedFile({
          file,
          preview,
          name: file.name,
          size: file.size,
          mime: file.type,
        });
        setShowFileModal(true);
        closeCamera();
        setIsVideoRecording(false);
      };
      recorder.start();
      setIsVideoRecording(true);
      // Safety auto-stop after 15s to keep size small
      setTimeout(() => {
        if (videoRecorderRef.current && isVideoRecording) {
          try {
            videoRecorderRef.current.stop();
          } catch (_) {}
        }
      }, 15000);
    } catch (err) {
      console.error("Failed to start video recording:", err);
    }
  };

  const stopVideoRecording = () => {
    if (videoRecorderRef.current && isVideoRecording) {
      try {
        videoRecorderRef.current.stop();
      } catch (_) {}
    }
  };

  const handleSendImage = async () => {
    if (!selectedImage) return;

    setLoading(true);

    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("image", selectedImage.file);
      formData.append("caption", imageCaption);
      formData.append("receiver_id", chat.id);

      // Upload image to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/messages/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Reset states
        setLoading(false);
        setSelectedImage(null);
        setImageCaption("");
        setShowImageModal(false);
        setShowAttachMenu(false);
        // Loading will complete when Firebase listener receives the message
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to send image:", error);
      setLoading(false);
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImageCaption("");
    setShowImageModal(false);
    setShowAttachMenu(false);
  };

  useEffect(() => {
    // Direct scroll to bottom without animation
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" }); // 'auto' = instant, no smooth
    }
  }, [chat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowOptionsMenu(false);
    setShowAttachMenu(false);
  };

  // Keep typing indicator visible by scrolling to bottom when it appears
  useEffect(() => {
    if (isFriendTyping) {
      const t = setTimeout(() => scrollToBottom(), 50);
      return () => clearTimeout(t);
    }
  }, [isFriendTyping]);

  // Friend presence listener for active chat
  useEffect(() => {
    const friendId = Number(chat?.id);
    if (!friendId) return;
    const statusRef = ref(db, `status/${friendId}`);
    const unsubscribe = onValue(statusRef, (snap) => {
      const val = snap.val();
      setFriendOnline(Boolean(val?.online));
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [chat?.id]);

  // Friend typing listener for active chat
  useEffect(() => {
    const friendId = Number(chat?.id);
    if (!friendId) return;
    const currentChatId =
      currentUserId < friendId
        ? `chat_${currentUserId}_${friendId}`
        : `chat_${friendId}_${currentUserId}`;
    const friendTypingRef = ref(db, `typing/${currentChatId}/${friendId}`);
    const unsubscribe = onValue(friendTypingRef, (snap) => {
      setIsFriendTyping(Boolean(snap.val()));
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [chat?.id, currentUserId]);

  // Clear our typing flag when switching chats/unmounting
  useEffect(() => {
    return () => {
      const friendId = Number(chat?.id);
      if (!friendId) return;
      const currentChatId =
        currentUserId < friendId
          ? `chat_${currentUserId}_${friendId}`
          : `chat_${friendId}_${currentUserId}`;
      const myTypingRef = ref(db, `typing/${currentChatId}/${currentUserId}`);
      set(myTypingRef, false);
    };
  }, [chat?.id, currentUserId]);

  useEffect(() => {
    // Reset messages on chat change
    setMessages([]);

    // Firebase listener using the same deterministic chatId as backend
    const friendId = Number(chat.id);
    const chatId =
      currentUserId < friendId
        ? `chat_${currentUserId}_${friendId}`
        : `chat_${friendId}_${currentUserId}`;

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    // Mark last read for current user as now when chat opens
    const lastReadRef = ref(db, `lastRead/${chatId}/${currentUserId}`);
    set(lastReadRef, Math.floor(Date.now() / 1000));

    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const payload = snapshot.val();

      const deletedBy = payload?.deleted_by || [];
      if (deletedBy.includes(currentUserId)) {
        return; // Skip this message
      }

      const normalized = {
        id: snapshot.key,
        type: payload?.type || "text",
        content: payload?.text || payload?.message || "",
        isOwn: Number(payload?.sender_id) === currentUserId,
        timestamp: payload?.timestamp
          ? new Date(Number(payload.timestamp) * 1000)
          : new Date(),
        // Image specific fields
        image_url: payload?.image_url || null,
        media_url: payload?.media_url || null,
        // Voice specific fields (keep existing)
        audioUrl: payload?.audioUrl || null,
        duration: payload?.duration || null,
        // File specific fields
        file: payload?.file || null,
        // Post payload
        post: payload?.post || null,
      };
      // console.log(normalized);
      setMessages((prev) => [...prev, normalized]);

      // If this is our own message being received, complete the loading
      if (Number(payload?.sender_id) === currentUserId && isLoading) {
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingProgress(0);
        }, 500); // Show 100% for 500ms then hide
        clearInterval(loadingIntervalRef.current);
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [chat.id, currentUserId, isLoading]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessage(val);
    const friendId = Number(chat?.id);
    if (!friendId) return;
    const currentChatId =
      currentUserId < friendId
        ? `chat_${currentUserId}_${friendId}`
        : `chat_${friendId}_${currentUserId}`;
    const myTypingRef = ref(db, `typing/${currentChatId}/${currentUserId}`);
    onDisconnect(myTypingRef).set(false);
    set(myTypingRef, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      set(myTypingRef, false);
    }, 1500);
  };

  const handleInputBlur = () => {
    const friendId = Number(chat?.id);
    if (!friendId) return;
    const currentChatId =
      currentUserId < friendId
        ? `chat_${currentUserId}_${friendId}`
        : `chat_${friendId}_${currentUserId}`;
    const myTypingRef = ref(db, `typing/${currentChatId}/${currentUserId}`);
    set(myTypingRef, false);

    // Update last read timestamp when leaving input focus (optional minor improvement)
    const lastReadRef = ref(db, `lastRead/${currentChatId}/${currentUserId}`);
    set(lastReadRef, Math.floor(Date.now() / 1000));
  };

  // Cleanup loading interval on unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  const handleClearChat = async () => {
    try {
      
      setIsClearingChat(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/messages/clear-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            friend_id: chat.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to clear chat");
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      setMessages([]);
      setLastClearedAt(Date.now());
      if (onClearChat) {
        onClearChat();
      }

      toast.success("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error(error.message || "Failed to clear chat");
    } finally {
      setIsClearingChat(false);
      setShowOptionsMenu(false);
    }
  };

  return (
    <div
      className={`relative w-full md:w-[70%] h-full md:flex flex-col bg-white rounded-md border border-[#28388F] md:overflow-hidden ${
        !chat ? "max-md:hidden" : " "
      }`}
    >
      <ToastContainer />
      <div className="sticky top-0 z-30 flex items-center justify-between py-3 md:p-4 border-b border-gray-400 bg-white">
        <div className="flex items-center">
          <button onClick={onBack}>
            <ChevronLeft className="md:hidden w-10 h-10 max-md:mr-2" />
          </button>
          <img
            src={chat.avatar || "/placeholder.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h2 className="font-semibold text-gray-900">{chat.name}</h2>
            <div className="flex items-center">
              <span
                className={`text-sm ${
                  isFriendTyping
                    ? "text-green-600"
                    : friendOnline
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {isFriendTyping
                  ? "typing..."
                  : friendOnline
                  ? "online"
                  : "offline"}
              </span>
              <div
                className={`w-2 h-2 bg-green-500 ${
                  friendOnline ? "" : "hidden"
                } rounded-full ml-2`}
              ></div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handleOptionsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-7 h-7 text-gray-600" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-4 top-12 bg-white border border-[#28388F] rounded-xl shadow-lg py-2 w-44 z-30">
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                <Ban className="w-4 h-4 mr-2 text-[#0017E7]" />
                Block this Profile
              </button>
              <button
                onClick={handleClearChat}
                disabled={isClearingChat}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isClearingChat ? (
                  <LoaderCircle className="w-4 h-4 mr-3 text-[#0017E7] animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-3 text-[#0017E7]" />
                )}
                {isClearingChat ? "Clearing..." : "Clear Chat"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto hide-scrollbar"
        onScroll={handleScroll}
      >
        <div className="flex flex-col items-center py-8">
          <img
            src={chat.avatar || "/placeholder.svg"}
            alt="Jaiwad singh"
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {chat.name}
          </h3>
          <p className="text-gray-600 mb-4">102 Likes | 9 Posts</p>
          <button className="bg-[#0017E7] hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
            View Profile
          </button>
          <p className="md:hidden text-gray-600 mt-12">Wed 9:41 PM</p>
        </div>

        <div className="p-6 space-y-6 md:space-y-4 pb-6">
          <PostCard />
          <Video />
          <TextPost />
          <Reel />
          <Page />
          <Group />
          {messages.map((msg, i) => {
            if (msg.deleted_by && msg.deleted_by.includes(currentUserId)) {
              return null;
            }
            return (
              <div
                key={i}
                className={`flex ${
                  msg.isOwn ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "text" ? (
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap break-words overflow-x-hidden ${
                      msg.isOwn
                        ? "bg-[#0017E7] text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <span>{msg.content}</span>
                  </div>
                ) : msg.type === "image" ? (
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%]`}>
                    <div className="mb-2">
                      <img
                        src={msg.image_url || msg.media_url}
                        alt="Chat image"
                        className="w-full max-w-xs rounded-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    {msg.content && (
                      <div
                        className={`px-4 py-2 rounded-2xl whitespace-pre-wrap break-words overflow-x-hidden ${
                          msg.isOwn
                            ? "bg-[#0017E7] text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <span>{msg.content}</span>
                      </div>
                    )}
                  </div>
                ) : msg.type === "file" ? (
                  <div className={`max-w-[80%]`}>
                    <a
                      href={msg.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <div
                        className={`${
                          msg.isOwn
                            ? "bg-[#0017E7] text-white"
                            : "bg-gray-200 text-gray-900"
                        } rounded-t-2xl px-4 py-3 flex items-center gap-3`}
                      >
                        {/* Icon with centered extension */}
                        <div
                          className={`${
                            msg.isOwn ? "bg-white/15" : "bg-white"
                          } w-12 h-12 rounded-lg relative grid place-items-center shadow-sm`}
                          style={{ overflow: "hidden" }}
                        >
                          <img
                            src={Paper}
                            alt="file"
                            className="absolute inset-0 w-full h-full object-contain opacity-90"
                          />
                          <span
                            className={`${
                              msg.isOwn ? "text-white" : "text-[#0017E7]"
                            } relative z-[1] text-[10px] font-semibold tracking-wide bg-black/0 px-1 rounded`}
                            style={{
                              textShadow: msg.isOwn
                                ? "0 0 2px rgba(0,0,0,0.25)"
                                : "none",
                            }}
                          >
                            {getFileExtension(msg.file?.name, msg.file?.mime)}
                          </span>
                        </div>

                        {/* File meta */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={`truncate text-[14px] font-medium ${
                              msg.isOwn ? "text-white" : "text-[#0017E7]"
                            }`}
                          >
                            {msg.file?.name || "Attachment"}
                          </div>
                          <div
                            className={`text-xs ${
                              msg.isOwn ? "text-white/80" : "text-gray-600"
                            } truncate`}
                          >
                            {getFileExtension(msg.file?.name, msg.file?.mime)} ·{" "}
                            {formatBytes(msg.file?.size)}
                          </div>
                        </div>
                      </div>
                    </a>
                    {msg.content && (
                      <div
                        className={`px-4 py-2 whitespace-pre-wrap break-words overflow-x-hidden -mt-px ${
                          msg.isOwn
                            ? "bg-[#2240ff] text-white rounded-b-2xl rounded-tl-none rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-b-2xl rounded-tl-none rounded-tr-none"
                        }`}
                      >
                        <span>{msg.content}</span>
                      </div>
                    )}
                  </div>
                ) : msg.type === "post" && msg.post?.post_type === "image" ? (
                  <div className={`px-2 py-2 rounded-2xl max-w-[80%]`}>
                    <PostCard postId={msg.post.id} />
                  </div>
                ) : msg.type === "post" && msg.post?.post_type === "video" ? (
                  <div className={`px-2 py-2 rounded-2xl max-w-[80%]`}>
                    <Video postId={msg.post.id} />
                  </div>
                ) : msg.type === "post" && msg.post?.post_type === "text" ? (
                  <div className={`px-2 py-2 rounded-2xl max-w-[80%]`}>
                    <TextPost postId={msg.post.id} />
                    {msg.content && (
                      <div
                        className={`px-4 py-2 whitespace-pre-wrap break-words overflow-x-hidden mt-3 ${
                          msg.isOwn
                            ? "bg-[#2240ff] text-white rounded-2xl"
                            : "bg-gray-100 text-gray-900 rounded-2xl"
                        }`}
                      >
                        <span>{msg.content}</span>
                      </div>
                    )}
                  </div>
                ) : msg.type === "voice" ? (
                     <div
                    className={`max-w-[80%] ${
                      msg.isOwn ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl ${
                        msg.isOwn ? "bg-[#0017E7]" : "bg-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => toggleVoicePlay(msg)}
                        className={`p-2 rounded-full ${
                          msg.isOwn
                            ? "bg-white/20 text-white"
                            : "bg-white text-[#0017E7]"
                        }`}
                      >
                        {currentlyPlayingVoice === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <div className="text-white flex items-center gap-x-[3px]">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const height = Math.floor(Math.random() * 20) + 5; // random 5px-25px
                          return (
                            <div
                              key={i}
                              className={`w-[2px] rounded-sm ${
                                msg.isOwn ? "bg-white" : "bg-[#0017E7]"
                              }`}
                              style={{
                                height: `${height}px`,
                              }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-xs ${
                            msg.isOwn ? "text-white/80" : "text-gray-600"
                          }`}
                        >
                          {formatVoiceDuration(msg.duration || 0)}
                        </div>
                      </div>
                      <audio
                        ref={(el) => (voiceAudioRefs.current[msg.id] = el)}
                        src={msg.media_url}
                        onEnded={() => handleVoiceEnd(msg.id)}
                        hidden
                      />
                    </div>
                    {msg.content && (
                      <div
                        className={`px-4 py-2 whitespace-pre-wrap break-words overflow-x-hidden -mt-px ${
                          msg.isOwn
                            ? "bg-[#2240ff] text-white rounded-b-2xl rounded-tl-none rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-b-2xl rounded-tl-none rounded-tr-none"
                        }`}
                      >
                        <span>{msg.content}</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
          <div
            className={`flex justify-start items-center gap-x-2 transition-all duration-200 ease-out ${
              isFriendTyping
                ? "opacity-100 max-h-12 mt-2"
                : "opacity-0 max-h-0 mt-0 overflow-hidden"
            }`}
          >
            <img
              src={profile || "/placeholder.svg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 inline-flex items-center gap-2">
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>

          {/* Loading Bar */}
          {isLoading && (
            <div className="flex justify-center items-center">
              <div className="w-full max-w-[30%] flex self-center bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-300">
                <div
                  className="bg-gradient-to-r from-green-600 via-green-400 to-green-500 h-2.5 rounded-full dark:bg-green-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4  z-[999]">
        {isRecordingVoice || voiceUrl ? (
          <div className="relative flex items-center bg-gray-200 rounded-full py-2 px-4">
            <button
              onClick={cancelVoiceRecording}
              className="p-2 rounded-full flex-shrink-0"
              disabled={isSending}
            >
              <CircleX className="text-[#0017E7]" />
            </button>

            <div className="flex-1">
              <div className="w-full bg-[#0017E7]/75 rounded-full h-10 flex items-center px-4 relative overflow-hidden">
                {/* Dark blue filled portion (simulating recording progress) */}
                <div
                  className="absolute left-0 top-0 h-full bg-[#0017E7] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((recordingTime / 60) * 100, 100)}%`,
                  }} // Simulating 30% recorded
                ></div>

                <div className="absolute left-2 rounded-full p-1.5 bg-white">
                  <div className="w-3.5 h-3.5 bg-[#0017E7] rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="absolute right-14 bg-white rounded-full px-4 py-0.5 flex-shrink-0">
              <span className="text-[#0017E7] text-sm font-medium">
                {formatVoiceDuration(recordingTime)}
              </span>
            </div>

            <button onClick={sendVoiceMessage} disabled={isSending}>
              {isSending ? (
                <LoaderCircle className="w-5 h-5 ml-2 animate-spin text-[#0017E7]" />
              ) : (
                <img src={send} className="w-8 h-8" />
              )}
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Type a message"
              className="w-full px-20 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
            />

            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="relative">
                <button
                  onClick={handleAttachClick}
                  className="p-2 rounded-full"
                >
                  <CirclePlus className="w-5 h-5 text-[#0017E7]" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {showAttachMenu && (
                  <div className="absolute bottom-14 left-0 bg-white border border-[#28388F] rounded-lg shadow-lg py-2 w-48 z-30">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 mr-3 text-[#0017E7]" />
                      Images
                    </button>
                    <input
                      type="file"
                      ref={fileAnyInputRef}
                      onChange={handleAnyFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileAnyInputRef.current?.click()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <Paperclip className="w-4 h-4 mr-3 text-[#0017E7]" />
                      Attach Files
                    </button>
                    <input
                      type="file"
                      ref={docsInputRef}
                      onChange={handleAnyFileSelect}
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv"
                      className="hidden"
                    />
                    <button
                      onClick={() => docsInputRef.current?.click()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 mr-3 text-[#0017E7]" />
                      Documents
                    </button>
                    <button
                      onClick={openCamera}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-4 h-4 mr-3 text-[#0017E7]" />
                      Camera
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
              <button onClick={toggleEmojiPicker} className="p-2 rounded-full">
                <Smile className="w-5 h-5 text-[#0017E7]" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-30">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={350}
                  />
                </div>
              )}
            </div>

            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <button
                onClick={
                  message.trim() ? handleSendMessage : startVoiceRecording
                }
                className="p-2 rounded-full"
                disabled={isSending}
              >
                {message.trim() ? (
                  isSending ? (
                    <LoaderCircle className="w-5 h-5 text-[#0017E7] animate-spin" />
                  ) : (
                    <img src={send} className="w-7 h-7" />
                  )
                ) : (
                  <Mic className="w-5 h-5 text-[#0017E7]" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed right-6 bottom-36 md:right-14 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-20"
          aria-label="Scroll to bottom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0017E7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </button>
      )}

      {(showOptionsMenu || showAttachMenu || showEmojiPicker) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowOptionsMenu(false);
            setShowAttachMenu(false);
            setShowEmojiPicker(false);
          }}
        />
      )}

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Image</h3>

            {/* Image Preview */}
            <div className="mb-4">
              <img
                src={selectedImage.preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Caption Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption (optional)
              </label>
              <textarea
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={loading ? true : false}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelImage}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendImage}
                className="flex-1 px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-x-1">
                    Sending
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Camera</h3>
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={() => setIsVideoMode(false)}
                  className={`${
                    !isVideoMode
                      ? "bg-[#0017E7] text-white"
                      : "bg-gray-100 text-gray-800"
                  } px-3 py-1 rounded-md`}
                >
                  Photo
                </button>
                <button
                  onClick={() => setIsVideoMode(true)}
                  className={`${
                    isVideoMode
                      ? "bg-[#0017E7] text-white"
                      : "bg-gray-100 text-gray-800"
                  } px-3 py-1 rounded-md`}
                >
                  Video
                </button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden mb-3 bg-black">
              <video
                ref={videoRef}
                className="w-full max-h-[60vh] object-contain"
                playsInline
                muted
              />
            </div>
            {isVideoMode ? (
              <div className="flex gap-3">
                <button
                  onClick={closeCamera}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                {isVideoRecording ? (
                  <button
                    onClick={stopVideoRecording}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={startVideoRecording}
                    className="flex-1 px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-blue-700"
                  >
                    Start
                  </button>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={closeCamera}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={capturePhoto}
                  className="flex-1 px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-blue-700"
                >
                  Capture
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showFileModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Attachment</h3>

            {/* Preview or Icon + filename */}
            <div className="mb-4">
              {selectedFile.preview &&
              selectedFile.mime?.startsWith("video/") ? (
                <div>
                  <video
                    ref={filePreviewVideoRef}
                    src={selectedFile.preview}
                    className="w-full h-48 object-contain rounded-lg bg-black"
                    controls={false}
                  />
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={toggleFileVideoPlay}
                      className="px-4 py-1 text-sm rounded-md border border-gray-300"
                    >
                      {isFileVideoPlaying ? "Pause" : "Play"}
                    </button>
                  </div>
                </div>
              ) : selectedFile.preview ? (
                <img
                  src={selectedFile.preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="w-5 h-5 text-[#0017E7]" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {selectedFile.mime} ·{" "}
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Caption Input (same as image) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption (optional)
              </label>
              <textarea
                value={fileCaption}
                onChange={(e) => setFileCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={loading ? true : false}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelFile}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFile}
                className="flex-1 px-4 py-2 bg-[#0017E7] text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-x-1">
                    Sending
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}