<template>
  <div class="block top">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizesList"
      :page-size="pageSizes"
      layout=" prev, pager, next, jumper, sizes, total"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSizeChange (val) {
        this.pageSizes = val
        this.$emit('changePage', 1, val)
      },
      handleCurrentChange (val) {
        this.$emit('changePage', val, this.pageSizes)
      }
    },
    mounted () {
      this.$nextTick(() => {
        console.log('currentPage', this.currentPage, 'pageSize', this.pageSize)
      })
    },
    props: ['pageVo', 'currentPage', 'count', 'totalRecs', 'pageSize'],
    data () {
      return {
        pageSizesList: [10, 20, 30, 40, 50],
        pageSizes: this.pageSize
      }
    },
    computed: {
      total () {
        return parseInt(this.totalRecs)
      }
    }
  }
</script>

<style>
  .top {
    margin-top: 20px;
    float: left;
  }
  .top .el-pagination__jump,.top .el-pagination__total {
    color: #fff !important;
  }
</style>
