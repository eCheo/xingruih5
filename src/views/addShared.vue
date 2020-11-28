<template>
<div>
    <van-nav-bar
    title="添加客户"
    left-text="返回"
    left-arrow
    @click-left="$router.push('/mycustomer')">
    </van-nav-bar>
    <van-form @submit="onSubmit">
        <van-field
            v-model="form.name"
            name="客户名称"
            label="客户名称"
            placeholder="客户名称"
            :rules="[{ required: true, message: '请填写客户名称' }]"
        />
        <van-field
            v-model="form.phone"
            name="手机号"
            label="手机号"
            placeholder="手机号"
            :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field name="radio" label="性别">
            <template #input>
                <van-radio-group v-model="form.sex" direction="horizontal">
                    <van-radio name="Man">男</van-radio>
                    <van-radio name="WoMan">女</van-radio>
                </van-radio-group>
            </template>
        </van-field>
        <van-field
            v-model="form.format"
            name="业态"
            label="业态"
            placeholder="业态"
            :rules="[{ required: true, message: '请填写业态' }]"
        />
        <van-field
            v-model="form.brandName"
            name="品牌"
            label="品牌"
            placeholder="品牌"
        />
        <div style="display: flex;">
            <van-field style='width: 118%;' v-model="form.demandArea" label="需求面积"  name="需求面积"  placeholder='m²' :rules="[{ required: true, message: '请填写需求面积' }]"/>
                <span style="display:inline-block;background:#fff;padding-top:12px;">~</span>
                  <van-field v-model="form.deadAreaEnd" placeholder='m²' :rules="[{ required: true, message: '请填写需求面积' }]"/>
        </div>
        <van-field
            readonly
            clickable
            name="需求区域"
            label="需求区域"
            :value="areaText"
            placeholder="需求区域"
            @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
                <div style="display: flex; justify-content: space-between;padding: 6px 16px 0 16px;font-size: 14px;">
                    <div style="color: #969799;" @click="areadCancel">取消</div>
                    <div style="color: #576b95;" @click="areadConfirm">确定</div>
                </div>
                <TreeSelect
                :items="columns"
                :active-id.sync="activeId"
                :main-active-index.sync="activeIndex"
                @click-item='clickItem'
                @click-nav='clickNav'
                />
            </van-popup>
        <van-field
            v-model="form.demandAddress"
            name="备注"
            label="备注"
            placeholder="备注"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            show-word-limit
        />
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>
    </van-form>
    </div>
</template>

<script>
import {findCityAll, createCustomer} from '../api/user'
import { Form, Field, Picker, RadioGroup, Radio, Button, Popup, TreeSelect, NavBar} from 'vant';
export default {
    data() {
        return {
            form: {
                name: '',
                phone: '',
                sex: 'Man',
                format: '',
                demandArea: '',
                demandAddress: '',
                brandName: '',
                deadAreaEnd: '',
                areaId: '',
                streetId: ''
            },
            showPicker: false,
            columns: [],
            activeId: '',
            activeIndex: 0,
            areaText: '',
            street: ''
        }
    },
    components: {
        'van-form': Form,
        'van-field': Field,
        'van-picker': Picker,
        'van-radio-group': RadioGroup,
        'van-radio': Radio,
        'van-button': Button,
        'van-popup':Popup,
        'van-nav-bar':NavBar,
        TreeSelect
    },
    created() {
        this.getAddress();
    },
    methods: {
        onSubmit() {
            createCustomer(this.form).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.$toast.success('添加成功');
                } else {
                    this.$toast.error(res.data.message);
                }
            })
        },
        areadCancel() {
            this.showPicker = false;
            this.form.streetId = '';
            this.form.areaId = '';
        },
        areadConfirm() {
            this.form.areaId = this.columns[this.activeIndex].id;
            this.showPicker = false;
            if (this.activeId === '') {
                this.areaText = this.columns[this.activeIndex].text;
            } else {
                this.areaText = this.columns[this.activeIndex].text + '/' + this.street;
            }
            console.log(this.form);
        },
        clickItem(data) {
            this.form.streetId = data.id;
            this.street = data.text;
        },
        clickNav() {
            this.activeId = ''
            this.form.streetId = ''
        },
        getAddress() {
            findCityAll().then(res => {
                if (res.status === 200 && res.data.code === '200') {
                res.data.data.forEach(item => {
                    item.children = item.children.map(it => {return {id:it.id, text: it.name}})
                })
                this.columns = res.data.data.map(item => {return {id:item.id, text: item.name,children: item.children}})
                } else {
                this.$toast.error(res.data.message);
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>