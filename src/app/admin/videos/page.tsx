"use client";

import { Video, Bell } from "lucide-react";

export default function AdminVideosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #5C1A8C, #7B22BC)" }}>
        <Video size={36} className="text-white" />
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">Coming Soon</span>
      </div>

      <h1 className="font-heading text-3xl font-bold text-gray-900 mb-3">
        Get Ready With Me Videos
      </h1>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
        We are building a beautiful way to showcase your TikTok &ldquo;Get Ready With Me&rdquo; videos
        directly on your site. This feature will be available shortly.
      </p>

      <div className="flex flex-col items-center gap-2 p-5 bg-brand-light-purple rounded-2xl border border-brand-purple/10 max-w-xs">
        <Bell size={18} className="text-brand-purple" />
        <p className="text-xs text-brand-purple font-medium text-center">
          Once launched you will be able to manage and display your TikTok videos here.
        </p>
      </div>
    </div>
  );
}
