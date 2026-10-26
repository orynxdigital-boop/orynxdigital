import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import { storage, TradeData, CommentData } from "../services/storage";

export default function Trades() {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentTrade, setActiveCommentTrade] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingTrade, setLikingTrade] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [fetchedTrades, fetchedComments] = await Promise.all([
        storage.getTrades(),
        storage.getComments()
      ]);
      // Sort trades by newest first
      setTrades(fetchedTrades.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching trades data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLike = async (trade: TradeData) => {
    if (likingTrade) return;
    setLikingTrade(trade.id);
    
    // Optimistic update
    setTrades(prev => prev.map(t => t.id === trade.id ? { ...t, likes: (Number(t.likes) || 0) + 1 } : t));
    
    try {
      await storage.updateData("Trades", trade.id, { likes: (Number(trade.likes) || 0) + 1 });
    } catch (error) {
      console.error("Error liking trade:", error);
      // Revert on failure
      setTrades(prev => prev.map(t => t.id === trade.id ? { ...t, likes: Number(t.likes) || 0 } : t));
    } finally {
      setLikingTrade(null);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, tradeId: string) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim() || submittingComment) return;
    
    setSubmittingComment(true);
    const commentData = {
      tradeId,
      userName,
      content: newComment,
    };

    try {
      const success = await storage.addData("Comments", commentData);
      if (success) {
        setNewComment("");
        // Refresh comments
        const updatedComments = await storage.getComments();
        setComments(updatedComments);
      } else {
        alert("Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-24">
          <span className="section-label">[ 004 // ACTIVITY_LOG ]</span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-light text-white leading-none tracking-tighter"
          >
            Digital <span className="text-slate-500 italic">Intelligence</span>.
          </motion.h1>
        </div>

        <div className="space-y-20">
          {trades.length > 0 ? trades.map((trade, index) => {
            const tradeComments = comments.filter(c => c.tradeId === trade.id);
            const isCommenting = activeCommentTrade === trade.id;

            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="industrial-card group border-white/5 bg-transparent overflow-hidden"
              >
                {/* Trade Header & Content */}
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col gap-2">
                      <div className="font-mono text-[9px] text-brand-accent uppercase tracking-[0.2em]">Transmission_Source: ADMIN</div>
                      <h2 className="text-3xl font-display font-light text-white tracking-tight leading-tight">{trade.title}</h2>
                    </div>
                    <span className="font-mono text-[10px] text-slate-700 uppercase tracking-widest border border-white/5 px-2 py-1">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-400 font-light leading-relaxed mb-10 whitespace-pre-wrap text-sm md:text-md">
                    {trade.content}
                  </p>
                </div>

                {/* Trade Image */}
                {trade.image && (
                  <div className="w-full bg-black flex items-center justify-center border-y border-white/5 relative overflow-hidden">
                    <img 
                      src={trade.image} 
                      alt={trade.title}
                      referrerPolicy="no-referrer"
                      className="w-full max-h-[600px] object-contain opacity-80 shadow-2xl group-hover:opacity-100 transition-all duration-[800ms] ease-in-out"
                    />
                  </div>
                )}

                {/* Action Bar */}
                <div className="px-8 py-6 border-t border-white/5 flex items-center gap-8 bg-white/[0.01]">
                  <button 
                    onClick={() => handleLike(trade)}
                    disabled={likingTrade === trade.id}
                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group/btn"
                  >
                    <div className="w-8 h-8 border border-white/5 flex items-center justify-center group-hover/btn:border-brand-accent transition-all">
                      <Heart className={`w-3.5 h-3.5 ${Number(trade.likes) > 0 ? 'fill-brand-accent text-brand-accent' : 'text-slate-500 group-hover/btn:text-brand-accent'}`} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest">{Number(trade.likes) || 0} SECURE_SAVE</span>
                  </button>
                  
                  <button 
                    onClick={() => setActiveCommentTrade(isCommenting ? null : trade.id)}
                    className="flex items-center gap-3 text-slate-500 hover:text-white transition-all group/btn"
                  >
                    <div className="w-8 h-8 border border-white/5 flex items-center justify-center group-hover/btn:border-white/20 transition-all">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest">{tradeComments.length} RESPONSES</span>
                  </button>
                </div>

                {/* Comments Section */}
                {isCommenting && (
                  <div className="p-8 md:p-12 border-t border-white/5 bg-black/40">
                    {/* Comment List */}
                    <div className="space-y-6 mb-12 max-h-80 overflow-y-auto custom-scrollbar pr-4">
                      {tradeComments.length > 0 ? tradeComments.map(comment => (
                        <div key={comment.id} className="border-l border-brand-accent/30 pl-6 py-2">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-mono text-[10px] text-brand-accent uppercase tracking-widest">{comment.userName}</span>
                            <span className="font-mono text-[8px] text-slate-700">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm font-light leading-relaxed">{comment.content}</p>
                        </div>
                      )) : (
                        <p className="font-mono text-[9px] text-slate-700 text-center py-8 uppercase tracking-widest">
                          SYSTEM_WAITING: NO_INCOMING_COMMENTS
                        </p>
                      )}
                    </div>

                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(e, trade.id)} className="space-y-6 pt-6 border-t border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                          type="text"
                          required
                          placeholder="USER_AUTH_NAME"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 py-3 text-white text-xs font-mono focus:outline-none focus:border-brand-accent transition-colors placeholder:text-slate-800"
                        />
                        <div className="flex gap-4">
                          <input
                            type="text"
                            required
                            placeholder="INPUT_COMMENT_PAYLOAD..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 bg-transparent border-b border-white/10 py-3 text-white text-xs font-mono focus:outline-none focus:border-brand-accent transition-colors placeholder:text-slate-800"
                          />
                          <button 
                            type="submit"
                            disabled={submittingComment || !newComment.trim() || !userName.trim()}
                            className="w-12 h-12 border border-brand-accent text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all disabled:opacity-30"
                          >
                            {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            );
          }) : (
            <div className="text-center py-32 border border-dashed border-white/10 font-mono text-[10px] text-slate-700 uppercase tracking-widest">
               EMPTY_FEED: NO_ACTIVITY_RECORDS_DETECTED
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
