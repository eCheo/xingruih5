<template>
    <header class="header">
       <nav class="nav"> 
       </nav>
    </header>
</template>

<script>
export default {
    name: 'Header',
    props: {

    },
    data() {
        return {
            
        }
    }
}
</script>

<style lang="less" scoped>
    .header {
        height: 80px;
        line-height: 80px;
        .nav {
            position: relative;
            height: inherit;
            text-align: center;
            margin: 0 auto;
            .h-right {
                display: inline-block;
            }
            .h-left {
                margin-left: 213px;
                display: inline-block;
                vertical-align: middle;
                line-height: 40px;
            }
        }
    }
</style>