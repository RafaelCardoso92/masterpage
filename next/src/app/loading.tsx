export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#03397a] to-[#022a5c]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
