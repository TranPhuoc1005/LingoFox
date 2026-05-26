"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api-client";
import type { CommunityPost } from "@/store/useAppStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/mascot/Mascot";
import { useAppStore } from "@/store/useAppStore";
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Mic,
  PhoneCall,
  PhoneOff,
  UserPlus,
  PlusCircle,
  Hash,
  Volume2,
  Flame,
  Globe
} from "lucide-react";

export default function StudyCommunity() {
  const { setCommunityPosts, setVoiceRooms } = useAppStore();
  const [communityPosts, setPosts] = useState<CommunityPost[]>([]);
  const [voiceRooms, setRooms] = useState<{ id: string; name: string; activeCount: number; participants: { name: string; avatar: string; speaking: boolean }[] }[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const loadPosts = useCallback(() => {
    apiGet<{ posts: CommunityPost[] }>("/api/community/posts")
      .then((res) => {
        setPosts(res.posts);
        setCommunityPosts(res.posts);
      })
      .catch(console.error);
  }, [setCommunityPosts]);

  useEffect(() => {
    loadPosts();
    apiGet<{ rooms: typeof voiceRooms }>("/api/voice-rooms")
      .then((res) => {
        setRooms(res.rooms);
        setVoiceRooms(res.rooms);
      })
      .catch(console.error);
  }, [loadPosts, setVoiceRooms]);
  
  // Post inputs
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Comment inputs indexed by postId
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleJoinRoom = (roomId: string) => setActiveRoomId(roomId);
  const handleLeaveRoom = () => setActiveRoomId(null);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    await apiPost("/api/community/posts", { title: postTitle, content: postContent });
    setPostTitle("");
    setPostContent("");
    setShowNewPostForm(false);
    loadPosts();
  };

  const handleCreateComment = async (postId: string) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) return;
    await apiPost(`/api/community/posts/${postId}/comments`, { content: comment });
    setCommentInputs({ ...commentInputs, [postId]: "" });
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    await apiPost(`/api/community/posts/${postId}/like`);
    loadPosts();
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Community Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                Cadet Forum
              </h1>
              <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                Share notes, ask IELTS/TOEIC questions, and chat with fellow learners.
              </p>
            </div>
            <Button
              variant={showNewPostForm ? "outline" : "primary"}
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              size="sm"
            >
              {showNewPostForm ? "Cancel" : "New Post"}
            </Button>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <Card className="p-6 border-2 border-primary/20 dark:border-dark-border bg-primary-light/10">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-1.5">
                  <PlusCircle className="w-5 h-5 text-primary" /> Create a New Discussion
                </h3>
                <input
                  type="text"
                  required
                  placeholder="Post title (e.g. Tips for IELTS Speaking Part 2)"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input"
                />
                <textarea
                  required
                  rows={4}
                  placeholder="What is on your mind? Share links, draft notes, or questions..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border dark:border-dark-border lf-input resize-none"
                />
                <div className="flex justify-end">
                  <Button variant="primary" type="submit">
                    Publish Post
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Feed Post Cards */}
          <div className="space-y-6">
            {communityPosts.map((post) => (
              <Card key={post.id} className="p-6 dark:border-dark-border space-y-4">
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-lg border-2 border-secondary font-black text-secondary">
                      {post.authorName[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                        {post.authorName}
                        <span className="text-[9px] font-black uppercase bg-purple-500/10 text-secondary px-2 py-0.5 rounded-md">
                          Lvl {post.authorLevel}
                        </span>
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-bold block">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-zinc-400">
                    <Globe className="w-4 h-4" /> <span>Public</span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-slate-800 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-zinc-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center gap-6 border-y border-border dark:border-dark-border py-2.5 text-xs font-black text-zinc-500">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer
                      ${post.likedByUser ? "text-primary font-black" : ""}
                    `}
                  >
                    <ThumbsUp className={`w-4.5 h-4.5 ${post.likedByUser ? "fill-primary/10" : ""}`} />
                    <span>{post.likes} Likes</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4.5 h-4.5" />
                    <span>{post.comments.length} Comments</span>
                  </div>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-border dark:border-dark-border py-1">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-xs font-semibold space-y-1 bg-zinc-50 dark:bg-dark-card p-2.5 rounded-2xl">
                        <span className="font-extrabold text-slate-800 dark:text-white">
                          {comment.authorName}
                        </span>
                        <p className="text-zinc-500 dark:text-zinc-400">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [post.id]: e.target.value
                      })
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleCreateComment(post.id)}
                    className="lf-input flex-1 text-xs"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleCreateComment(post.id)}>
                    Reply
                  </Button>
                </div>

              </Card>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Voice Study Rooms */}
        <div className="space-y-6">
          
          {/* Active Voice Call Status Box */}
          {activeRoomId && (
            <Card className="p-4 bg-emerald-500/10 border-2 border-success text-success space-y-3 animate-pulse-glow">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-black uppercase">
                  <PhoneCall className="w-4 h-4" /> Connected to Call
                </span>
                <button
                  onClick={handleLeaveRoom}
                  className="p-1 rounded-lg bg-danger/10 hover:bg-danger text-danger hover:text-white transition-colors cursor-pointer"
                  title="Disconnect Call"
                >
                  <PhoneOff className="w-4.5 h-4.5" />
                </button>
              </div>
              <p className="text-xs font-bold leading-normal text-slate-600 dark:text-zinc-400">
                You are currently in: <strong className="text-success">{voiceRooms.find(r => r.id === activeRoomId)?.name}</strong>
              </p>
            </Card>
          )}

          {/* Discord-like Voice Servers */}
          <div className="space-y-4">
            <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-secondary" /> Voice Study Rooms
            </h3>

            <div className="space-y-3">
              {voiceRooms.map((room) => {
                const isUserInRoom = activeRoomId === room.id;
                
                return (
                  <Card key={room.id} className="p-4 border-2 dark:border-dark-border space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                          {room.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400 font-bold">
                          {room.activeCount} members inside
                        </span>
                      </div>
                      
                      {isUserInRoom ? (
                        <Button variant="danger" size="sm" onClick={handleLeaveRoom}>
                          Leave
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleJoinRoom(room.id)}>
                          Join Room
                        </Button>
                      )}
                    </div>

                    {/* Participants List */}
                    {room.participants.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-border dark:border-dark-border">
                        {room.participants.map((part) => (
                          <div
                            key={part.name}
                            title={`${part.name} ${part.speaking ? "(Speaking...)" : ""}`}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border
                              ${
                                part.speaking
                                  ? "border-success bg-success/10 text-success animate-pulse"
                                  : "border-border bg-zinc-50 dark:border-slate-700 dark:bg-dark-card text-zinc-500"
                              }
                            `}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold">
                              {part.avatar}
                            </span>
                            <span>{part.name.split(" ")[0]}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Mascot Teacher Tip */}
          <Card className="p-4 dark:border-dark-border flex flex-col items-center">
            <Mascot
              expression="idle"
              message="Shadowing dialogues in voice study rooms boosts speaking fluency! 🎙️🦊"
              size={120}
            />
          </Card>

        </div>

      </div>
    </AppLayout>
  );
}
