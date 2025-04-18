import requests
import json
import os
import numpy as np
from PIL import Image
from datetime import datetime

BASE_URL = 'http://localhost:8000/api'
ACCESS_TOKEN = None

def create_test_image():
    """创建一个100x100的测试图片"""
    # 创建一个100x100的RGB图片数组
    img_array = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
    img = Image.fromarray(img_array)
    
    # 保存图片到临时文件
    img_path = 'test_image.jpg'
    img.save(img_path, format='JPEG')
    return img_path

def test_login():
    url = f'{BASE_URL}/users/login/'
    data = {
        'username': 'koreyoshi',
        'password': 'NEWone00'
    }
    headers = {'Content-Type': 'application/json'}
    
    response = requests.post(url, json=data, headers=headers)
    print(f'\n=== 测试登录 ===')
    print(f'状态码: {response.status_code}')
    print(f'响应: {response.text}')
    
    if response.status_code == 200:
        global ACCESS_TOKEN
        ACCESS_TOKEN = response.json()['access']
        return True
    return False

def test_create_ad():
    if not ACCESS_TOKEN:
        print("请先登录!")
        return

    # 创建测试图片
    image_path = create_test_image()
    
    url = f'{BASE_URL}/ads/ads/'
    data = {
        'title': f'测试广告 {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
        'description': '这是一个测试广告',
        'target_url': 'https://example.com',
        'total_budget': '1000.00',
        'daily_budget': '100.00',
        'start_date': datetime.now().strftime('%Y-%m-%d'),
        'end_date': '2025-12-31',
        'status': 'draft'
    }
    
    try:
        # 准备文件
        with open(image_path, 'rb') as f:
            files = {
                'creative_image': ('test_image.jpg', f, 'image/jpeg')
            }
            
            headers = {
                'Authorization': f'Bearer {ACCESS_TOKEN}'
            }
            
            response = requests.post(url, data=data, files=files, headers=headers)
            print(f'\n=== 测试创建广告 ===')
            print(f'状态码: {response.status_code}')
            print(f'响应: {response.text}')
            
            if response.status_code == 201:
                return response.json()['id']
            return None
    finally:
        # 清理测试文件
        if os.path.exists(image_path):
            try:
                os.remove(image_path)
            except:
                pass

def test_get_ads():
    if not ACCESS_TOKEN:
        print("请先登录!")
        return
        
    url = f'{BASE_URL}/ads/ads/'
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    }
    
    response = requests.get(url, headers=headers)
    print(f'\n=== 测试获取广告列表 ===')
    print(f'状态码: {response.status_code}')
    print(f'响应: {response.text}')

def test_get_ad_detail(ad_id):
    if not ACCESS_TOKEN or not ad_id:
        print("请先登录并创建广告!")
        return
        
    url = f'{BASE_URL}/ads/ads/{ad_id}/'
    headers = {
        'Authorization': f'Bearer {ACCESS_TOKEN}'
    }
    
    response = requests.get(url, headers=headers)
    print(f'\n=== 测试获取广告详情 ===')
    print(f'状态码: {response.status_code}')
    print(f'响应: {response.text}')

def run_all_tests():
    # 1. 测试登录
    if not test_login():
        print("登录失败,终止测试!")
        return
        
    # 2. 测试获取广告列表
    test_get_ads()
    
    # 3. 测试创建广告
    ad_id = test_create_ad()
    
    # 4. 如果创建成功，测试获取广告详情
    if ad_id:
        test_get_ad_detail(ad_id)

if __name__ == '__main__':
    run_all_tests() 