import React from 'react';
import './ApiDoc.css';
import './App.css';

function ApiDoc() {
  return (
    <div className="api-doc-bg">
      <div className="api-doc-wave-bg">
        <svg className="api-doc-wave-anim" viewBox="0 0 2880 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#a5b4fc" fillOpacity="0.35" d="M0,60 C480,120 960,0 1440,60 C1920,120 2400,0 2880,60 L2880,120 L0,120 Z"/>
        </svg>
      </div>
      <div className="page-card api-doc-card">
        <div className="page-section-title">API文档</div>
        
        <section>
          <h3>1. 用户认证接口</h3>          <div className="api-item">
            <h4>用户登录</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/loginOrRegister
Content-Type: application/json

Body: {
  "username": "string",
  "password": "string"
}

返回示例：
{
  "ok": true,
  "msg": "登录成功！",
  "data": {
    "_id": "用户ID",
    "username": "用户名",
    "balance": 100.00,
    "status": 1
  }
}`}</pre>
          </div>
            <div className="api-item">
            <h4>用户注册</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/register
Content-Type: application/json

Body: {
  "username": "string",
  "password": "string"
}

返回示例：
{
  "ok": true,
  "msg": "注册成功，等待管理员审核！",
  "data": {
    "_id": "用户ID",
    "username": "用户名",
    "status": 0
  }
}`}</pre>
          </div>
        </section>

        <section>
          <h3>2. 广告管理接口</h3>          <div className="api-item">
            <h4>购买广告</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/buyAd
Content-Type: application/json

Body: {
  "userId": "string",
  "type": "横幅广告",
  "name": "广告名称",
  "budget": 100,
  "start": "2025-01-01",
  "end": "2025-01-31",
  "material": "广告素材URL或内容",
  "desc": "广告描述"
}

返回示例：
{
  "ok": true,
  "msg": "广告购买成功",
  "adId": "广告ID",
  "balance": 50.00
}`}</pre>
          </div>          <div className="api-item">
            <h4>查询我的广告</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/myAds
Content-Type: application/json

Body: {
  "userId": "string"
}

返回示例：
{
  "ok": true,
  "data": [
    {
      "_id": "广告ID",
      "name": "广告名称",
      "type": "横幅广告",
      "status": "待审核",
      "budget": 100,
      "created": "2025-01-01T00:00:00.000Z"
    }
  ]
}`}</pre>
          </div>
        </section>

        <section>
          <h3>3. 充值与支付接口</h3>          <div className="api-item">
            <h4>账户充值</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/recharge
Content-Type: application/json

Body: {
  "userId": "string",
  "amount": 100,
  "method": "微信支付"
}

返回示例：
{
  "ok": true,
  "msg": "充值成功",
  "balance": 200.00
}`}</pre>
          </div>          <div className="api-item">
            <h4>充值历史</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/rechargeHistory
Content-Type: application/json

Body: {
  "userId": "string"
}

返回示例：
{
  "ok": true,
  "data": [
    {
      "amount": 100,
      "method": "微信支付",
      "time": "2025-01-01T00:00:00.000Z",
      "status": "成功"
    }
  ]
}`}</pre>
          </div>
        </section>

        <section>
          <h3>4. 社区交流接口</h3>          <div className="api-item">
            <h4>发布留言/讨论</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/message
Content-Type: application/json

Body: {
  "nickname": "昵称",
  "content": "留言内容",
  "type": 1  // 1=社区留言, 2=联系我们
}

返回示例：
{
  "ok": true,
  "msg": "留言提交成功，等待审核！",
  "id": "留言ID"
}`}</pre>
          </div>          <div className="api-item">
            <h4>查询留言列表</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/queryMessages
Content-Type: application/json

Body: {
  "type": 1,     // 1=社区留言, 2=联系我们
  "status": 1    // 0=待审核, 1=已通过, 2=已删除
}

返回示例：
{
  "ok": true,
  "data": [
    {
      "_id": "留言ID",
      "nickname": "昵称",
      "content": "留言内容",
      "created": "2025-01-01T00:00:00.000Z",
      "replies": []
    }
  ]
}`}</pre>
          </div>
        </section>

        <section>
          <h3>5. 平台数据接口</h3>
          <div className="api-item">
            <h4>获取平台统计数据</h4>
            <pre>{`POST ${window.location.origin.includes('localhost') ? 'https://djck4ikhm4.hzh.sealos.run' : ''}/platformStats
Content-Type: application/json

返回示例：
{
  "ok": true,
  "data": {
    "userCount": 100,
    "adCount": 50,
    "totalRecharge": 10000.00,
    "totalAdSpend": 8000.00
  }
}`}</pre>
          </div>
        </section>

        <section>
          <h3>6. 接口说明</h3>
          <ul>
            <li><strong>请求格式：</strong>所有接口均使用 POST 方法，Content-Type 为 application/json</li>
            <li><strong>返回格式：</strong>统一返回 JSON 格式，成功时包含 ok: true</li>
            <li><strong>错误处理：</strong>失败时返回 error 字段描述错误信息</li>
            <li><strong>认证方式：</strong>用户相关操作需要传入有效的 userId</li>
            <li><strong>数据类型：</strong>时间格式为 ISO 8601 标准</li>
            <li><strong>联系方式：</strong>如需技术支持或API权限，请通过"联系我们"页面联系平台管理员</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default ApiDoc;