import { useEffect, useRef, useState } from "react";
import send from "../../assets/images/send.png";
import {
  ChevronLeft,
  Send,
  ImagePlus,
  Smile,
  Mic,
  MoreVertical,
  Ban,
  Trash2,
  LogOut,
  LoaderCircle,
  CircleX,
  Play,
  Pause,
  CirclePlus,
  Paperclip,
  FileText,
  Camera,
  Pencil,
} from "lucide-react";
import PostCard from "./Post";
import Video from "./Video";
import TextPost from "./TextPost";
import Reel from "./Reel";
import Page from "./Page";
import Group from "./Group";
import { db } from "../../firebase";
import { ref as dbRef, push, set, onValue, off } from "firebase/database";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import addMember from "../../assets/images/add_member.png";
import Paper from "../../assets/images/file.png";
import Members from "./members";
import EditGroupDetail from "./EditGroupDetail";
import AddGroupMember from "./AddGroupMember";

const GroupChatArea = ({ chat, onBack, forceScroll, groups, setGroups }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceUrl, setVoiceUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentlyPlayingVoice, setCurrentlyPlayingVoice] = useState(null);
  const voiceAudioRefs = useRef({});
  const fileInputRef = useRef(null);
  const fileAnyInputRef = useRef(null);
  const docsInputRef = useRef(null);
  const currentUserId = Number(localStorage.getItem("user_id"));
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [localChat, setLocalChat] = useState(chat);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCaption, setFileCaption] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const cameraStreamRef = useRef(null);
  const videoRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const filePreviewVideoRef = useRef(null);
  const [isFileVideoPlaying, setIsFileVideoPlaying] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showGroupMemberPopup, setShowGroupMemberPopup] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [firebaseMembers, setFirebaseMembers] = useState({});

  // Update your useEffect that fetches messages
useEffect(() => {
  if (!chat?.id) return;

  const messagesRef = dbRef(db, `groups/${chat.id}/messages`);
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const messagesData = snapshot.val();
    if (messagesData) {
      const messagesArray = Object.entries(messagesData).map(([id, msg]) => ({
        id,
        ...msg,
      }));
      
      // Filter out messages that this user has deleted
      const filteredMessages = messagesArray.filter(message => {
        // If message doesn't have deleted_by or user hasn't deleted it, show it
        return !message.deleted_by || !message.deleted_by.includes(currentUserId);
      });
      
      setMessages(filteredMessages);
    } else {
      setMessages([]);
    }
  });

  return () => {
    off(messagesRef);
  };
}, [chat?.id, currentUserId]);

  useEffect(() => {
    if (!chat?.id) return;

    const membersRef = dbRef(db, `groups/${chat.id}/members`);
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const membersData = snapshot.val();
      if (membersData) {
        setFirebaseMembers(membersData);
        // Count the number of members (true values)
        const count = Object.values(membersData).filter(Boolean).length;
        setMemberCount(count);
      } else {
        setFirebaseMembers({});
        setMemberCount(0);
      }
    });

    return () => {
      off(membersRef);
    };
  }, [chat?.id]);

  const handleClearChat = async () => {
    try {
      setShowOptionsMenu(false);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-messages/clear-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            group_id: chat.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear chat");
      }

      // Optionally show a success message
      alert("Chat cleared successfully");
    } catch (error) {
      console.error("Error clearing chat:", error);
      alert("Failed to clear chat");
    }
  };

  // Scroll to bottom when messages change or forceScroll is triggered
  useEffect(() => {
    scrollToBottom();
  }, [messages, forceScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch group messages from Firebase
  useEffect(() => {
    if (!chat?.id) return;

    const messagesRef = dbRef(db, `groups/${chat.id}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesArray = Object.entries(messagesData).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    });

    return () => {
      off(messagesRef);
    };
  }, [chat?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);

      // Send to your backend API first
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            group_id: chat.id,
            message: newMessage,
            type: "text",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // The backend will handle Firebase update, so we don't need to do it here
      // Just clear the input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!chat?.id) return;

    // Mark all messages as read when opening the chat
    const markMessagesAsRead = async () => {
      try {
        const unreadMessages = messages.filter(
          (msg) =>
            !msg.read_by?.includes(currentUserId) &&
            msg.sender_id !== currentUserId
        );

        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((msg) =>
              fetch(
                `${import.meta.env.VITE_API_BASE_URL}/group-messages/mark-read`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    group_id: chat.id,
                    message_id: msg.id,
                  }),
                }
              )
            )
          );

          // Also update Firebase last read timestamp
          await set(
            dbRef(db, `lastRead/group_${chat.id}/${currentUserId}`),
            Math.floor(Date.now() / 1000)
          );
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    };

    markMessagesAsRead();
  }, [chat?.id, messages, currentUserId]);

  const handleOptionsClick = () => {
    setShowOptionsMenu(!showOptionsMenu);
    setShowAttachMenu(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowOptionsMenu(false);
    setShowAttachMenu(false);
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachClick = () => {
    setShowAttachMenu(!showAttachMenu);
    setShowOptionsMenu(false);
    setShowEmojiPicker(false);
  };

  const formatVoiceDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
      formData.append("group_id", chat.id);
      formData.append("duration", durationToSend || 0);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-messages/voice`,
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

      cancelVoiceRecording();
    } catch (err) {
      console.error("Error sending voice message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const toggleVoicePlay = (msg) => {
    const audio = voiceAudioRefs.current[msg.id];
    if (!audio) return;

    if (currentlyPlayingVoice === msg.id) {
      audio.pause();
      setCurrentlyPlayingVoice(null);
    } else {
      if (currentlyPlayingVoice) {
        const currentAudio = voiceAudioRefs.current[currentlyPlayingVoice];
        if (currentAudio) currentAudio.pause();
      }
      audio.play().then(() => setCurrentlyPlayingVoice(msg.id));
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

  // Camera handlers
  const attachStreamToVideo = () => {
    const stream = cameraStreamRef.current;
    const video = videoRef.current;

    if (!stream || !video) {
      console.error("Stream or video element not available");
      return;
    }

    try {
      video.srcObject = stream;

      const playVideo = () => {
        video.play().catch((playError) => {
          console.error("Failed to play video:", playError);
        });
      };

      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.onloadedmetadata = playVideo;
        video.onerror = (error) => {
          console.error("Video error:", error);
        };
      }
    } catch (error) {
      console.error("Error attaching stream to video:", error);
    }
  };

  const openCamera = async () => {
    try {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera access is not supported in your browser");
        return;
      }

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
        console.log("Trying fallback camera access...");
        // Fallback to any available camera with simpler constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      cameraStreamRef.current = stream;
      setShowCameraModal(true);
      setShowAttachMenu(false);

      // Wait for the modal to render and video element to be available
      setTimeout(() => {
        attachStreamToVideo();
      }, 100);
    } catch (err) {
      console.error("Camera access denied or failed:", err);

      // More specific error messages
      if (err.name === "NotAllowedError") {
        alert(
          "Camera permission denied. Please allow camera access in your browser settings."
        );
      } else if (err.name === "NotFoundError") {
        alert("No camera found on this device.");
      } else if (err.name === "NotReadableError") {
        alert("Camera is already in use by another application.");
      } else {
        alert("Unable to access camera. Please check permissions.");
      }
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
          setShowImageModal(true);
          closeCamera();
        },
        "image/jpeg",
        0.92
      );
    } catch (err) {
      console.error("Failed to capture photo:", err);
    }
  };

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

  // Image and file handlers
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

  const handleSendImage = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage.file);
      formData.append("caption", imageCaption);
      formData.append("group_id", chat.id);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-messages/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setLoading(false);
        setSelectedImage(null);
        setImageCaption("");
        setShowImageModal(false);
        setShowAttachMenu(false);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Failed to send image:", error);
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImageCaption("");
    setShowImageModal(false);
    setShowAttachMenu(false);
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile.file);
      formData.append("caption", fileCaption);
      formData.append("group_id", chat.id);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/group-messages/file`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to upload file");

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

  return (
    <div className="max-md:w-full md:w-[70%] flex flex-col border border-[#28388F] rounded-md h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="md:hidden">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={
                localChat.avatar
                  ? localChat.avatar
                  : chat.avatar || "/placeholder.svg"
              }
              alt={localChat.name ? localChat.name : chat.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div
              className="cursor-pointer"
              onClick={() => setShowMembers(true)}
            >
              <h2 className="font-semibold text-gray-900">
                {localChat.name ? localChat.name : chat.name}
              </h2>
              <p className="text-xs text-gray-500">{memberCount} members</p>
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

          {showOptionsMenu && chat.created_by !== currentUserId && (
            <div className="absolute right-4 top-12 bg-white border border-[#28388F] rounded-xl shadow-lg py-2 w-44 z-30">
              <button
                onClick={handleClearChat}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-3 text-[#0017E7]" />
                Clear Group Chat
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                <LogOut className="w-4 h-4 mr-2 text-[#0017E7]" />
                Exit Group Chat
              </button>
            </div>
          )}
          {showOptionsMenu && chat.created_by === currentUserId && (
            <div className="absolute right-4 top-12 bg-white border border-[#28388F] rounded-xl shadow-lg py-2 w-52 z-30">
              <button
                onClick={() => setShowGroupMemberPopup(true)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={addMember}
                  className="w-5 h-auto mr-3 text-[#0017E7]"
                />
                Add Group Members
              </button>
              <button
                onClick={() => setShowEditGroup(true)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-4 h-4 mr-3 text-[#0017E7]" />
                Edit Group Details
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-3 text-[#0017E7]" />
                Clear Group Chat
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                <LogOut className="w-4 h-4 mr-2 text-[#0017E7]" />
                Exit Group Chat
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
            src={
              localChat.avatar
                ? localChat.avatar
                : chat.avatar || "/placeholder.svg"
            }
            alt={localChat.name ? localChat.name : chat.name}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {localChat.name ? localChat.name : chat.name}
          </h3>
          {currentUserId === localChat.created_by && (
            <p className="text-gray-600 mb-4">You created this group</p>
          )}
          <p className=" text-gray-600 mt-4">Wed 9:41 PM</p>
        </div>
        <div className="p-6 space-y-6 md:space-y-4 pb-6">
          <PostCard />
          <Video />
          <TextPost />
          <Reel />
          <Page />
          <Group />

          {/* Messages Area */}
          {/* Messages Area */}
          {messages.map((message) => {
            if (
              message.deleted_by &&
              message.deleted_by.includes(currentUserId)
            ) {
              return null;
            }

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.type === "text" ? (
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap break-words overflow-x-hidden ${
                      message.sender_id === currentUserId
                        ? "bg-[#0017E7] text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <span>{message.text}</span>
                  </div>
                ) : message.type === "image" ? (
                  <div className={`px-4 py-2 rounded-2xl max-w-[80%]`}>
                    <div className="mb-2">
                      <img
                        src={message.image_url || message.media_url}
                        alt="Chat image"
                        className="w-full max-w-xs rounded-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    {message.text && (
                      <div
                        className={`px-4 py-2 rounded-2xl whitespace-pre-wrap break-words overflow-x-hidden ${
                          message.sender_id === currentUserId
                            ? "bg-[#0017E7] text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <span>{message.text}</span>
                      </div>
                    )}
                  </div>
                ) : message.type === "file" ? (
                  <div className={`max-w-[80%]`}>
                    <a
                      href={message.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <div
                        className={`${
                          message.sender_id === currentUserId
                            ? "bg-[#0017E7] text-white"
                            : "bg-gray-200 text-gray-900"
                        } rounded-t-2xl px-4 py-3 flex items-center gap-3`}
                      >
                        {/* Icon with centered extension */}
                        <div
                          className={`${
                            message.sender_id === currentUserId
                              ? "bg-white/15"
                              : "bg-white"
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
                              message.sender_id === currentUserId
                                ? "text-white"
                                : "text-[#0017E7]"
                            } relative z-[1] text-[10px] font-semibold tracking-wide bg-black/0 px-1 rounded`}
                            style={{
                              textShadow:
                                message.sender_id === currentUserId
                                  ? "0 0 2px rgba(0,0,0,0.25)"
                                  : "none",
                            }}
                          >
                            {getFileExtension(
                              message.file?.name,
                              message.file?.mime
                            )}
                          </span>
                        </div>

                        {/* File meta */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={`truncate text-[14px] font-medium ${
                              message.sender_id === currentUserId
                                ? "text-white"
                                : "text-[#0017E7]"
                            }`}
                          >
                            {message.file?.name || "Attachment"}
                          </div>
                          <div
                            className={`text-xs ${
                              message.sender_id === currentUserId
                                ? "text-white/80"
                                : "text-gray-600"
                            } truncate`}
                          >
                            {getFileExtension(
                              message.file?.name,
                              message.file?.mime
                            )}{" "}
                            · {formatBytes(message.file?.size)}
                          </div>
                        </div>
                      </div>
                    </a>
                    {message.text && (
                      <div
                        className={`px-4 py-2 whitespace-pre-wrap break-words overflow-x-hidden -mt-px ${
                          message.sender_id === currentUserId
                            ? "bg-[#2240ff] text-white rounded-b-2xl rounded-tl-none rounded-tr-none"
                            : "bg-gray-100 text-gray-900 rounded-b-2xl rounded-tl-none rounded-tr-none"
                        }`}
                      >
                        <span>{message.text}</span>
                      </div>
                    )}
                  </div>
                ) : message.type === "voice" ? (
                  <div
                    className={`max-w-[80%] ${
                      message.sender_id === currentUserId
                        ? "ml-auto"
                        : "mr-auto"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl ${
                        message.sender_id === currentUserId
                          ? "bg-[#0017E7]"
                          : "bg-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => toggleVoicePlay(message)}
                        className={`p-2 rounded-full ${
                          message.sender_id === currentUserId
                            ? "bg-white/20 text-white"
                            : "bg-white text-[#0017E7]"
                        }`}
                      >
                        {currentlyPlayingVoice === message.id ? (
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
                                message.sender_id === currentUserId
                                  ? "bg-white"
                                  : "bg-[#0017E7]"
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
                            message.sender_id === currentUserId
                              ? "text-white/80"
                              : "text-gray-600"
                          }`}
                        >
                          {formatVoiceDuration(message.duration || 0)}
                        </div>
                      </div>
                      <audio
                        ref={(el) => (voiceAudioRefs.current[message.id] = el)}
                        src={message.media_url}
                        onEnded={() => handleVoiceEnd(message.id)}
                        hidden
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* <div
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
          </div> */}

          {/* Loading Bar */}
          {/* {isLoading && (
            <div className="flex justify-center items-center">
              <div className="w-full max-w-[30%] flex self-center bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-300">
                <div
                  className="bg-gradient-to-r from-green-600 via-green-400 to-green-500 h-2.5 rounded-full dark:bg-green-500 transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          )} */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 z-[999]">
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
                <LoaderCircle className="w-5 h-5 animate-spin ml-2 text-[#0017E7]" />
              ) : (
                <img src={send} className="w-8 h-8" />
              )}
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
                      <ImagePlus className="w-4 h-4 mr-3 text-[#0017E7]" />
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
                  newMessage.trim() ? handleSendMessage : startVoiceRecording
                }
                className="p-2 rounded-full"
                disabled={isSending}
              >
                {newMessage.trim() ? (
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

      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Image</h3>
            <div className="mb-4">
              <img
                src={selectedImage.preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
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

      {/* File Preview Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Attachment</h3>
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

      {/* Overlays */}
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
      {showGroupMemberPopup && (
        <AddGroupMember
          isOpen={showGroupMemberPopup}
          onClose={() => setShowGroupMemberPopup(false)}
          groupId={chat.id}
        />
      )}
      {showMembers && (
        <Members
          onClose={() => setShowMembers(false)}
          group={{
            ...chat,
            members: firebaseMembers,
          }}
        />
      )}

      {showEditGroup && (
        <EditGroupDetail
          isOpen={showEditGroup}
          onClose={() => setShowEditGroup(false)}
          group={localChat ? localChat : chat}
          onUpdate={(updatedGroup) => {
            setLocalChat(updatedGroup);
            setGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.id === updatedGroup.id ? updatedGroup : group
              )
            );
            setShowOptionsMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupChatArea;
