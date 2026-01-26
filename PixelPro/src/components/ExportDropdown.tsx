import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileCode, Globe, Layers } from "lucide-react";
import { downloadComponent } from "@/utils/fileExport";

interface ExportDropdownProps {
  code: string;
  framework: string; // "html" | "tailwind" | "react"
}

export const ExportDropdown = ({ code, framework }: ExportDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* HTML Option */}
        <DropdownMenuItem onClick={() => downloadComponent(code, "html")} className="gap-2 cursor-pointer">
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Download .html</span>
          {framework !== "react" && <span className="ml-auto text-[10px] bg-primary/10 px-1 rounded">Best</span>}
        </DropdownMenuItem>

        {/* React Option */}
        <DropdownMenuItem onClick={() => downloadComponent(code, "tsx")} className="gap-2 cursor-pointer">
          <FileCode className="w-4 h-4 text-cyan-500" />
          <span>Download .tsx</span>
          {framework === "react" && <span className="ml-auto text-[10px] bg-primary/10 px-1 rounded">Best</span>}
        </DropdownMenuItem>

        {/* Vue Option */}
        <DropdownMenuItem onClick={() => downloadComponent(code, "vue")} className="gap-2 cursor-pointer">
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>Download .vue</span>
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};