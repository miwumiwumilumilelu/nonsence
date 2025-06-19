import cloud from "@lafjs/cloud";

const db = cloud.database();

interface BuyAdBody {
  userId: string;
  type: string;
  name: string;
  budget: number;
  start: string;
  end: string;
  material: string;
  desc: string;
}

interface FunctionContext {
  body: BuyAdBody;
}

export async function main(ctx: FunctionContext) {
  const { userId, type, name, budget, start, end, material, desc } = ctx.body;
  if (!userId || !type || !name || !budget || !start || !end || !material) {
    return { error: '参数不完整' };
  }
  // 查询用户余额
  const user = await db.collection('users').where({ _id: userId }).getOne();
  if (!user.data) return { error: '用户不存在' };
  const oldBalance = typeof user.data.balance === 'number' ? user.data.balance : 0;
  if (oldBalance < budget) return { error: '余额不足' };
  // 扣除余额
  const newBalance = oldBalance - budget;
  await db.collection('users').where({ _id: userId }).update({ balance: newBalance });
  // 写入广告
  const ad = {
    userId,
    username: user.data.username || '',
    type,
    name,
    budget,
    start,
    end,
    material,
    desc: desc || '',
    status: '待审核',
    created: new Date().toISOString(),
  };
  const { insertedId } = await db.collection('ads').add(ad);
  // 写入发票
  const invoice = {
    userId,
    adId: insertedId,
    amount: budget,
    title: name,
    status: '待开票',
    time: new Date().toISOString(),
  };
  await db.collection('invoices').add(invoice);
  return { ok: true, msg: '广告购买成功', adId: insertedId, balance: newBalance };
} 