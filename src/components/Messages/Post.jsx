import { useEffect, useState } from "react";
import ytLogo from "../../assets/images/ytlogo.png";
import square from "../../assets/images/square.png";

// Lightweight post card that loads real post data by id
export default function Post({ postId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const payload = await res.json();
        setData(payload?.data || null);
      } catch (e) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    if (postId) load();
  }, [postId]);

  if (!postId) return null;
  if (loading) return <div className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-2xl">Loading post...</div>;
  if (error || !data) return <div className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-2xl">Unable to load post</div>;

  const base = import.meta.env.VITE_API_BASE_URL.replace("/api", "");
  const imageSrc = data?.media?.file
    ? (data.media.file.startsWith("http") ? data.media.file : `${base}/storage/${data.media.file}`)
    : null;
  const avatarSrc = data?.user?.profile_photo
    ? `${base}/storage/${data.user.profile_photo}`
    : ytLogo;

  const formatTimeAgo = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMin = Math.floor((now - date) / (1000 * 60));
    if (diffMin < 1) return "Just Now";
    if (diffMin < 60) return `${diffMin} Minutes Ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} Hours Ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD} Days Ago`;
  };

  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[320px] md:max-w-[380px] lg:max-w-[420px] h-auto bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
        {/* Header Section */}
        <div className="flex items-center gap-3 p-3 bg-gray-100">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="w-full h-auto rounded-full object-cover bg-center" src={avatarSrc} onError={(e)=>{e.currentTarget.src=ytLogo}} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base">{data?.user?.name || "User"}</h3>
            <div className="items-center text-gray-600 text-xs">
              <span>{formatTimeAgo(data?.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative">
          {imageSrc && (
            <img src={imageSrc} alt="Post" className="w-full h-[40vh] object-cover" />
          )}
          <img src={square} alt="Post" className="w-10 h-10 absolute top-1 right-0" />
        </div>

        {/* Description Section */}
        {data?.content && (
          <div className="p-3 bg-gray-100">
            <p className="text-gray-800 text-[12px] md:text-[10px] leading-tight font-medium">
              {data.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
