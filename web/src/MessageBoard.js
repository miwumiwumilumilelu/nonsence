import React, { useState, useEffect } from 'react';
import './MessageBoard.css';
import './App.css'; // 确保样式可用

const STORAGE_KEY = 'nonsence_discussions';

function MessageBoard() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState({}); // {postIdx: replyText}
  const [replyName, setReplyName] = useState({}); // {postIdx: replyName}

  // 加载本地讨论
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // 每次讨论变化都保存到本地
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  // 发布主贴
  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setPosts([{ name, content, time: new Date().toLocaleString(), replies: [] }, ...posts]);
    setContent('');
  };

  // 回复主贴
  const handleReply = idx => {
    const replyText = replyContent[idx];
    const rName = replyName[idx];
    if (!rName || !replyText) return;
    const newPosts = posts.map((post, i) =>
      i === idx
        ? { ...post, replies: [{ name: rName, content: replyText, time: new Date().toLocaleString() }, ...(post.replies || [])] }
        : post
    );
    setPosts(newPosts);
    setReplyContent({ ...replyContent, [idx]: '' });
    setReplyName({ ...replyName, [idx]: '' });
  };

  return (
    <div className="page-card">
      <div className="page-section-title">社区讨论区</div>
      <div className="message-board">
        <h2>讨论区</h2>
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="昵称"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="发起新讨论..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button type="submit">发布主题</button>
        </form>
        <div className="messages-list">
          {posts.length === 0 && <p className="no-msg">暂无讨论，快来发帖吧！</p>}
          {posts.map((post, i) => (
            <div className="message-item" key={i}>
              <div className="msg-header">
                <span className="msg-name">{post.name}</span>
                <span className="msg-time">{post.time}</span>
              </div>
              <div className="msg-content">{post.content}</div>
              <div className="replies-list">
                {post.replies && post.replies.length > 0 && post.replies.map((reply, j) => (
                  <div className="reply-item" key={j}>
                    <span className="reply-name">{reply.name}</span>
                    <span className="reply-time">{reply.time}</span>
                    <span className="reply-content">{reply.content}</span>
                  </div>
                ))}
              </div>
              <form className="reply-form" onSubmit={e => { e.preventDefault(); handleReply(i); }}>
                <input
                  type="text"
                  placeholder="昵称"
                  value={replyName[i] || ''}
                  onChange={e => setReplyName({ ...replyName, [i]: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="回复内容"
                  value={replyContent[i] || ''}
                  onChange={e => setReplyContent({ ...replyContent, [i]: e.target.value })}
                  required
                />
                <button type="submit">回复</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageBoard; 