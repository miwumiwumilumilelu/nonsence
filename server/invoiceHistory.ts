import cloud from "@lafjs/cloud";

const db = cloud.database();

interface InvoiceHistoryBody {
  userId: string;
}

interface FunctionContext {
  body: InvoiceHistoryBody;
}

export async function main(ctx: FunctionContext) {
  const { userId } = ctx.body;
  if (!userId) return { error: '参数错误' };
  const { data } = await db.collection('invoices').where({ userId }).orderBy('time', 'desc').get();
  return { ok: true, data };
} 