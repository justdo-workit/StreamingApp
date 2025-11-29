'use client';

export default function RightSideChat() {
  return (
    <div className="w-full max-w-full bg-blue-600  pb-4 overflow-hidden">
      <div className="aspect-[3/5] w-full">
        <iframe
          src="https://tlk.io/qatar-gp-live"
          title="Qatar GP Live Chat"
          className="w-full h-full border-0"
          allow="microphone; camera"
        />
      </div>
    </div>
  );
}
