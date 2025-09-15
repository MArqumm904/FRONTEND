import { Globe, Mail, Pencil, Phone } from "lucide-react";
import Google from "../../assets/images/google.png";
import Facebook from "../../assets/images/fb.png";
import Instagram from "../../assets/images/instagram.png";
import Linkedin from "../../assets/images/linkedin.png";
import Twitter from "../../assets/images/twitter.png";

const Info = ({owner_id}) => {
  const userId = localStorage.getItem('user_id');
  const details = [
    {
      contact: "+92 300 1234567",
      email: "leadership.academy@email.com",
      language: "Urdu",
      google: "https://www.leadershipacademy.org/abc",
      facebook: "https://www.facebook.com/leadershipacademy",
      instagram: "https://www.instagram.com/leadershipacademy",
      linkedin: "https://www.linkedin.com/leadershipacademy",
      twitter: "https://www.twitter.com/leadershipacademy",
    },
  ];

  return (
    <div className="py-4 sm:py-6 px-10 mt-4">
      <div className="flex items-center gap-x-16">
        <div className="">
          <h1 className="text-3xl  font-semibold mb-6">Contact</h1>
          <div className="flex items-center gap-x-2">
            <Phone className="w-6 h-6 text-gray-900" />{" "}
            <span className="font-medium text-[#707070]">
              {details[0].contact}
            </span>
          </div>
        </div>
        <div className="">
          <h1 className="text-3xl  font-semibold mb-6">Email</h1>
          <div className="flex items-center gap-x-2">
            <Mail className="w-6 h-6 text-gray-900" />{" "}
            <span className="font-medium text-[#707070]">
              {details[0].email}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl  font-semibold">Languages Spoken</h1>
          {owner_id === userId && (
          <button
            className="text-gray-800 border rounded-full border-gray-800 p-2"
            tabIndex={-1}
          >
            <Pencil className="w-5 h-5" />
          </button>
          )}
        </div>

        <div className="flex items-center gap-x-2">
          <Globe className="w-6 h-6 text-gray-900" />{" "}
          <span className="text-lg font-medium text-[#707070]">
            {details[0].language}
          </span>
        </div>
      </div>

      <div className="mt-20">
        <h1 className="text-3xl  font-semibold">Website and social link</h1>
        <div className="flex items-center justify-between mt-6 mb-4">
          <h1 className="text-lg  font-medium text-[#707070]">Website link</h1>
          {owner_id === userId && (
          <button
            className="text-gray-800 border rounded-full border-gray-800 p-2"
            tabIndex={-1}
          >
            <Pencil className="w-5 h-5" />
          </button>
          )}
        </div>

        <div className="flex items-center gap-x-3">
          <img src={Google} className="w-8 h-8 text-gray-900" />{" "}
          <a
            href={details[0].google}
            className="text-lg font-medium text-[#0017E7]"
          >
            {details[0].google.slice(0, 35)}...
          </a>
        </div>

        <div className="flex items-center justify-between mt-6 mb-4">
          <h1 className="text-lg  font-medium text-[#707070]">Social link</h1>
          {owner_id === userId && (
          <button
            className="text-gray-800 border rounded-full border-gray-800 p-2"
            tabIndex={-1}
          >
            <Pencil className="w-5 h-5" />
          </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 max-w-4xl gap-y-10 mb-20">
          <div className="flex items-center gap-x-3">
            <img src={Facebook} className="w-8 h-8 text-gray-900" />{" "}
            <a
              href={details[0].facebook}
              className="text-lg font-medium text-[#0017E7]"
            >
              {details[0].facebook.slice(0, 35)}...
            </a>
          </div>
          <div className="flex items-center gap-x-3">
            <img src={Instagram} className="w-8 h-8 text-gray-900" />{" "}
            <a
              href={details[0].instagram}
              className="text-lg font-medium text-[#0017E7]"
            >
              {details[0].instagram.slice(0, 35)}...
            </a>
          </div>
          <div className="flex items-center gap-x-3">
            <img src={Linkedin} className="w-8 h-8 text-gray-900" />{" "}
            <a
              href={details[0].linkedin}
              className="text-lg font-medium text-[#0017E7]"
            >
              {details[0].linkedin.slice(0, 35)}...
            </a>
          </div>
          <div className="flex items-center gap-x-3">
            <img src={Twitter} className="w-8 h-8 text-gray-900" />{" "}
            <a
              href={details[0].twitter}
              className="text-lg font-medium text-[#0017E7]"
            >
              {details[0].twitter.slice(0, 35)}...
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
