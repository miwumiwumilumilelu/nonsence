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
          // 只展示已通过的广告
          setAds(res.data.data.filter(ad => ad.status === '已通过'));
        } else {
          setAds([]);
        }
        setLoading(false);
      })
      .catch(() => { setAds([]); setLoading(false); });
  }, []);

  return (
    <div className="page-card">
      <div className="page-section-title">广告案例</div>
      {loading ? <div style={{textAlign:'center',margin:'48px 0'}}>加载中...</div> : (
        <div className="cases-list" style={{display:'flex',flexWrap:'wrap',gap:32,justifyContent:'center'}}>
          {ads.length === 0 ? <div style={{color:'#888',marginTop:48}}>暂无已通过广告</div> : (
            ads.map(ad => (
              <div className="case-card" key={ad._id} style={{width:320,background:'#fff',borderRadius:12,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',padding:24,display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24}}>
                {/* 素材预览 */}
                <div style={{minHeight:120,marginBottom:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {ad.material && (ad.material.endsWith('.jpg') || ad.material.endsWith('.jpeg') || ad.material.endsWith('.png') || ad.material.endsWith('.gif') || ad.material.endsWith('.webp')) ? (
                    <img src={ad.material} alt="广告图片" style={{maxWidth:180,maxHeight:120,borderRadius:8}} />
                  ) : ad.material && (ad.material.endsWith('.mp4') || ad.material.endsWith('.webm') || ad.material.endsWith('.mov')) ? (
                    <video src={ad.material} controls style={{maxWidth:180,maxHeight:120,borderRadius:8}} />
                  ) : (
                    <span style={{color:'#444',fontSize:16}}>{ad.material}</span>
                  )}
                </div>
                <div style={{width:'100%',textAlign:'left'}}>
                  <div style={{fontWeight:600,fontSize:18,marginBottom:6}}>{ad.name}</div>
                  <div style={{color:'#888',fontSize:14,marginBottom:4}}>广告ID：{ad._id}</div>
                  <div style={{color:'#888',fontSize:14,marginBottom:4}}>类型：{ad.type}</div>
                  <div style={{color:'#888',fontSize:14,marginBottom:4}}>预算：￥{ad.budget}</div>
                  <div style={{color:'#888',fontSize:14,marginBottom:4}}>投放时间：{ad.start} ~ {ad.end}</div>
                  <div style={{marginTop:8}}>
                    {ad.material && (ad.material.endsWith('.jpg') || ad.material.endsWith('.jpeg') || ad.material.endsWith('.png') || ad.material.endsWith('.gif') || ad.material.endsWith('.webp')) && (
                      <a href={ad.material} download target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'#1976d2'}}>下载图片</a>
                    )}
                    {ad.material && (ad.material.endsWith('.mp4') || ad.material.endsWith('.webm') || ad.material.endsWith('.mov')) && (
                      <a href={ad.material} download target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'#1976d2'}}>下载视频</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Cases; 