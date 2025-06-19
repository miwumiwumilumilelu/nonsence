import cloud from "@lafjs/cloud";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const db = cloud.database();

// sealos 对象存储配置
const BUCKET = "xs87czgb-sealaf-djck4ikhm4-cloud-bin";
const ENDPOINT = "https://objectstorageapi.hzh.sealos.run";
const ACCESS_KEY = "xs87czgb";
const SECRET_KEY = "7qv8jv5hgqnjffk2";

const s3 = new S3Client({
  region: "us-east-1", // sealos 一般用这个
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: true,
});

export async function main(ctx) {
  const { action } = ctx.body || {};

  // 1. 生成 presigned url
  if (action === "getPresignedUrl") {
    const { filename, filetype, userId } = ctx.body;
    if (!filename || !filetype || !userId) return { ok: false, error: "参数不完整" };
    const ext = filename.split('.').pop();
    const key = `materials/${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: filetype,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5分钟有效
    const fileUrl = `${ENDPOINT}/${BUCKET}/${key}`;
    return { ok: true, url, fileUrl, key };
  }

  // 2. 保存素材信息
  if (action === "saveMaterial") {
    const { userId, type, url, filename } = ctx.body;
    if (!userId || !type || !url || !filename) return { ok: false, error: "参数不完整" };
    const doc = {
      userId,
      type, // 'image' | 'video'
      url,
      filename,
      created: new Date().toISOString(),
    };
    const { insertedId } = await db.collection("materials_data").add(doc);
    return { ok: true, id: insertedId };
  }

  // 3. 获取素材列表
  if (action === "getMaterials") {
    const { userId } = ctx.body;
    if (!userId) return { ok: false, error: "参数不完整" };
    const { data } = await db.collection("materials_data").where({ userId }).orderBy("created", "desc").get();
    return { ok: true, data };
  }

  // 4. 删除素材
  if (action === "deleteMaterial") {
    const { id } = ctx.body;
    if (!id) return { ok: false, error: "参数不完整" };
    const mat = await db.collection("materials_data").where({ _id: id }).getOne();
    if (!mat.data) return { ok: false, error: "素材不存在" };
    await db.collection("materials_data").where({ _id: id }).remove();
    return { ok: true };
  }

  return { ok: false, error: "未知操作" };
} 