import os
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
import magic
from datetime import datetime

@deconstructible
class FileValidator:
    """文件验证器"""
    
    def __init__(self, max_size=None, allowed_types=None):
        self.max_size = max_size
        self.allowed_types = allowed_types

    def __call__(self, file):
        if self.max_size is not None and file.size > self.max_size:
            raise ValidationError(
                f'文件大小不能超过 {self.max_size / (1024 * 1024):.1f}MB'
            )

        if self.allowed_types is not None:
            # 使用python-magic检测文件类型
            file_type = magic.from_buffer(file.read(1024), mime=True)
            file.seek(0)  # 重置文件指针
            
            if file_type not in self.allowed_types:
                raise ValidationError(
                    f'不支持的文件类型。允许的类型：{", ".join(self.allowed_types)}'
                )

def validate_image(file):
    """验证图片文件"""
    validator = FileValidator(
        max_size=settings.MAX_UPLOAD_SIZE,
        allowed_types=settings.ALLOWED_IMAGE_TYPES
    )
    validator(file)

def get_upload_path(instance, filename):
    """生成广告素材的上传路径"""
    # 获取文件扩展名
    ext = filename.split('.')[-1]
    # 使用当前时间
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    # 生成唯一文件名
    new_filename = f"{instance.id or 'new'}_{timestamp}.{ext}"
    # 返回'ads/materials/年月/文件名'格式的路径
    return f'ads/materials/{datetime.now().strftime("%Y%m")}/{new_filename}' 