import requests
import json
import os
import time
from datetime import datetime, timedelta

BASE_URL = 'http://127.0.0.1:8000/api'
token = None

def test_login():
    global token
    print("\n1. 测试用户登录")
    url = f"{BASE_URL}/users/login/"
    data = {
        "username": "koreyoshi",
        "password": "NEWone00"
    }
    response = requests.post(url, json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    if response.status_code == 200:
        token = response.json().get('access')
        print("✅ 登录成功")
        return True
    print("❌ 登录失败")
    return False

def test_get_ads():
    print("\n2. 测试获取广告列表")
    url = f"{BASE_URL}/ads/ads/"
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    response = requests.get(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    if response.status_code == 200:
        print("✅ 获取广告列表成功")
        return response.json()
    print("❌ 获取广告列表失败")
    return None

def test_create_ad():
    print("\n3. 测试创建广告")
    url = f"{BASE_URL}/ads/ads/"
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    # 使用用户提供的测试图片
    test_image_path = "test_image.jpg"
    
    try:
        # 设置开始日期为今天，结束日期为30天后
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        data = {
            "title": "动漫头像广告",
            "description": "这是一个使用动漫头像的测试广告",
            "target_url": "http://example.com",
            "total_budget": "1000.00",
            "daily_budget": "100.00",
            "start_date": start_date,
            "end_date": end_date
        }
        
        with open(test_image_path, 'rb') as image_file:
            files = {
                'creative_image': (test_image_path, image_file, 'image/jpeg')
            }
            response = requests.post(url, data=data, files=files, headers=headers)
        
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {response.text}")
        
        if response.status_code in [200, 201]:
            print("✅ 创建广告成功")
            return response.json()
        print("❌ 创建广告失败")
        return None
    except Exception as e:
        print(f"❌ 创建广告时出错: {str(e)}")
        return None

def test_review_ad(ad_id, action='approve'):
    print(f"\n4. 测试审核广告")
    url = f"{BASE_URL}/ads/ads/{ad_id}/review/"
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    
    data = {
        'status': 'approved' if action == 'approve' else 'rejected',
        'reject_reason': '广告内容不合规' if action == 'reject' else None,
        'review_comment': '审核通过' if action == 'approve' else '广告内容不合规'
    }
    
    response = requests.post(url, json=data, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print(f"✅ 审核广告成功")
        return response.json()
    print(f"❌ 审核广告失败")
    return None

def test_activate_ad(ad_id):
    print("\n5. 测试激活广告")
    url = f"{BASE_URL}/ads/ads/{ad_id}/activate/"
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.post(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("✅ 激活广告成功")
        return response.json()
    print("❌ 激活广告失败")
    return None

def test_pause_ad(ad_id):
    print("\n6. 测试暂停广告")
    url = f"{BASE_URL}/ads/ads/{ad_id}/pause/"
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.post(url, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("✅ 暂停广告成功")
        return response.json()
    print("❌ 暂停广告失败")
    return None

def test_update_ad(ad_id):
    print("\n7. 测试更新广告")
    url = f"{BASE_URL}/ads/ads/{ad_id}/"
    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    
    data = {
        "title": "更新后的广告标题",
        "description": "这是更新后的广告描述",
        "daily_budget": "200.00"
    }
    
    response = requests.patch(url, json=data, headers=headers)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.text}")
    
    if response.status_code == 200:
        print("✅ 更新广告成功")
        return response.json()
    print("❌ 更新广告失败")
    return None

def main():
    print("开始测试所有API功能...")
    
    # 1. 测试登录
    if not test_login():
        print("登录失败，终止测试")
        return
    
    # 2. 测试获取广告列表
    ads = test_get_ads()
    if not ads:
        print("获取广告列表失败，终止测试")
        return
    
    # 3. 测试创建广告
    created_ad = test_create_ad()
    if created_ad:
        print(f"\n创建的广告ID: {created_ad.get('id')}")
        ad_id = created_ad.get('id')
        
        # 4. 测试审核广告
        reviewed_ad = test_review_ad(ad_id, 'approve')
        if reviewed_ad:
            # 5. 测试激活广告
            activated_ad = test_activate_ad(ad_id)
            if activated_ad:
                # 6. 测试暂停广告
                paused_ad = test_pause_ad(ad_id)
                if paused_ad:
                    # 7. 测试更新广告
                    updated_ad = test_update_ad(ad_id)

if __name__ == "__main__":
    main() 