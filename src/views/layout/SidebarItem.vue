<template>
	<div class='menu-wrapper'>
	
	<template v-for="item in permissionMenus">
		<!-- <router-link v-if="item.children.length>0" :to="item.code+'/'+item.children[0].code">
			<el-menu-item :index="item.code+'/'+item.children[0].code" class='submenu-title-noDropdown'>
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span slot="title">{{item.children[0].title}}</span>
			</el-menu-item>
		</router-link> -->
		<el-submenu :index="item.title" :key="item.name">
			<template slot="title">
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span>{{item.title}}</span>
			</template>
			<template v-for="child in item.children">
				<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.name"> </sidebar-item>
				<!--当资源路径开始是http，则以跳转页面的方式进入，否则正常路由进入-->
				<!-- <a target="_blank"  v-if="child.href!=null&&child.href.indexOf('http')==0" :href="child.href" :key="child.name">
					<el-menu-item :index="'/'+item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</a> -->
				<router-link v-if="child.type!='dirt'"  :to="'/'+item.code+'/'+child.code" :key="child.name">
					<el-menu-item :index="'/'+item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</router-link>
			</template>
		</el-submenu>

	</template>

	</div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      permissionMenus: {
        type: Array
      },
	},
	mounted(){
		console.log("导航栏的是permissionMenus：",this.permissionMenus)
	}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

