"use client";

import { runAdOptimization } from "@/actions/optimize-ads";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

export default function Footer() {
  const { toast } = useToast();

  const handleOptimizeAds = async () => {
    toast({
      title: "Running Ad Optimization...",
      description: "The GenAI model is analyzing the ad placements. Check server console for output.",
    });
    const result = await runAdOptimization({ pageType: "Homepage" });
    toast({
      title: result.success ? "Optimization Complete" : "Optimization Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ApexStream. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
             <Button
                variant="outline"
                size="sm"
                onClick={handleOptimizeAds}
              >
                <Bot className="mr-2 h-4 w-4" />
                Optimize Ads (Dev)
              </Button>
            <p className="text-sm text-muted-foreground">Privacy Policy</p>
            <p className="text-sm text-muted-foreground">Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
