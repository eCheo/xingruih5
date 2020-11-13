<template>
    <header class="header">
       <nav class="nav"> 
           <div class="h-right">官方快讯</div>
           <div class="h-left">
               <div class="h-seach"> 
                   <div class="h-input">
                       <!-- <div class="h-bg"> 

                       </div> -->
                       <input placeholder="扶持6城市3年提供80万套政策性住房" />
                   </div>
               </div>
               <ul class="h-list">
                   <li class="h-item">
                       <img src="../../assets/images/home/icon1_bq.png">
                   </li>
                   <li class="h-item">
                       <img src="../../assets/images/home/icon2_ash.png">
                   </li>
                   <li class="h-item">
                       <img src="../../assets/images/home/icon3_ash.png">
                   </li>
                   <li class="h-item">
                       <img src="../../assets/images/home/icon4_ash.png">
                   </li>
                   <li class="h-item">
                       <img src="../../assets/images/home/icon5_ash.png">
                   </li>
               </ul>
            </div>
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

<style lang="scss" scoped>
    .header {
        height: 80px;
        line-height: 80px;
        .nav {
            position: relative;
            width: 1366px;
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
                .h-seach {
                    width: 450px;
                    height: 45px;
                    display: inline-block;
                    background-image: -webkit-linear-gradient(to right, rgb(253, 216,47) 0%, rgb(253,125,95) 100%);  
                    background-image: -moz-linear-gradient(to right, rgb(253, 216,47) 0%, rgb(253,125,95) 100%); 
                    background-image: linear-gradient(to right, rgb(253, 216,47) 0%, rgb(253,125,95) 100%);
                    border-radius: 38px;
                    padding: 1px;
                    margin: 0px;
                    .h-input {
                        height: 43px;
                        padding-left: 21px;
                        border-radius: 38px;
                        background-color: #ffffff;
                        input {
                            outline-style: none ;
                            border: 1px solid #ccc; 
                            border-radius: 3px;
                            width: 347px;
                            height: 43px;
                            font-size: 14px;
                            border: none;
                        }
                    }  
                }
                .h-list {
                        display: inline-block;
                        vertical-align: middle;
                        margin:0 0 0 67px;
                        padding:0;
                        list-style:none;
                    .h-item {
                        float: left;
                        margin-right: 50px;
                        img {
                            vertical-align: middle;
                            cursor: pointer;
                        }
                    }
                    .h-item:last-child {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>