<template>
<div>
    <van-nav-bar
    title="添加铺源"
    left-text="返回"
    left-arrow
    @click-left="$router.push('/shop')">
    </van-nav-bar>
    <van-form @submit="onSubmit">
        <van-field
            v-model="form.name"
            name="业主名称"
            required
            label="业主名称"
            placeholder="业主名称"
            :rules="[{ required: true, message: '请填写业主名称' }]"
        />
        <van-field
            v-model="form.phone"
            name="电话"
            required
            label="电话"
            placeholder="电话"
            :rules="[{ required: true, message: '请填写电话号码' }]"
        />
        <van-field name="radio" label="性别" required>
            <template #input>
                <van-radio-group v-model="form.sex" direction="horizontal">
                    <van-radio name="Man">男</van-radio>
                    <van-radio name="WoMan">女</van-radio>
                </van-radio-group>
            </template>
        </van-field>
        <van-field
            v-model="form.areaSize"
            name="面积"
            required
            label="面积(m²)"
            placeholder="面积"
            :rules="[{ required: true, message: '请填写面积' }]"
        />
        <van-field
            v-model="form.floorHeight"
            name="楼层"
            required
            label="楼层"
            placeholder="楼层"
            :rules="[{ required: true, message: '请填写楼层' }]"
        />
        <van-field
            v-model="form.buildingHeight"
            name="层高"
            required
            label="层高(m)"
            placeholder="层高"
            :rules="[{ required: true, message: '请填写层高' }]"
        />
        <van-field
            v-model="form.deepening"
            name="进深"
            required
            label="进深(m)"
            placeholder="进深"
            :rules="[{ required: true, message: '请填写进深' }]"
        />
        <van-field
            v-model="form.openRoom"
            name="开间"
            required
            label="开间(m)"
            placeholder="开间"
            :rules="[{ required: true, message: '请填写开间' }]"
        />
        <van-field
            v-model="form.money"
            name="租金"
            required
            label="租金(元)"
            placeholder="租金"
            :rules="[{ required: true, message: '请填写租金' }]"
        />
        <van-field
            v-model="form.paymentMethod"
            name="付款方式"
            label="付款方式"
            placeholder="付款方式"
        />
        <van-field
            readonly
            clickable
            required
            name="铺源区域"
            label="铺源区域"
            :value="areaText"
            placeholder="铺源区域"
            @click="showPicker = true"
            :rules="[{ required: true, message: '请选择区域' }]"
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
            v-model="form.area"
            name="详细地址"
            label="详细地址"
            placeholder="详细地址"
            type="text"
            show-word-limit
        />
        <van-field
            v-model="form.remarks"
            name="备注"
            label="备注"
            placeholder="备注"
            rows="2"
            autosize
            required
            type="textarea"
            maxlength="50"
            show-word-limit
            :rules="[{ required: true, message: '请填写备注' }]"
        />
        <van-field name="fileList" label="铺源照片">
            <template #input>
                <van-uploader v-model="fileList" :after-read="afterRead" :before-read="beforeRead" :max-count="9" :before-delete='deleteFile' :rules="[{ required: true, message: '请上传照片' }]"/>
            </template>
        </van-field>
        
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>
    </van-form>
    </div>
</template>

<script>
import {findCityAll, createShop, uploadImg} from '../api/user'
import { Form, Field, Picker, RadioGroup, Radio, Button, Popup, TreeSelect, NavBar, Uploader } from 'vant';
export default {
    data() {
        return {
            form: {
                name: '',
                phone: '',
                sex: 'Man',
                areaSize: '',
                area: '',
                buildingHeight: '',
                floorHeight: '',
                deepening: '',
                money: '',
                openRoom: '',
                paymentMethod: '',
                imagePaths: [],
                areaId: '',
                streetId: '',
                remarks: ''
            },
            showPicker: false,
            columns: [],
            activeId: '',
            activeIndex: 0,
            areaText: '',
            street: '',
            fileList: []
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
        'van-uploader': Uploader,
        TreeSelect
    },
    created() {
        this.getAddress();
    },
    methods: {
        onSubmit() {
            createShop(this.form).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    this.$toast.success('添加成功');
                    this.$router.push('/shop')
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
        },
        beforeRead(file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
                this.$toast.error('请上传jpg,png格式图片');
                return false;
            } else {
                return true
            }
        },
        afterRead(file) {
            let formData = new FormData();
            formData.append('filename', file.name);
            formData.append('file', file.file)
            file.status = 'uploading';
            file.message = '上传中...';
            uploadImg(formData).then(res => {
                if (res.status === 200 && res.data.code === '200') {
                    file.status = 'done';
                    file.id = res.data.data.id;
                    file.url = res.data.data.viewUrl;
                    this.fileList.forEach(item => {
                        this.form.imagePaths.push(item.url)
                    })
                } else {
                    file.status = 'failed';
                    file.message = '上传失败';
                }
            })
        },
        deleteFile(file) {
           let index = this.fileList.findIndex(item => {
                item.id === file.id
            })
            this.form.imagePaths.splice(index, 1);
            return true
        }
    }
}
</script>

<style lang="less" scoped>

</style>