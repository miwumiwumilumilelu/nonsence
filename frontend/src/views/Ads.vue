<template>
  <div class="ads">
    <div class="header">
      <h2>广告管理</h2>
      <el-button type="primary" @click="handleCreate">创建广告</el-button>
    </div>
    
    <el-card>
      <el-table :data="ads" style="width: 100%">
        <el-table-column prop="title" label="广告标题" />
        <el-table-column prop="ad_type" label="广告类型" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="impressions" label="展示量" />
        <el-table-column prop="clicks" label="点击量" />
        <el-table-column prop="ctr" label="点击率">
          <template #default="{ row }">
            {{ row.ctr }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                size="small"
                @click="handleView(row)"
              >
                查看
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 创建/编辑广告对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '创建广告' : '编辑广告'"
      width="600px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        
        <el-form-item label="广告类型" prop="ad_type">
          <el-select v-model="form.ad_type">
            <el-option label="图片广告" value="image" />
            <el-option label="视频广告" value="video" />
            <el-option label="文字广告" value="text" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="广告内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        
        <el-form-item label="目标链接" prop="target_url">
          <el-input v-model="form.target_url" />
        </el-form-item>
        
        <el-form-item label="预算" prop="budget">
          <el-input-number
            v-model="form.budget"
            :min="0"
            :precision="2"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const ads = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogType = ref('create')
const form = ref({
  title: '',
  ad_type: '',
  content: '',
  target_url: '',
  budget: 0
})

const rules = {
  title: [
    { required: true, message: '请输入广告标题', trigger: 'blur' }
  ],
  ad_type: [
    { required: true, message: '请选择广告类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入广告内容', trigger: 'blur' }
  ],
  target_url: [
    { required: true, message: '请输入目标链接', trigger: 'blur' }
  ],
  budget: [
    { required: true, message: '请输入预算', trigger: 'blur' }
  ]
}

const getStatusType = (status) => {
  const types = {
    pending: 'warning',
    active: 'success',
    paused: 'info',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待审核',
    active: '投放中',
    paused: '已暂停',
    rejected: '已拒绝'
  }
  return texts[status] || status
}

const loadAds = async () => {
  try {
    const response = await axios.get('/api/ads/', {
      params: {
        page: currentPage.value,
        page_size: pageSize.value
      }
    })
    ads.value = response.data.results
    total.value = response.data.count
  } catch (error) {
    console.error('加载广告列表失败:', error)
  }
}

const handleCreate = () => {
  dialogType.value = 'create'
  form.value = {
    title: '',
    ad_type: '',
    content: '',
    target_url: '',
    budget: 0
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleView = (row) => {
  router.push(`/ads/${row.id}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个广告吗？', '提示', {
      type: 'warning'
    })
    await axios.delete(`/api/ads/${row.id}/`)
    ElMessage.success('删除成功')
    loadAds()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除广告失败:', error)
    }
  }
}

const handleSubmit = async () => {
  try {
    if (dialogType.value === 'create') {
      await axios.post('/api/ads/', form.value)
      ElMessage.success('创建成功')
    } else {
      await axios.put(`/api/ads/${form.value.id}/`, form.value)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    loadAds()
  } catch (error) {
    console.error('保存广告失败:', error)
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadAds()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadAds()
}

onMounted(() => {
  loadAds()
})
</script>

<style lang="scss" scoped>
.ads {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 