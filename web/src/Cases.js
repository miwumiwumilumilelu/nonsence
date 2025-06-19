import React, { useEffect, useState } from 'react';
import './Cases.css';
import './App.css';
import axios from 'axios';

const API_BASE = 'https://djck4ikhm4.hzh.sealos.run';

function Cases() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取所有已通过广告
    axios.post(`${API_BASE}/adsReview`, { action: 'getReviewedAds' })
      .then(res => {
        if (res.data && res.data.ok && Array.isArray(res.data.data)) {
          setAds(res.data.data.filter(ad => ad.status === '已通过'));
        } else {
          setAds([]);
        }
        setLoading(false);
      })
      .catch(() => { setAds([]); setLoading(false); });
  }, []);
  return (
    <div className="cases-bg">
      <div className="cases-wave-bg">
        <svg className="cases-wave-anim" viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a5b4fc" fillOpacity="0.35" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z"/>
        </svg>
      </div>
      <div className="page-card cases-card">
        <div className="page-section-title">广告案例</div>
        {loading ? <div style={{textAlign:'center',margin:'48px 0'}}>加载中...</div> : (
          <div className="cases-list" style={{display:'flex',flexDirection:'column',gap:32,justifyContent:'center',alignItems:'center'}}>
            {ads.length === 0 ? <div style={{color:'#888',marginTop:48}}>暂无已通过广告</div> : (
              ads.map(ad => (
                <div className="case-row" key={ad._id} style={{width:820,maxWidth:'98vw',background:'#fff',borderRadius:16,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',padding:'32px 32px 32px 32px',display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24}}>
                  {/* 广告名 居中 顶部 */}
                  <div style={{fontWeight:700,fontSize:26,textAlign:'center',marginBottom:24,width:'100%'}}>{ad.name}</div>
                  {/* 下方左右分栏 */}
                  <div style={{display:'flex',flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
                    {/* 左侧广告信息 */}
                    <div style={{flex:1,minWidth:0,marginLeft:20}}>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>广告ID：{ad._id}</div>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>用户名称：{ad.username || '未知'}</div>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>用户ID：{ad.userId || '未知'}</div>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>类型：{ad.type}</div>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>预算：￥{ad.budget}</div>
                      <div style={{color:'#888',fontSize:15,marginBottom:6,textAlign:'left'}}>投放时间：{ad.start} ~ {ad.end}</div>
                      {/* 广告介绍 */}
                      <div
                        style={{
                          marginTop: 24,
                          padding: '16px 18px',
                          background: '#f7f8fa',
                          borderRadius: 8,
                          color: '#333',
                          fontSize: 16,
                          lineHeight: 1.8,
                          maxWidth: 480,
                          textAlign: 'left',
                          marginLeft: 0 // 左对齐
                        }}
                      >
                        {ad.desc ? ad.desc : <span style={{color:'#bbb'}}>暂无广告介绍</span>}
                      </div>
                    </div>
                    {/* 右侧素材预览 */}
                    <div style={{width:340,minWidth:200,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',marginLeft:32}}>
                      {ad.material && (ad.material.endsWith('.jpg') || ad.material.endsWith('.jpeg') || ad.material.endsWith('.png') || ad.material.endsWith('.gif') || ad.material.endsWith('.webp')) ? (
                        <>
                          <img src={ad.material} alt="广告图片" style={{maxWidth:320,maxHeight:220,borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}} />
                          <div style={{marginTop:12,textAlign:'center'}}>
                            <a href={ad.material} download target="_blank" rel="noopener noreferrer" style={{fontSize:15,color:'#1976d2'}}>下载图片</a>
                          </div>
                        </>
                      ) : ad.material && (ad.material.endsWith('.mp4') || ad.material.endsWith('.webm') || ad.material.endsWith('.mov')) ? (
                        <>
                          <video src={ad.material} controls style={{maxWidth:320,maxHeight:220,borderRadius:10,boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}} />
                          <div style={{marginTop:12,textAlign:'center'}}>
                            <a href={ad.material} download target="_blank" rel="noopener noreferrer" style={{fontSize:15,color:'#1976d2'}}>下载视频</a>
                          </div>
                        </>
                      ) : (
                        <span style={{color:'#444',fontSize:16}}>{ad.material}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cases; 