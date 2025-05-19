// "use client";

// import { cn } from "@/lib/utils";
// import Image from "next/image";

// interface AgentProps {
//   userName: string;
// }

// enum CallStatus {
//   INACTIVE = "INACTIVE",
//   CONNECTING = "CONNECTING",
//   ACTIVE = "ACTIVE",
//   FINISHED = "FINISHED",
// }

// const messages = [
//   "What is your name?",
//   "My name is John Doe, nice to meet you!",
// ];

// const lastMessage = messages[messages.length - 1];

// const Agent = ({ userName }: AgentProps) => {
//   const isSpeaking = true;
//   const callStatus = CallStatus.INACTIVE;

//   return (
//     <div className="flex flex-wrap justify-center gap-6 pt-4">
//       {/* AI Interviewer Card */}
//       <div className="flex flex-col items-center justify-center w-96 h-80 bg-gradient-to-br from-[#1c133d] to-[#0e0b1e] rounded-2xl border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
//         <div className="relative w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-[#2d2154]">
//           <Image
//             src="/ai-avatar.png"
//             alt="AI Interviewer"
//             width={65}
//             height={65}
//             className="object-cover"
//           />
//           {isSpeaking && (
//             <span className="absolute z-0 w-full h-full bg-blue-400 rounded-full opacity-70 animate-ping" />
//           )}
//           <div className="absolute inset-0 border-2 border-indigo-400 rounded-full opacity-40" />
//         </div>
//         <h3 className="text-lg font-semibold text-white">AI Interviewer</h3>
//       </div>

//       {/* User Card */}
//       <div className="flex flex-col items-center justify-center w-96 h-80 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-gray-500/50 shadow-[0_0_10px_rgba(156,163,175,0.3)]">
//         <div className="w-24 h-24 mb-4 overflow-hidden border-2 rounded-full border-gray-400/30">
//           <Image
//             src="/user-avatar.png"
//             alt="User Avatar"
//             width={96}
//             height={96}
//             className="object-cover w-full h-full"
//           />
//         </div>
//         <h3 className="text-lg font-semibold text-white">{userName}</h3>
//       </div>

//       {/* Last Message Display */}
//       {messages.length > 0 && (
//         <div className="flex items-center justify-center w-full mt-4">
//           <div className="px-4 py-3 text-sm text-white bg-gray-800 shadow-md w-96 rounded-xl animate-fadeIn">
//             {lastMessage}
//           </div>
//         </div>
//       )}

//       {/* Call / End Button */}
//       <div className="flex justify-center w-full mt-4">
//         {callStatus !== CallStatus.ACTIVE ? (
//           <button
//             className={cn(
//               "relative px-6 py-3 rounded-md font-semibold text-white transition-colors shadow-md",
//               callStatus === CallStatus.CONNECTING
//                 ? "bg-yellow-500 cursor-wait"
//                 : "bg-red-600 hover:bg-red-700"
//             )}
//           >
//             <span
//               className={cn(
//                 "absolute inset-0 rounded-md animate-ping bg-yellow-400 opacity-50",
//                 callStatus !== CallStatus.CONNECTING && "hidden"
//               )}
//             />
//             <span className="relative z-10">
//               {callStatus === CallStatus.INACTIVE ||
//               callStatus === CallStatus.FINISHED
//                 ? "Call"
//                 : ". . ."}
//             </span>
//           </button>
//         ) : (
//           <button className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-md shadow-md hover:bg-green-700">
//             End
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Agent;

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AgentProps {
  userName: string;
  userId: string;
  type: "generate" | "interview";
}

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const messages = [
  "What is your name?",
  "My name is John Doe, nice to meet you!",
];

const lastMessage = messages[messages.length - 1];

const Agent = ({ userName, userId }: AgentProps) => {
  console.log("UserId:", userId);
  const isSpeaking = true;

  // ✅ Use useState with correct typing
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  return (
    <div className="flex flex-wrap justify-center gap-6 pt-4">
      {/* AI Interviewer */}
      <div className="flex flex-col items-center justify-center w-96 h-80 bg-gradient-to-br from-[#1c133d] to-[#0e0b1e] rounded-2xl border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
        <div className="relative w-24 h-24 mb-4 flex items-center justify-center rounded-full bg-[#2d2154]">
          <Image
            src="/ai-avatar.png"
            alt="AI Interviewer"
            width={65}
            height={65}
            className="object-cover"
          />
          {isSpeaking && (
            <span className="absolute z-0 w-full h-full bg-blue-400 rounded-full opacity-70 animate-ping" />
          )}
          <div className="absolute inset-0 border-2 border-indigo-400 rounded-full opacity-40" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Interviewer</h3>
      </div>

      {/* User */}
      <div className="flex flex-col items-center justify-center w-96 h-80 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-gray-500/50 shadow-[0_0_10px_rgba(156,163,175,0.3)]">
        <div className="w-24 h-24 mb-4 overflow-hidden border-2 rounded-full border-gray-400/30">
          <Image
            src="/user-avatar.png"
            alt="User Avatar"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-lg font-semibold text-white">{userName}</h3>
      </div>

      {/* Last Message */}
      {messages.length > 0 && (
        <div className="flex items-center justify-center w-full mt-4">
          <div className="px-4 py-3 text-sm text-white bg-gray-800 shadow-md w-96 rounded-xl animate-fadeIn">
            {lastMessage}
          </div>
        </div>
      )}

      {/* Call/End Button */}
      <div className="flex justify-center w-full mt-4">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={() => {
              if (callStatus === CallStatus.INACTIVE) {
                setCallStatus(CallStatus.CONNECTING);
              }
            }}
            className={cn(
              "relative px-6 py-3 rounded-md font-semibold text-white transition-colors shadow-md",
              callStatus === CallStatus.CONNECTING
                ? "bg-yellow-500 cursor-wait"
                : "bg-red-600 hover:bg-red-700"
            )}
          >
            <span
              className={cn(
                "absolute inset-0 rounded-md animate-ping bg-yellow-400 opacity-50",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span className="relative z-10">
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setCallStatus(CallStatus.FINISHED)}
            className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-md shadow-md hover:bg-green-700"
          >
            End
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
