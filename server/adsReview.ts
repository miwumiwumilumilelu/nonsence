import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx) {
  const { action, adId, actionType } = ctx.body || {};
  if (action === 'getPendingAds') {
    const { data } = await db.collection('ads').where({ status: '待审核' }).orderBy('created', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'getReviewedAds') {
    const { data } = await db.collection('ads').where({ status: db.command.neq('待审核') }).orderBy('created', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'reviewAd') {
    if (!adId || !['approve', 'reject'].includes(actionType)) return { ok: false, error: '参数错误' };
    const status = actionType === 'approve' ? '已通过' : '已拒绝';
    const { updated } = await db.collection('ads').where({ _id: adId }).update({ status });
    return updated === 1 ? { ok: true } : { ok: false, error: '操作失败' };
  }
  return { ok: false, error: '未知操作' };
} 