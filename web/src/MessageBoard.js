import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MessageBoard.css';
import './App.css'; // 确保样式可用

const API_BASE = 'https://djck4ikhm4.hzh.sealos.run';

function MessageBoard() {
  const [posts, setPosts] = useState([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  // 回复相关
  const [replyContent, setReplyContent] = useState({}); // {postId: replyText}
  const [replyName, setReplyName] = useState({}); // {postId: replyName}
  const [replyMsg, setReplyMsg] = useState({}); // {postId: msg}
  const [replyLoading, setReplyLoading] = useState({}); // {postId: bool}

  // 获取已审核通过的讨论
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.post(`${API_BASE}/queryMessages`, { type: 1, status: 1 });
      if (res.data && res.data.ok && Array.isArray(res.data.data)) {
        setPosts(res.data.data);
      } else {
        setPosts([]);
      }
    } catch {
      setMsg('获取讨论失败');
      setPosts([]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) {
      setMsg('请填写完整信息');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE}/message`, {
        nickname,
        content,
        type: 1 // 社区留言
      });
      if (res.data && res.data.ok) {
        setMsg('留言成功，等待审核！');
        setNickname('');
        setContent('');
        fetchPosts();
      } else {
        setMsg(res.data.error || '提交失败');
      }
    } catch {
      setMsg('网络错误，请稍后再试');
    }
    setLoading(false);
  };

  // 回复功能
  const handleReply = async (_id) => {
    const rName = replyName[_id];
    const rContent = replyContent[_id];
    if (!rName || !rContent) {
      setReplyMsg(m => ({ ...m, [_id]: '请填写昵称和回复内容' }));
      return;
    }
    setReplyLoading(m => ({ ...m, [_id]: true }));
    setReplyMsg(m => ({ ...m, [_id]: '' }));
    try {
      const res = await axios.post(`${API_BASE}/replyMessage`, { _id, nickname: rName, content: rContent });
      if (res.data && res.data.ok) {
        setReplyMsg(m => ({ ...m, [_id]: '回复成功' }));
        setReplyContent(m => ({ ...m, [_id]: '' }));
        setReplyName(m => ({ ...m, [_id]: '' }));
        fetchPosts();
      } else {
        setReplyMsg(m => ({ ...m, [_id]: res.data.error || '回复失败' }));
      }
    } catch {
      setReplyMsg(m => ({ ...m, [_id]: '网络错误' }));
    }
    setReplyLoading(m => ({ ...m, [_id]: false }));
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
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
          />
          <textarea
            placeholder="发起新讨论..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>{loading ? '发布中...' : '发布主题'}</button>
          {msg && <div className="contact-success">{msg}</div>}
        </form>
        <div className="messages-list">
          {posts.length === 0 && <p className="no-msg">暂无讨论，快来发帖吧！</p>}
          {posts.map((post, i) => (
            <div className="message-item" key={post._id || i}>
              <div className="msg-header">
                <span className="msg-name">{post.nickname}</span>
                <span className="msg-time">{post.created ? new Date(post.created).toLocaleString() : ''}</span>
              </div>
              <div className="msg-content">{post.content}</div>
              {/* 展示所有回复 */}
              <div className="replies-list">
                {Array.isArray(post.replies) && post.replies.length > 0 && post.replies.map((reply, j) => (
                  <div className="reply-item" key={j}>
                    <span className="reply-name">{reply.nickname}</span>
                    <span className="reply-time">{reply.created ? new Date(reply.created).toLocaleString() : ''}</span>
                    <span className="reply-content">{reply.content}</span>
                  </div>
                ))}
              </div>
              {/* 回复表单 */}
              <form className="reply-form" onSubmit={e => { e.preventDefault(); handleReply(post._id); }}>
                <input
                  type="text"
                  placeholder="昵称"
                  value={replyName[post._id] || ''}
                  onChange={e => setReplyName({ ...replyName, [post._id]: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="回复内容"
                  value={replyContent[post._id] || ''}
                  onChange={e => setReplyContent({ ...replyContent, [post._id]: e.target.value })}
                  required
                />
                <button type="submit" disabled={replyLoading[post._id]}>{replyLoading[post._id] ? '回复中...' : '回复'}</button>
                {replyMsg[post._id] && <div className="contact-success">{replyMsg[post._id]}</div>}
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessageBoard; 