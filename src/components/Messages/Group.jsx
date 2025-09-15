import automotive from "../../assets/images/automotive.jpg";

const Group = () => {
  return (
    <div className="flex justify-end">
      <div className="w-auto bg-[#0017E7] rounded-xl shadow-2xl">
        {/* Play Button */}
        <div className="flex items-center justify-start gap-3 py-3 pl-4 md:pr-14 pr-5">
          <div className="w-12 h-12">
            <img className="w-full h-auto rounded-full" src={automotive} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm md:text-lg max-md:text-nowrap">
              Automotive Workshop
            </h3>
            <div className="items-center text-white text-[14px] md:text-xs">
              <span>Private Group</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
