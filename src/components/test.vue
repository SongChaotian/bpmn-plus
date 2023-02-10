<template>
    <div>
        <label>Add Data Field</label>
        <button @click="test">+</button>
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <div class="row m-2" v-for="(value, key) in DataFields_dict" :key="key">
                        <div class="col-3">
                            <input type="text" class="form-control" placeholder="key" :value="key" />
                        </div>
                        <div class="col-3">
                            <input type="text" class="form-control" placeholder="value" :value="value">
                        </div>
                        <button class="col-1">×</button>
                    </div>
                    <button @click="test">{{ DataFields_dict }}</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Vue from 'vue';

export default {
    data() {
        return {
            DataFields_dict: {},
            key_id: 1,
        }
    },
    methods: {
        test() {
            Vue.set(this.DataFields_dict, `Key${this.key_id}`, `Value${this.key_id}`);
            // this.DataFields_dict[`Key${this.key_id}`] = `Value${this.key_id}`;
            let key = `Key${this.key_id}`;
            let value = `Value${this.key_id}`;
            this.key_id++;
        }
    }
}
</script>

