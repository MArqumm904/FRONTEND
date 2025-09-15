import ytLogo from "../../assets/images/ytlogo.png";

const Page = () => {
  return (
    <div className="flex justify-start">
      <div className="w-auto bg-[#0017E7] rounded-xl shadow-2xl">
        {/* Play Button */}
        <div className="flex items-center justify-start gap-3 py-3 pl-4 md:pr-14 pr-5">
          <div className="w-12 h-12">
            <img className="w-full h-auto rounded-full" src={ytLogo} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm md:text-lg">JR Graphics</h3>
            <div className="items-center text-white text-[14px] md:text-xs">
              <span>Public Page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
