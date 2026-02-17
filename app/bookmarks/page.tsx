"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ExternalLink,
  Plus,
  LogOut,
  Bookmark as BookmarkIcon,
} from "lucide-react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarksPage() {
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState("");

  // 🔹 Auth user info
  const [userName, setUserName] = useState("User");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let channel: any;

    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push("/login");
        return;
      }

      const user = data.session.user;

      // ✅ ALL DATA FROM SUPABASE AUTH
      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      const avatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;

      setUserId(user.id);
      setUserName(name);
      setAvatarUrl(avatar);

      await fetchBookmarks(user.id);
      setLoading(false);

      // Welcome toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      // Realtime updates
      channel = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          () => fetchBookmarks(user.id)
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  const fetchBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !url.includes(".")) return;

    const formattedUrl = url.startsWith("http")
      ? url
      : `https://${url}`;

    await supabase.from("bookmarks").insert({
      title,
      url: formattedUrl,
      user_id: userId,
    });

    setTitle("");
    setUrl("");
  };

 const deleteBookmark = async (id: string) => {
  // ✅ Optimistic UI update
  setBookmarks((prev) => prev.filter((b) => b.id !== id));

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    // rollback if failed
    fetchBookmarks(userId);
  }
};


  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 flex items-center justify-center p-4">

      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" />

      {/* Welcome Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <BookmarkIcon className="w-5 h-5" />
            <span className="font-medium">
              Welcome back, {userName}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">

          {/* Logo */}
         <div className="text-center mb-3">
  {/* Added justify-center to center the content and items-center to align icon vertically */}
  <h1 className="flex items-center justify-center text-2xl font-extrabold text-white tracking-tight">
    BookMark
    <span className="ml-2 inline-flex p-1.5 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
      <BookmarkIcon className="text-white w-6 h-6" />
    </span>
  </h1>
</div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white leading-none">
                  {userName}
                </p>
                <p className="text-xs text-slate-400">
                Welcome
                </p>
              </div>

              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Add Bookmark */}
        <form onSubmit={addBookmark} className="p-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Bookmark Title"
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="URL (google.com)"
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Bookmark
          </button>
        </form>

        {/* List */}
        <div className="px-8 pb-8">
          <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            <AnimatePresence>
              {bookmarks.map((b) => (
                <motion.li
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-2xl"
                >
                  <div>
                    <p className="text-white font-medium truncate">
                      {b.title}
                    </p>
                    <p className="text-slate-500 text-sm truncate">
                      {b.url}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={b.url}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-indigo-400"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() => deleteBookmark(b.id)}
                      className="p-2 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>

            {!loading && bookmarks.length === 0 && (
              <p className="text-center text-slate-500 py-10">
                No bookmarks yet.
              </p>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
