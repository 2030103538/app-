<template>
    <div class="app-container">
        <!--头部区域-->
        <el-card class="operate-top-card" shadow="never">
            <div>
                <i class="el-icon-search" style="font-size: 18px; margin-right: 3px;"></i>
                <span>筛选搜索</span>
                <el-button
                    class="btn-clear"
                    size="mini"
                    style="float: right"
                    @click="handleResetSearch"
                >
                    清空
                </el-button>
                <el-button
                    class="btn-find"
                    size="mini"
                    type="primary"
                    style="float: right; margin-right: 10px;"
                    @click="handleSearchList"
                >
                    查询
                </el-button>
            </div>
            <div style="margin-top: 50px;">
                <el-form
                    ref="productCateForm"
                    :model="listQuery"
                    label-width="150px"
                    :inline="true"
                >
                    <el-form-item label="商品货号:">
                        <el-input v-model="listQuery.productSn"></el-input>
                    </el-form-item>
                    <el-form-item label="商品所属分类:">
                        <el-cascader
                            v-model="productCateValue"
                            :options="productCateOptions"
                            :props="{ expandTrigger: 'hover' }"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="上架状态:">
                        <el-select v-model="listQuery.publishStatus" placeholder="请选择商品是否上架">
                            <el-option
                                    v-for="item in publishStatusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称：">
                        <el-input
                                v-model="listQuery.name"
                                placeholder="请输入商品的名称"
                                style="width: 400px"
                        >

                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <div>
            <!--头部区域-->
            <el-card class="operate-top-card" shadow="never">
                <i class="el-icon-s-order" style="font-size: 18px; margin-right: 3px;"></i>
                <span>商品列表</span>
                <el-button class="btn-add" size="mini" @click="$router.push('/pm/addProduct')">添加</el-button>
            </el-card>
            <!--内容区域-->
            <div class="table-container">
                <el-table
                        ref="multipleTable"
                        :data="listData"
                        v-loading="listLoading"
                        border
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="编号" width="100" align="center">
                        <template slot-scope="scope">{{(scope.$index + 1) + ((listQuery.pageNum-1)* listQuery.pageSize)}}</template>
                    </el-table-column>
                    <el-table-column label="商品图片"  width="160" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.pic" alt="" style="width: 120px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" align="center">
                        <template slot-scope="scope">{{scope.row.name}}</template>
                    </el-table-column>
                    <el-table-column label="价格/货号"  width="150" align="center">
                        <template slot-scope="scope">
                            <p>市场价: {{scope.row.originalPrice}}</p>
                            <p>商品售价: {{scope.row.price}}</p>
                            <p>货号: {{scope.row.productSn}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  width="130" align="center">
                        <template slot-scope="scope">
                            <p>
                                上架:
                                <el-switch
                                    v-model="scope.row.publishStatus"
                                    :active-value="1"
                                    :inactive-value="0"
                                    @change="handlePublishStatusChange(scope.$index, scope.row)"
                                >
                                </el-switch>
                            </p>
                            <p>
                                新品:
                                <el-switch
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.newsStatus"
                                    @change="handleNewStatusChange(scope.$index, scope.row)"
                                >
                                </el-switch>
                            </p>
                            <p>
                                推荐:
                                <el-switch
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-model="scope.row.recommendStatus"
                                    @change="handleRecommendStatusChange(scope.$index, scope.row)"
                                >
                                </el-switch>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="销量"  width="100" align="center">
                        <template slot-scope="scope">{{scope.row.sale ? scope.row.sale : '暂无统计'}}</template>
                    </el-table-column>
                    <el-table-column label="存量" align="center" width="100">
                        <template slot-scope="scope">{{scope.row.store}}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button
                                 size="mini"
                                 @click="handleUpdate(scope.$index, scope.row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--批量-->
            <div class="many-operate-container">
                <el-select
                  size="small"
                  placeholder="批量操作列表"
                  v-model="operatesType"
                >
                    <el-option
                        v-for="item in operates"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-button
                    style="margin-left: 10px;"
                    size="mini"
                    type="danger"
                    @click="handleManyOperate()"
                >
                    确定
                </el-button>
            </div>
            <!--分页-->
            <div class="pagination-container">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="listQuery.pageNum"
                        :page-sizes="[5, 10, 15]"
                        :page-size="listQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    // 1. 引入接口
    import {getProductList, delOneProduct, updateProductWithList} from './../../../api/productApi'
    import {getCategoryWithChildren} from './../../../api/categoryApi';

    const defaultQuery = {
        productSn: null , // 商品货号
        productCategoryId: null, // 商品所属分类
        publishStatus: null, // 上架状态
        name: null,  // 商品名称
        pageNum: 1,
        pageSize: 5
    };

    export default {
        name: "index",
        data(){
            return {
                listQuery: Object.assign({}, defaultQuery),
                // 分类列表
                productCateOptions: [],
                // 选中分类的数据
                productCateValue: [],
                // 商品是否上架
                publishStatusOptions: [
                    {value: 1, label: '上架'},
                    {value: 0, label: '下架'},
                ],
                // 表格数据
                listData: [
                  /*  {
                        id: 1,
                        pic: 'https://img.ddimg.mobi/product/11c9a477691191555502515839.jpg',
                        name: '鲜活黄鳝2条 300g以上',
                        price: 23.32,
                        productSn: 'LK0001',
                        publishStatus: 1,
                        newsStatus: 1,
                        recommendStatus: 1,
                        sort: 1,
                        sale: 1000,
                        count: 10000
                    },
                    {
                        id: 2,
                        pic: 'https://img.ddimg.mobi/product/73729284b788d1558072397291.jpg',
                        name: '康师傅大食代红烧牛肉面 5包/袋',
                        price: 23.32,
                        productSn: 'LK0002',
                        publishStatus: 1,
                        newsStatus: 1,
                        recommendStatus: 1,
                        sort: 1,
                        sale: 1000,
                        count: 10000
                    }*/
                ],
                // 表格加载动画
                listLoading: false,
                // 列表的总条数
                total: 0,
                multipleSelection: '',
                // 批量操作的选项
                operates: [
                    {
                        label: "批量上架",
                        value: 'publishOn'
                    },
                    {
                        label: "批量下架",
                        value: 'publishOff'
                    },
                    {
                        label: "批量推荐",
                        value: 'recommendOn'
                    },
                    {
                        label: "批量取消推荐",
                        value: 'recommendOff'
                    },
                    {
                        label: "批量上新",
                        value: 'newsOn'
                    },
                    {
                        label: "批量下新",
                        value: 'newsOff'
                    },
                    {
                        label: "批量删除",
                        value: 'manyDel'
                    }
                ],
                operatesType: null
            }
        },
        created(){
            // 0. 获取分类数据
            this.getCategoryList();
            // 1. 获取商品列表
            this.getList();
        },
        watch: {
            productCateValue(newValue){
                if(newValue.length === 1){ // 一级
                    this.listQuery.productCategoryId = newValue[0]
                }else if(newValue.length === 2){ // 二级
                    this.listQuery.productCategoryId = newValue[1];
                }else {
                    this.listQuery.productCategoryId = null;
                }
            }
        },
        methods: {
            // 0. 获取分类数据
            getCategoryList(){
                getCategoryWithChildren().then((response) => {
                    if (response.status === 1) {
                        let listArr = response.data;
                        this.productCateOptions = [];
                        for (let i = 0; i < listArr.length; i++) {
                            let children = [];
                            // 有二级
                            if(listArr[i].children != null && listArr[i].children.length>0){
                                for(let j=0; j<listArr[i].children.length; j++){
                                    children.push({value: listArr[i].children[j].id, label: listArr[i].children[j].name});
                                }
                            }
                            children = children.length > 0 ? children : null;
                            this.productCateOptions.push({
                                label: listArr[i].name,
                                value: listArr[i].id,
                                children: children
                            })
                        }
                    }
                });
            },
            // 1. 获取商品列表
            getList(){
               this.listLoading = true;
               getProductList(this.listQuery).then((response)=>{
                    if(response.status === 1){
                        this.listLoading = false;
                        this.listData = response.data.product_list;
                        this.total = response.data.product_count;
                    }
               });
            },
            // 2. 改变每页显示的条数
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                // 重新加载数据
                this.getList();
            },
            // 3. 当前页码发生改变
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.listQuery.pageNum = val;
                // 重新加载数据
                this.getList();
            },
            // 4. 删除一个商品
            handleDelete(index, row){
                this.$confirm('确定要删除该商品及相关信息, 是否继续?', '小撩温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delOneProduct(row.id).then(response => {
                        if(response.status === 1){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            if(this.total <= this.listQuery.pageSize){
                                this.listQuery.pageNum = 1;
                            }
                            this.getList();
                        }else {
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    });
                });
            },
            // 5. 编辑一个商品
            handleUpdate(index, row){
                this.$router.push({
                   path: '/pm/updateProduct',
                   query: {id: row.id}
                });
            },
            // 6. 商品上架和取消上架
            handlePublishStatusChange(index, row){
                this.localUpdateProduct({
                    id: row.id,
                    publishStatus: row.publishStatus
                })
            },
            // 7. 是否新品
            handleNewStatusChange(index, row){
                this.localUpdateProduct({
                    id: row.id,
                    newsStatus: row.newsStatus
                })
            },
            // 8. 是否推荐
            handleRecommendStatusChange(index, row){
                this.localUpdateProduct({
                    id: row.id,
                    recommendStatus: row.recommendStatus
                })
            },
            // 局部更新列表数据
            localUpdateProduct(paramsObj){
                 updateProductWithList(paramsObj).then((response)=>{
                     if(response.status === 1){
                         this.$message({
                             type: 'success',
                             message: response.msg
                         });
                     }else {
                         this.$message({
                             type: 'error',
                             message: response.msg
                         });
                     }
                 });
            },
            // 9. 根据条件查询列表
            handleSearchList(){
                this.listQuery.pageNum = 1;
                this.getList();
            },
            // 10. 清空查询列表
            handleResetSearch(){
                this.productCateValue = [];
                this.listQuery = Object.assign({}, defaultQuery);
            },
            // 9. 批量操作
            handleManyOperate(){

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>

<style scoped lang="less">

</style>
