import cloud from "@lafjs/cloud";

const db = cloud.database();

interface MessageBody {
  nickname: string;
  content: string;
  code?: string;
  uuid?: string;
  type?: number;
}

interface FunctionContext {
  body: MessageBody;
  headers: Record<string, string>;
}

export async function main(ctx: FunctionContext) {
  const { nickname, content, code, uuid, type = 1 } = ctx.body;
  // type: 1=社区留言, 2=联系我们

  // 校验验证码（如有）
  if (code && uuid) {
    const { deleted } = await db.collection('codes').where({ type, _id: uuid, code }).remove();
    if (deleted !== 1) return { error: '验证码不正确！' };
  }

  // 校验内容
  if (!nickname || !content) {
    return { error: "昵称和留言内容不能为空" };
  }
  if (content.length > 1000) {
    return { error: "留言内容过长" };
  }

  // 存储留言
  const msg = {
    nickname,
    content,
    type, // 1=社区留言, 2=联系我们
    ip: ctx.headers['x-real-ip'] || '',
    created: new Date().toISOString(),
    status: 0 as 0 | 1 | 2 // 0=待审核, 1=已通过, 2=已删除
  };
  const { insertedId } = await db.collection('messages').add(msg);

  return {
    ok: true,
    msg: '留言提交成功，等待审核！',
    id: insertedId
  };
} 