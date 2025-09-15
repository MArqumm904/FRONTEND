import videoicon from "../../assets/images/video_icon.png";
import videoediting from "../../assets/images/videoediting.png";

const Reel = () => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[250px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Play Button */}
        <div className="relative">
          <img
            src={videoediting}
            alt="Join JR Graphics on YouTube - 3D character with microphone promoting design tutorials"
            className="w-full h-[40vh] object-cover"
          />
          <img
            src={videoicon}
            alt="Post"
            className="w-10 h-10 absolute top-2 right-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Reel;
