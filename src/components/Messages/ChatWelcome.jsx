import newchat from "../../assets/images/newchat.png";

const ChatWelcome = ({ onStartChat }) => {

  
  return (
    <div className="max-md:hidden w-[70%] flex-1 bg-white rounded-md border border-[#28388F] flex flex-col items-center justify-center p-8">
        <img src={newchat} className="w-32 h-32 text-black rotate-60" />

        {/* Text Content */}
        <div className="text-center my-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Your Conversations</h2>
          <p className="text-lg text-gray-500 font-semibold max-w-md leading-tight">Start chatting now and connect<br/> with others easily.</p>
        </div>

        {/* Start Chat Button */}
        <button onClick={onStartChat} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
          Start a Chat
        </button>
      </div>
  )
}

export default ChatWelcome
