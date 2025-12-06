'use client';

export default function RightSideChat() {
  return (
    <div className="w-full max-w-full bg-gray-200  pb-4 overflow-hidden">
      <div className="aspect-[3/5] w-full">
        <iframe
          src="https://tlk.io/AbuDhabi_GP"
          title="Abu Dhabi GP"
          className="w-full h-full border-0"
          data-theme="theme--night" 
          allow="microphone; camera"
        />
      </div>
    </div>
  );
}

//https://rebrand.ly/slipstreams