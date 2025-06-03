import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx) {
  const { action, userId } = ctx.body || {};
  if (action === 'getUsers') {
    const status = ctx.body.status;
    let query = db.collection('users');
    if (typeof status === 'number') query = query.where({ status });
    const { data } = await query.orderBy('createdAt', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'deleteUser') {
    if (!userId) return { ok: false, error: '参数错误' };
    await db.collection('users').where({ _id: userId }).remove();
    await db.collection('ads').where({ userId }).remove();
    await db.collection('recharge').where({ userId }).remove();
    return { ok: true };
  }
  if (action === 'getPendingUsers') {
    const { data } = await db.collection('users').where({ status: 0 }).orderBy('createdAt', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'approveUser' || (action === 'updateUserStatus' && ctx.body.status === 1)) {
    if (!userId) return { ok: false, error: '参数错误' };
    const { updated } = await db.collection('users').where({ _id: userId }).update({ status: 1, rejectMsg: '' });
    return updated === 1 ? { ok: true } : { ok: false, error: '操作失败' };
  }
  if (action === 'rejectUser') {
    if (!userId) return { ok: false, error: '参数错误' };
    const rejectMsg = ctx.body.rejectMsg || '';
    const { updated } = await db.collection('users').where({ _id: userId }).update({ status: 2, rejectMsg });
    return updated === 1 ? { ok: true } : { ok: false, error: '操作失败' };
  }
  if (action === 'getAllUsers') {
    const { data } = await db.collection('users').orderBy('createdAt', 'desc').get();
    return { ok: true, data };
  }
  if (action === 'updateUserStatus') {
    if (!userId) return { ok: false, error: '参数错误' };
    const { status } = ctx.body;
    const { updated } = await db.collection('users').where({ _id: userId }).update({ status });
    return updated === 1 ? { ok: true } : { ok: false, error: '操作失败' };
  }
  return { ok: false, error: '未知操作' };
} 