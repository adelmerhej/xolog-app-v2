/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from "next/navigation";
import { Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { SidebarInput } from "@/components/ui/sidebar"
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
 const router = useRouter();
 
  const handleClear = () => {
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/ai?prompt=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <div className="relative w-96">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Ask AI about this page..."
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'block w-full pl-10 pr-10 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500',
            isFocused ? 'ring-2 ring-blue-300 dark:ring-blue-700' : ''
          )}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </div>
    </form>
  )
}
