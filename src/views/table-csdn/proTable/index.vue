<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户(其他)
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- CreateTime -->
      <template #CreateTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.CreateTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import {
  getCsdnblogsList,
  deleteUser,
  editUser,
  addUser,
  changeUserStatus,
  resetUserPassWord,
  exportUserInfo,
  BatchAddUser,
  getUserStatus,
  getUserGender
} from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.CreatedAt && (newParams.startTime = newParams.CreatedAt[0]);
  newParams.CreatedAt && (newParams.endTime = newParams.CreatedAt[1]);
  delete newParams.CreatedAt;
  newParams.RefreshCount = 3;
  newParams.BlogType = "Other";
  newParams.RerdisCacheMinute = 10;
  return getCsdnblogsList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.Csdnblogs>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<User.Csdnblogs>[]>([
  // { type: "selection", fixed: "left", width: 70 },//选择
  // { type: "sort", label: "Sort", width: 80 },//拖转行的
  // { type: "expand", label: "Expand", width: 85 },//展开看信息的 json
  {
    prop: "no",
    label: "序号",
    width: 85,
    render: scope => {
      return <span>{scope.$index + 1}</span>;
    }
  }, //展开看信息的 json
  {
    prop: "title",
    label: "标题",
    width: 300,
    search: { el: "input", tooltip: "我是搜索[标题]提示" },
    render: scope => {
      return <el-input rows="5" type="textarea" v-model={scope.row.title}></el-input>;
    }
  },
  {
    prop: "subContent",
    label: "文章简介",
    width: 500,
    search: { el: "input" },
    render: scope => {
      return <el-input rows="5" type="textarea" v-model={scope.row.subContent}></el-input>;
    }
  },
  {
    prop: "imgBase64",
    label: "主图",
    width: 120,
    render: scope => {
      return (
        <div>
          <el-image style="width: 100px; height: 100px" src={scope.row.imgBase64} preview-src-list={[scope.row.imgBase64]} />
          <br />
          <a href={scope.row.imgBase64} download={scope.row.downLoadImgName}>
            下载
          </a>
        </div>
      );
    }
  },
  { prop: "author", label: "作者地址", width: 90 },
  {
    prop: "createdAt",
    label: "创建时间",
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD" },
      defaultValue: ["2024-02-22", "2024-02-23"]
    }
  },
  { prop: "loadContextTime", label: "获取时间", width: 200, fixed: "right", filteredValue: ["YYYY-MM-DD"] },
  {
    prop: "contentUrl",
    label: "文章完整Url",
    width: 120,
    fixed: "right",
    render: scope => {
      return (
        <el-link href={scope.row.contentUrl} target="_blank" type="primary">
          {scope.row.contentUrl}
        </el-link>
      );
    }
  },
  { prop: "diggNum", label: "点赞数", sortable: true, fixed: "right" },
  { prop: "readNum", label: "阅读数", sortable: true, fixed: "right" },
  { prop: "commentNum", label: "评论数", sortable: true, fixed: "right" }
  // { prop: "operation", label: "操作", fixed: "right", width: 330 }

  // {
  //   prop: "username",
  //   label: "用户姓名",
  //   search: { el: "input", tooltip: "我是搜索提示" },
  //   render: scope => {
  //     return (
  //       <el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
  //         {scope.row.username}
  //       </el-button>
  //     );
  //   }
  // },
  // {
  //   prop: "gender",
  //   label: "性别",
  //   // 字典数据（本地数据）
  //   // enum: genderType,
  //   // 字典请求不带参数
  //   enum: getUserGender,
  //   // 字典请求携带参数
  //   // enum: () => getUserGender({ id: 1 }),
  //   search: { el: "select", props: { filterable: true } },
  //   fieldNames: { label: "genderLabel", value: "genderValue" }
  // },

  // {
  //   prop: "status",
  //   label: "用户状态",
  //   enum: getUserStatus,
  //   search: { el: "tree-select", props: { filterable: true } },
  //   fieldNames: { label: "userLabel", value: "userStatus" },
  //   render: scope => {
  //     return (
  //       <>
  //         {BUTTONS.value.status ? (
  //           <el-switch
  //             model-value={scope.row.status}
  //             active-text={scope.row.status ? "启用" : "禁用"}
  //             active-value={1}
  //             inactive-value={0}
  //             onClick={() => changeStatus(scope.row)}
  //           />
  //         ) : (
  //           <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
  //         )}
  //       </>
  //     );
  //   }
  // },

  // {
  //   prop: "CreateTime",
  //   label: "创建时间11",
  //   headerRender,
  //   width: 180,
  //   search: {
  //     el: "date-picker",
  //     span: 2,
  //     props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
  //     defaultValue: ["2024-02-23 23:59:59", "2024-02-23 23:59:59"]
  //   }
  // },
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.Csdnblogs) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.Csdnblogs) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.Csdnblogs) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.Csdnblogs> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

const downImageUrl = async url => {
  // 创建 <a> 元素
  debugger;
  let a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "download");
  a.setAttribute("target", "_blank");
  let clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
};
</script>
