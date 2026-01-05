export default function Feedback() {
  return (
    <section className="py-28 bg-black text-white overflow-visible">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">
          What Our Users Say
        </h2>

        {/* Added 'touch-auto' to ensure touchpad gestures are passed 
           to the browser correctly 
        */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 transition-transform duration-500 hover:scale-[1.01] touch-auto">
          <p className="text-gray-300 mb-4 italic text-lg leading-relaxed">
            “This AI platform completely transformed our customer engagement.
            Productivity increased within days.”
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-px bg-blue-500/50" />
            <span className="text-blue-400 font-medium tracking-wide text-sm uppercase">
              Product Manager
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}