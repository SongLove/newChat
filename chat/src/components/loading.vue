<template>
  <div class="loader">
    <div class="loader-loading">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.loader {
  width: 30%;
  margin-bottom: 20px;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &-loading i {
    display: inline-block;
    margin-left: 5px;
    background: #333;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  &-loading i:nth-child(1) {
    animation: loading 0.7s ease-in 0s infinite;
  }
  &-loading i:nth-child(2) {
    animation: loading 0.7s ease-in 0.15s infinite;
  }
  &-loading i:nth-child(3) {
    animation: loading 0.7s ease-in 0.3s infinite;
  }
  &-loading i:nth-child(4) {
    animation: loading 0.7s ease-in 0.45s infinite;
  }
}
@keyframes loading {
  0% {
    margin-bottom: 0;
  }
  50% {
    margin-bottom: 20px;
  }
  100% {
    margin-bottom: 0px;
  }
}
</style>

