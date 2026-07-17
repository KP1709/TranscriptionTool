import Transcription from "@/components/custom/transcription";

export default function App() {

  return (
    <div className='p-2 w-full max-w-300'>
      <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">Speechmatics Live Transcription Demo</h2>
      <Transcription />
    </div>
  );
}