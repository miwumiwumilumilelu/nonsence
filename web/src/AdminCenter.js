import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './ClientCenter.css';
import './App.css'; // 确保样式可用

const menu = [
  { key: 'adReview', label: '广告审核' },
  { key: 'invoiceReview', label: '发票审核' },
  { key: 'user', label: '用户管理' },
  { key: 'stats', label: '平台数据' },
  { key: 'msg', label: '留言管理' },
  { key: 'discuss', label: '讨论审核' },
];

const API_BASE = 'https://djck4ikhm4.hzh.sealos.run';

function AdminCenter({ tab, setTab }) {
  const [ads, setAds] = useState([]);
  const [reviewedAds, setReviewedAds] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [userList, setUserList] = useState([]);
  const chartRef = useRef(null);
  // 留言/讨论数据
  const [messages, setMessages] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // 查询留言
  const fetchMessages = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE}/queryMessages`, { type: 2, status: 0 });
      if (res.data && res.data.ok && Array.isArray(res.data.data)) {
        setMessages(res.data.data);
      } else {
        setMessages([]);
      }
    } catch {
      setMsg('获取留言失败');
      setMessages([]);
    }
    setLoading(false);
  };
  // 查询讨论
  const fetchDiscussions = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE}/queryMessages`, { type: 1, status: 0 });
      if (res.data && res.data.ok && Array.isArray(res.data.data)) {
        setDiscussions(res.data.data);
      } else {
        setDiscussions([]);
      }
    } catch {
      setMsg('获取讨论失败');
      setDiscussions([]);
    }
    setLoading(false);
  };
  // 审核通过/删除
  const handleAudit = async (_id, status, type) => {
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE}/auditMessage`, { _id, status });
      if (res.data && res.data.ok) {
        setMsg('操作成功');
        if (type === 2) fetchMessages();
        else fetchDiscussions();
      } else {
        setMsg(res.data.error || '操作失败');
      }
    } catch {
      setMsg('网络错误');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (tab === 'msg') fetchMessages();
    if (tab === 'discuss') fetchDiscussions();
    if (tab === 'adReview') {
      axios.post(`${API_BASE}/adsReview`, { action: 'getPendingAds' }).then(res => {
        if (res.data && res.data.ok) setAds(res.data.data);
        else setAds([]);
      });
      axios.post(`${API_BASE}/adsReview`, { action: 'getReviewedAds' }).then(res => {
        if (res.data && res.data.ok) setReviewedAds(res.data.data);
        else setReviewedAds([]);
      });
    }
    if (tab === 'user') {
      axios.post(`${API_BASE}/userAdmin`, { action: 'getUsers' }).then(res => {
        if (res.data && res.data.ok) setUserList(res.data.data);
        else setUserList([]);
      });
    }
    // eslint-disable-next-line
  }, [tab]);

  // 加载本地数据
  useEffect(() => {
    const saved = localStorage.getItem('nonsence_ads');
    if (saved) setAds(JSON.parse(saved));
    const invs = localStorage.getItem('nonsence_invoices');
    if (invs) setInvoices(JSON.parse(invs));
    const recs = localStorage.getItem('nonsence_recharges');
    if (recs) setRecharges(JSON.parse(recs));
    let users = localStorage.getItem('nonsence_userlist');
    if (users) {
      setUserList(JSON.parse(users));
    } else {
      const prof = localStorage.getItem('nonsence_profile');
      if (prof) {
        setUserList([{ ...JSON.parse(prof), id: 1, enabled: true }]);
        localStorage.setItem('nonsence_userlist', JSON.stringify([{ ...JSON.parse(prof), id: 1, enabled: true }]));
      }
    }
  }, []);

  // 保存广告和发票数据
  useEffect(() => {
    localStorage.setItem('nonsence_ads', JSON.stringify(ads));
  }, [ads]);
  useEffect(() => {
    localStorage.setItem('nonsence_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('nonsence_userlist', JSON.stringify(userList));
  }, [userList]);

  // 广告审核操作
  const handleReview = (adId, actionType) => {
    axios.post(`${API_BASE}/adsReview`, { action: 'reviewAd', adId, actionType })
      .then(res => {
        if (res.data && res.data.ok) {
          axios.post(`${API_BASE}/adsReview`, { action: 'getPendingAds' }).then(res => {
            if (res.data && res.data.ok) setAds(res.data.data);
            else setAds([]);
          });
          axios.post(`${API_BASE}/adsReview`, { action: 'getReviewedAds' }).then(res => {
            if (res.data && res.data.ok) setReviewedAds(res.data.data);
            else setReviewedAds([]);
          });
        } else {
          alert(res.data.error || '操作失败');
        }
      });
  };

  // 发票审核操作
  const handleInvoiceReview = (id, status) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  // 用户禁用/启用
  const handleUserEnable = (id, enabled) => {
    setUserList(userList.map(u => u.id === id ? { ...u, enabled } : u));
  };

  // 删除用户
  const handleUserDelete = (userId) => {
    if (!window.confirm('确定要删除该用户吗？')) return;
    axios.post(`${API_BASE}/userAdmin`, { action: 'deleteUser', userId })
      .then(res => {
        if (res.data && res.data.ok) {
          axios.post(`${API_BASE}/userAdmin`, { action: 'getUsers' }).then(res => {
            if (res.data && res.data.ok) setUserList(res.data.data);
            else setUserList([]);
          });
        } else {
          alert(res.data.error || '操作失败');
        }
      });
  };

  // 平台数据统计
  const totalAds = ads.length;
  const totalRecharge = recharges.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalUsers = userList.length;
  const totalInvoices = invoices.length;
  const adStatusCount = ['待审核','投放中','已驳回'].map(status => ads.filter(ad=>ad.status===status).length);

  // 简单饼图渲染
  useEffect(() => {
    if (tab !== 'stats' || !chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    ctx.clearRect(0,0,300,300);
    const data = adStatusCount;
    const colors = ['#1976d2','#43a047','#e57373'];
    const total = data.reduce((a,b)=>a+b,0) || 1;
    let start = 0;
    data.forEach((v,i) => {
      const angle = (v/total)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(150,150);
      ctx.arc(150,150,90,start,start+angle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      start += angle;
    });
    // 图例
    ctx.fillStyle = '#1976d2'; ctx.fillRect(20,250,16,16); ctx.fillStyle='#333'; ctx.fillText('待审核',40,263);
    ctx.fillStyle = '#43a047'; ctx.fillRect(100,250,16,16); ctx.fillStyle='#333'; ctx.fillText('投放中',120,263);
    ctx.fillStyle = '#e57373'; ctx.fillRect(200,250,16,16); ctx.fillStyle='#333'; ctx.fillText('已驳回',220,263);
  }, [tab, adStatusCount]);

  return (
    <div className="client-center">
      <main className="client-main">
        {tab === 'adReview' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>广告审核</h2>
            {ads.length === 0 ? <p style={{textAlign:'center'}}>暂无待审核广告。</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>素材</th><th>提交时间</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {ads.map(ad => (
                    <tr key={ad._id}>
                      <td>{ad.name}</td>
                      <td>{ad.type}</td>
                      <td>￥{ad.budget}</td>
                      <td>{ad.start} ~ {ad.end}</td>
                      <td style={{maxWidth:120,wordBreak:'break-all'}}>{ad.material}</td>
                      <td>{ad.created}</td>
                      <td>
                        <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleReview(ad._id,'approve')}>通过</button>
                        <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleReview(ad._id,'reject')}>驳回</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <h3 style={{marginTop:32, textAlign:'center'}}>已审核广告</h3>
            {reviewedAds.length === 0 ? <p style={{textAlign:'center'}}>暂无已审核广告。</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>广告名称</th><th>类型</th><th>预算</th><th>投放时间</th><th>素材</th><th>提交时间</th><th>状态</th></tr>
                </thead>
                <tbody>
                  {reviewedAds.map(ad => (
                    <tr key={ad._id}>
                      <td>{ad.name}</td>
                      <td>{ad.type}</td>
                      <td>￥{ad.budget}</td>
                      <td>{ad.start} ~ {ad.end}</td>
                      <td style={{maxWidth:120,wordBreak:'break-all'}}>{ad.material}</td>
                      <td>{ad.created}</td>
                      <td>{ad.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'invoiceReview' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>发票审核</h2>
            {invoices.filter(inv => inv.status === '待开票').length === 0 ? <p style={{textAlign:'center'}}>暂无待开票申请。</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>申请时间</th><th>发票抬头</th><th>税号</th><th>金额</th><th>关联充值</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {invoices.filter(inv => inv.status === '待开票').map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.time}</td>
                      <td>{inv.title}</td>
                      <td>{inv.taxId}</td>
                      <td>￥{inv.amount}</td>
                      <td>{(() => {
                        const rec = recharges.find(r => String(r.id) === inv.rechargeId);
                        return rec ? `￥${rec.amount} - ${rec.time}` : '已删除';
                      })()}</td>
                      <td>
                        <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleInvoiceReview(inv.id,'已开票')}>开票</button>
                        <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleInvoiceReview(inv.id,'已驳回')}>驳回</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <h3 style={{marginTop:32, textAlign:'center'}}>已处理申请</h3>
            {invoices.filter(inv => inv.status !== '待开票').length === 0 ? <p style={{textAlign:'center'}}>暂无已处理申请。</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>申请时间</th><th>发票抬头</th><th>税号</th><th>金额</th><th>关联充值</th><th>状态</th></tr>
                </thead>
                <tbody>
                  {invoices.filter(inv => inv.status !== '待开票').map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.time}</td>
                      <td>{inv.title}</td>
                      <td>{inv.taxId}</td>
                      <td>￥{inv.amount}</td>
                      <td>{(() => {
                        const rec = recharges.find(r => String(r.id) === inv.rechargeId);
                        return rec ? `￥${rec.amount} - ${rec.time}` : '已删除';
                      })()}</td>
                      <td>{inv.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'user' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>用户管理</h2>
            {userList.length === 0 ? <p style={{textAlign:'center'}}>暂无广告主。</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>用户名</th><th>注册时间</th><th>余额</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {userList.map(u => (
                    <tr key={u._id}>
                      <td>{u.username}</td>
                      <td>{u.createdAt}</td>
                      <td>￥{u.balance}</td>
                      <td>
                        <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleUserDelete(u._id)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'stats' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>平台数据</h2>
            <div className="platform-stats" style={{justifyContent:'center'}}>
              <div className="stat-card">广告总数<br /><span>{totalAds}</span></div>
              <div className="stat-card">充值总额<br /><span>￥{totalRecharge.toFixed(2)}</span></div>
              <div className="stat-card">广告主数<br /><span>{totalUsers}</span></div>
              <div className="stat-card">发票总数<br /><span>{totalInvoices}</span></div>
            </div>
            <div style={{marginTop:32}}>
              <h3 style={{textAlign:'center'}}>广告状态分布</h3>
              <div style={{display:'flex', justifyContent:'center'}}>
                <canvas ref={chartRef} width={300} height={280} style={{background:'#f4f6fa',borderRadius:8}} />
              </div>
            </div>
          </div>
        )}
        {tab === 'msg' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>留言管理</h2>
            {loading ? <p style={{textAlign:'center'}}>加载中...</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>昵称</th><th>内容</th><th>时间</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {messages.map(m => (
                    <tr key={m._id}>
                      <td>{m.nickname}</td>
                      <td>{m.content}</td>
                      <td>{m.created ? new Date(m.created).toLocaleString() : ''}</td>
                      <td>
                        <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleAudit(m._id,1,2)}>通过</button>
                        <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleAudit(m._id,2,2)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {msg && <div style={{color:'#e57373',marginTop:8, textAlign:'center'}}>{msg}</div>}
          </div>
        )}
        {tab === 'discuss' && (
          <div>
            <h2 style={{textAlign:'center', color:'#1976d2', marginBottom:24}}>讨论审核</h2>
            {loading ? <p style={{textAlign:'center'}}>加载中...</p> : (
              <table className="ads-table">
                <thead>
                  <tr><th>昵称</th><th>内容</th><th>时间</th><th>操作</th></tr>
                </thead>
                <tbody>
                  {discussions.map(m => (
                    <tr key={m._id}>
                      <td>{m.nickname}</td>
                      <td>{m.content}</td>
                      <td>{m.created ? new Date(m.created).toLocaleString() : ''}</td>
                      <td>
                        <button style={{background:'#43a047',color:'#fff',marginRight:8}} onClick={()=>handleAudit(m._id,1,1)}>通过</button>
                        <button style={{background:'#e57373',color:'#fff'}} onClick={()=>handleAudit(m._id,2,1)}>删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {msg && <div style={{color:'#e57373',marginTop:8, textAlign:'center'}}>{msg}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminCenter; 