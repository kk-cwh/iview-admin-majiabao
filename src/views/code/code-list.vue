<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">新增</Button>
      </FormItem>
      <FormItem label="名称:" class="">
        <Input clearable type="text" v-model="query.name" placeholder="填写名称称"></Input>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,30,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd" title="新增" width="640">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="140">
        <FormItem label="code" prop="code">
          <Input v-model="addRow.code" style="width:360px"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="addRow.name" style="width:360px"></Input>
        </FormItem>
        <FormItem label="地址" prop="url">
          <Input v-model="addRow.url" style="width:360px"></Input>
        </FormItem>
        <FormItem label="默认地址" prop="url_default">
          <Input v-model="addRow.url_default" style="width:360px"></Input>
        </FormItem>
        <FormItem label="状态" prop="status">
          <Select v-model="addRow.status" style="width:200px">
            <Option v-for="(item,key) in statusObj" :value="key" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>
    <Modal v-model="showEdit" title="编辑" width="640">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140" inline>
        <FormItem label="code" prop="code" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
          <Input v-model="editRow.code" style="width:360px"></Input>
        </FormItem>
        <FormItem label="名称" prop="name" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
          <Input v-model="editRow.name" style="width:360px"></Input>
        </FormItem>
        <FormItem label="地址" prop="url" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
          <Input v-model="editRow.url" style="width:360px"></Input>
        </FormItem>
        <FormItem label="默认地址" prop="url_default">
          <Input v-model="editRow.url_default" style="width:360px"></Input>
        </FormItem>
        <FormItem label="状态" prop="status" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
          <Select v-model="editRow.status" style="width:200px">
            <Option v-for="(item,key) in statusObj" :value="key" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

export default {
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      statusObj: { '1': '启用', '0': '禁用' },
      roleLevelTypes: [{ label: '管理员', value: '0' }, { label: '运营', value: '10' }, { label: '普通客服', value: '100' }, { label: '审核客服', value: '1000' }, { label: '客服主管', value: '999' }],
      loading: false,
      query: {},
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      delRow: {},
      columns: [
        {
          title: 'ID',
          width: 80,
          key: 'id'
        },
        {
          title: 'code',
          minWidth: 100,
          key: 'code'
        },
        {
          title: '名称',
          minWidth: 150,
          key: 'name'
        },

        {
          title: '地址',
          minWidth: 180,
          key: 'url'
        },
        {
          title: '默认地址',
          minWidth: 180,
          key: 'url_default'
        },
        {
          title: '状态',
          width: 100,
          key: 'status',
          render: (h, params) => {
            return h('div', [h('i-switch', {
              props: {
                value: parseInt(params.row.status) === 1,
                size: 'large'
              },
              scopedSlots: {
                open: () => {
                  return '启用'
                },
                close: () => {
                  return '禁用'
                }
              },
              on: {
                'on-change': (status) => {
                  this.changeStatus(params.index, status)
                }
              }
            })])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    icon: 'compose',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.index)
                    }
                  }
                }, '编辑'
              )

            ])
          }
        }

      ],
      tableDatas: [],
      ruleValidate: {
        code: [
          { required: true, message: 'code不能为空！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '名称不能为空！', trigger: 'blur' }
        ],
        // url_default: [
        //   { required: true, message: '不能为空！', trigger: 'blur' }
        // ],
        status: [
          { required: true, message: '请选择状态！ ', trigger: 'blur' }

        ]
      }
    }
  },
  mounted () {
    // this.init();
  },
  computed: {},
  methods: {
    init () {
      this.queryList()
    },
    async changeStatus (index, status) {
      try {
        const data = {
          id: this.tableDatas[index].id,
          status: status ? 1 : 0
        }
        await this.$store.dispatch('deleteCodePackage', data)
        this.tableDatas[index].status = status ? 1 : 0
        this.$Message.success('修改成功!')
        // console.log(this.tableDatas)
      } catch (error) {

      }
    },
    pageChange (page) {
      this.page = page
      this.queryList()
    },
    pageSizeChange (perPage) {
      if (this.per_page !== perPage) {
        this.per_page = perPage
        this.queryList()
      }
    },
    async queryList () {
      try {
        this.queryLoading = true
        const data = {
          page: this.page,
          per_page: this.per_page,
          ...this.query
        }
        const result = await this.$store.dispatch('getCodePackages', data)
        if (result) {
          if (result.data) {
            this.tableDatas = result.data
          }
          if (result.meta) {
            this.total = result.meta.total
            this.per_page = +result.meta.per_page
          }
        }
        this.queryLoading = false
      } catch (error) {

      }
    },
    toQuery () {
      this.page = 1
      this.queryList()
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    cancel () {
      this.showEdit = false
      this.showAdd = false
    },
    showAddModal () {
      this.showAdd = true
      this.handleReset('formValidate')
      this.addRow = {status: '1'}
    },
    toAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.add(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        await this.$store.dispatch('insertCodePackage', data)

        this.showAdd = false
        this.$Message.success('添加成功!')
        this.toQuery()
      } catch (error) {

      }
      this.loading = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = {
        id: this.tableDatas[index].id,
        name: this.tableDatas[index].name,
        code: this.tableDatas[index].code,
        status: this.tableDatas[index].status + '',
        url: this.tableDatas[index].url,
        url_default: this.tableDatas[index].url_default
      }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateCodePackaget', data)
        if (res.data) {

        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          this.toQuery()
        }
      } catch (error) {
      }
      this.loading = false
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
