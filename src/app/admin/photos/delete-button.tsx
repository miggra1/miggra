"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      className={`text-[10px] text-white/80 hover:text-red-300 transition ${loading ? "opacity-50 cursor-wait" : "opacity-0 group-hover:opacity-100"}`}
      disabled={loading}
      onClick={async () => {
        if (!confirm("确定删除这张照片？")) return;
        setLoading(true);
        await fetch(`/api/photos/${id}`, { method: "DELETE" });
        router.refresh();
      }}
    >
      删除
    </button>
  );
}
