import { useState, useEffect, useRef  } from "react";
import { Search } from "lucide-react";
import Person1 from "../assets/images/person-1.png";
import PDF from "../assets/images/pdf.png";
import Videos from "../assets/images/video.png";
import Camera from "../assets/images/camera.png";
import PostCreate from "../components/createpost_text";
import PostCreatePoll from "../components/createpost_poll";
import CreatePostImage from "../components/createimage_post";
import CreatePostVideo from "../components/createimage_video";

const CreatePost = () => {
  const [showPostCreatePopup, setShowPostCreatePopup] = useState(false);
  const [showPostPollPopup, setShowPostPollPopup] = useState(false);
  const [showpostimagePopup, setShowpostimagePopup] = useState(false);
  const [showpostvideoPopup, setShowpostvideoPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({
        file: file,
        url: imageUrl,
        name: file.name
      });
      
      setShowpostimagePopup(true);
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo({
        file: file,
        url: videoUrl,
        name: file.name
      });
      
      setShowpostvideoPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowpostimagePopup(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage.url);
      setSelectedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCloseVideoPopup = () => {
    setShowpostvideoPopup(false);
    if (selectedVideo) {
      URL.revokeObjectURL(selectedVideo.url);
      setSelectedVideo(null);
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleOpenPollPopup = () => {
    setShowPostPollPopup(true);
    setShowPostCreatePopup(false);
  };

  const handleClosePollPopup = () => {
    setShowPostPollPopup(false);
    // setShowPostCreatePopup(true);
  };

  useEffect(() => {
    if (showPostCreatePopup || showPostPollPopup || showpostvideoPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showPostCreatePopup, showPostPollPopup, showpostvideoPopup]);

  return (
    <div className="bg-white rounded-lg shadow-sm border md:border-[#6974b1] p-3 md:p-4 mb-4">
      <div className="flex items-center mb-0 md:mb-4">
        <div className="w-12 md:w-14 h-12 md:h-14 rounded-full overflow-hidden mr-2 md:mr-3">
          <img
            src={Person1}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#343f7b] md:block hidden" />
          <input
            type="text"
            onFocus={() => setShowPostCreatePopup(true)}
            placeholder="What's on your mind?"
            className="w-full bg-[#efeff3] font-sf rounded-full md:pl-12 pl-4 pr-4 py-2 md:py-4 text-[#343f7b] placeholder:font-semibold placeholder-[#343f7b] outline-none"
          />
        </div>
        {/* Mobile Photo Button */}
        <button className="md:hidden hover:bg-gray-100 flex flex-col items-center space-y-1 px-0 md:px-3 py-2 text-white rounded-lg transition-colors ml-2">
          <div className="w-6 h-6 rounded flex items-center justify-center">
            <img
              src={Camera}
              alt="Photo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-normal font-sf text-black text-sm">Photo</span>
        </button>
      </div>

      {/* PostCreate Modal */}
      {showPostCreatePopup && (
        <PostCreate
          onClose={() => setShowPostCreatePopup(false)}
          onOpenPoll={handleOpenPollPopup}
        />
      )}

      {/* PostCreatePoll Modal */}
      {showPostPollPopup && <PostCreatePoll onClose={handleClosePollPopup} />}

      {/* Desktop Only - Divider and Buttons */}
      <div className="hidden md:block">
        <hr className="border-gray-300 mb-4 mt-8" />

        <div className="flex justify-between items-center px-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoChange}
            accept="video/*"
            style={{ display: "none" }}
          />

          {/* Photo button */}
          <button
            className="hover:bg-gray-100 flex items-center space-x-2 px-3 py-2 text-white rounded-lg transition-colors"
            onClick={handlePhotoClick}
          >
            <div className="w-10 h-6 rounded flex items-center justify-center">
              <img
                src={Camera}
                alt="Camera"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-normal font-sf text-black">Photo</span>
          </button>

          {/* Video button */}
          <button
            className="hover:bg-gray-100 flex items-center space-x-2 px-3 py-2 text-white rounded-lg transition-colors"
            onClick={handleVideoClick}
          >
            <div className="w-10 h-6 rounded flex items-center justify-center">
              <img
                src={Videos}
                alt="Videos"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-normal font-sf text-black">Video</span>
          </button>

          <button className="hover:bg-gray-100 flex items-center space-x-2 px-3 py-2 text-white rounded-lg transition-colors">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <img src={PDF} alt="PDF" className="w-full h-full object-cover" />
            </div>
            <span className="font-normal font-sf text-black">Document</span>
          </button>
        </div>
      </div>

      {/* Image Popup component */}
      {showpostimagePopup && (
        <CreatePostImage
          onClose={handleClosePopup}
          selectedImage={selectedImage}
        />
      )}

      {/* Video Popup component */}
      {showpostvideoPopup && (
        <CreatePostVideo
          onClose={handleCloseVideoPopup}
          selectedVideo={selectedVideo}
        />
      )}
    </div>
  );
};

export default CreatePost;