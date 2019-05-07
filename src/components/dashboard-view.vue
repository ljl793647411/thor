<template>
  <div class="dashboard-view">
    <el-radio-group v-model="radio" :change="change(radio)">
      <el-radio-button :label="title" border v-for="(title, index) in titleLists" :key="index + 'key'"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '',
      titleLists: []
    }
  },
  props: ['titleList'],
  mounted () {
    this.$nextTick(() => {
      if (this.titleList && this.titleList.length !== 0) {
        this.titleLists = this.titleList
        this.radio = this.titleLists[0]
      }
    })
  },
  methods: {
    change (value) {
      for (let i in this.titleLists) {
        if (this.radio === this.titleLists[i]) {
          this.$emit('getType', i)
        }
      }
    }
  }
}
</script>

<style>
  .dashboard-view {
    display: inline-block;
  }
</style>
