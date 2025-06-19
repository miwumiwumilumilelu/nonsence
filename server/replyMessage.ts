import cloud from "@lafjs/cloud";
const db = cloud.database();

interface ReplyBody {
  _id: string; // 讨论的id
  nickname: string;
  content: string;
}

interface FunctionContext {
  body: ReplyBody;
}

export async function main(ctx: FunctionContext) {
  const { _id, nickname, content } = ctx.body;
  if (!_id || !nickname || !content) {
    return { error: "参数不完整" };
  }
  const reply = {
    nickname,
    content,
    created: new Date().toISOString()
  };
  // 使用 $push 原子操作追加回复
  const { updated } = await db.collection('messages').where({ _id }).update({
    $push: { replies: reply }
  });
  if (updated === 1) {
    return { ok: true, msg: "回复成功" };
  } else {
    return { error: "回复失败" };
  }
}