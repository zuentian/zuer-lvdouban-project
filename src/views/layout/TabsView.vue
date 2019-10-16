<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <!--因为有些页面是传参数的路由，若是这样的路由展示出来，点击跳转会因为没有参数报错。故而筛除掉-->
      <el-tag v-if='tag.path.indexOf(":")<0' :closable="true" :type="isActive(tag.path)?'primary':''" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
  export default {
    computed: {
      visitedViews() {
        return this.$store.state.app.visitedViews.slice(-6)
      }
    },
    methods: {
      closeViewTabs(view, $event) {
        this.$store.dispatch('delVisitedViews', view)
        $event.preventDefault()
      },
      generateRoute() {

        if (this.$route.matched[this.$route.matched.length - 1].name) {
          return this.$route.matched[this.$route.matched.length - 1]
        }
        this.$route.matched[0].path = '/'
        console.log("this.$route.matched[0]",this.$route.matched[0])
        return this.$route.matched[0]
      },
      addViewTabs() {
        this.$store.dispatch('addVisitedViews', this.generateRoute())
      },
      isActive(path) {
        return path === this.$route.path
      }
    },
    watch: {
      $route() {
        this.addViewTabs()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
