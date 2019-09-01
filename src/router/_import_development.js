//此处应该加default，如果不加，则前面的component要加s,
//这是因为vue-loader升级到了13.0导致的
module.exports = file => require('@/views/' + file + '.vue').default

