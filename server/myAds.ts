import cloud from "@lafjs/cloud";

const db = cloud.database();

interface MyAdsBody {
  userId: string;
}

interface FunctionContext {
  body: MyAdsBody;
}

export async function main(ctx: FunctionContext) {
  const { userId } = ctx.body;
  if (!userId) return { error: '参数错误' };
  const { data } = await db.collection('ads').where({ userId }).orderBy('created', 'desc').get();
  return { ok: true, data };
} 