import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function SentimentMap() {
    return (
        <div className="h-[350px] w-full rounded-lg overflow-hidden relative">
            <Image
                src="https://placehold.co/800x600/0B0B0B/3EF0C6.png"
                layout="fill"
                objectFit="cover"
                alt="World map showing data sentiment"
                data-ai-hint="world map"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
             <div className="absolute bottom-4 left-4 text-sm text-foreground p-2 bg-background/80 rounded-md">
                Feature coming soon: Interactive sentiment map.
            </div>
        </div>
    );
}
