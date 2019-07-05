<template>
  <div>
    <head-tab :title="$route.query.user_name" @back="$router.go(-1)" :back="true">
      <div slot="headright">右边</div>
    </head-tab>
  </div>
</template>
<script>
export default {
  name: 'userspace'
}
</script>
<style lang="scss" scoped>
</style>


