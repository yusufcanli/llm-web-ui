import { Button } from "./ui/button";


export default function ErrorDialog() {
  return (
    <div className="w-full mt-10">
      <div className="w-full bg-red-400/20 border border-red-600 text-red-100 p-4 rounded-md mt-4">
        <p>An unexpected error has occurred. Please make sure your LLM server is running and reachable. If the problem persists, try restarting the web UI.</p>
        <div className="w-full text-right mt-4">
          <Button onClick={() => location.reload()}>Refresh</Button>
        </div>
      </div>
    </div>
  )
}