// app/not-found.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="font-archivo min-h-dvh flex flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-center text-lg">The page you are looking for could not be found.</p>
      <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
