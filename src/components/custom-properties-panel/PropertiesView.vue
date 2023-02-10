<template>
  <div class="custom-properties-panel">
    <div class="empty" v-if="selectedElements.length <= 0">请选择一个元素</div>
    <div class="empty" v-else-if="selectedElements.length > 1">只能选择一个元素</div>
    <div v-else>
      <fieldset class="element-item">
        <label>id</label>
        <span>{{ element.id }}</span>
      </fieldset>
      <fieldset class="element-item">
        <label>name</label>
        <input class="form-control" :value="element.name" @change="event => changeField(event, 'name')" />
      </fieldset>
      <fieldset class="element-item">
        <label>customProps</label>
        <input class="form-control" :value="element.customProps" @change="event => changeField(event, 'customProps')" />
      </fieldset>
      <fieldset class="element-item form-control-color-item">
        <label>节点颜色</label>
        <input class="form-control" type="color" :value="element.color"
          @change="event => changeField(event, 'color')" />
      </fieldset>
      <fieldset class="element-item" v-if="isEvent">
        <label>修改event节点类型</label>
        <select class="form-select" @change="changeEventType" :value="eventType">
          <option v-for="option in eventTypes" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </fieldset>

      <fieldset class="element-item" v-if="isTask">
        <label>修改Task节点类型</label>
        <select class="form-select" @change="changeTaskType" :value="taskType">
          <option v-for="option in taskTypes" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </fieldset>

      <div class="card mt-2" v-if="isDataStoreReference || isDataObjectReference || isTask">
        <div class="card-body">
          <div class="card-title">
            <label v-if="isDataStoreReference || isDataObjectReference">Add Data Field</label>
            <label v-if="isTask">Add Message Field</label>
            <div class="btn btn-outline-primary btn-sm ms-2" @click="add_data">+</div>
          </div>
          <div class="card-text">
            <div class="row mt-2" v-for="(value, key) in DataFields_dict" :key="key">
              <div class="col-5">
                <input type="text" class="form-control" placeholder="key" :value="key"
                  @change="event => changeField_key(event, key, value)" />
              </div>
              <div class="col-5">
                <input type="text" class="form-control" placeholder="value" :value="value"
                  @change="event => changeField(event, key)" />
              </div>
              <div class="col-2">
                <div class="btn btn-sm btn-outline-danger" @click="delete_data(key)">×</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mt-2" v-if="isTask">
        <div class="card-body">
          <div class="card-title">
            <label>Add MessageRelation</label>
            <div class="btn btn-outline-primary btn-sm ms-2">+</div>
          </div>

          <div class="card-text">
            <div class="row mt-2" v-for="(MRField, key) in MRField_dict" :key="key">
              <div class="col-7">
                <input type="text" class="form-control" placeholder="MRField" :value="key" />
              </div>
              <div class="col-2">
                <div class="btn btn-outline-primary btn-sm">+</div>
              </div>
              <div class="col-2">
                <div class="btn btn-outline-danger btn-sm">×</div>
              </div>

              <div v-for="(MRField_item, MRField_item_key) in MRField" :key="MRField_item_key">
                <div class="row">
                  <div>{{ MRField_item_key }} {{ MRField_item }}</div>
                  <!-- <div class="btn btn-sm btn-outline-danger">×</div> -->
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>


    </div>
  </div>
</template>

<script>
import { START_EVENT } from 'bpmn-js/lib/features/replace/ReplaceOptions.js';
import $ from "jquery";
import { ref } from 'vue';
import Vue from 'vue';

export default {
  name: 'PropertiesView',
  props: {
    modeler: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      selectedElements: [],  // 当前选择的元素集合
      element: null,  // 当前点击的元素
      eventTypes: [
        { label: '默认', value: '' },
        { label: 'MessageEventDefinition', value: 'bpmn:MessageEventDefinition' },
        { label: 'TimerEventDefinition', value: 'bpmn:TimerEventDefinition' },
        { label: 'ConditionalEventDefinition', value: 'bpmn:ConditionalEventDefinition' },
        { label: 'SignalEventDefinition', value: 'bpmn:SignalEventDefinition' },
      ],
      eventType: '',
      taskTypes: [
        { label: 'Task', value: 'bpmn:Task' },
        { label: 'Send Task', value: 'bpmn:SendTask' },
        { label: 'Receive Task', value: 'bpmn:ReceiveTask' },
        { label: 'User Task', value: 'bpmn:UserTask' },
        { label: 'Manual Task', value: 'bpmn:ManualTask' },
        { label: 'Business Rule Task', value: 'bpmn:BusinessRuleTask' },
        { label: 'ServiceTask', value: 'bpmn:ServiceTask' },
      ],
      taskType: '',

      key_id: 1,
      DataFields_dict: {},
      MRField_dict: {
        "MRField1": {
          "Team1": "阿根廷",
          "Team2": "法国",
          "Team5": "中国",
        },
        "MRField2": {
          "Team3": "克罗地亚",
          "Team4": "摩洛哥",
        },
        "MRField3": {},
      },
      MRField_id: 1,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      const { modeler } = this;  // 父组件传递进来的modeler
      //console.log(modeler)
      //console.log(START_EVENT)

      // selection.changed 监听选中的元素
      modeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection;  // 数组，可能有多个（Windows下按住Ctrl可以选多个元素）
        this.element = e.newSelection[0];  // 默认取第一个
        console.log(this.element);
        this.setDefaultProperties();  // 设置一些默认的值
      });

      // element.changed 监听发生改变的元素
      modeler.on('element.changed', e => {
        const { element } = e;
        const { element: currentElement } = this;
        if (!currentElement) {
          return
        }
        // update panel, if currently selected element changed
        if (element.id === currentElement.id) {
          this.element = element
        }
      })
    },

    setDefaultProperties() {
      // const { element } = this 等价于const element = this.element, 好处是可以直接使用element了
      const { element } = this;
      if (element) {
        // 这里可以拿到当前点击的节点的所有属性
        const { type, businessObject } = element;
        const { name } = businessObject;
        if (this.verifyIsEvent(type)) {
          this.eventType = businessObject.eventDefinitions ? businessObject.eventDefinitions[0]['$type'] : ''
          console.log(this.eventType)
        } else if (this.verifyIsTask(type)) {
          this.taskType = type
        }
        element['name'] = name;  // 同步更新图上的label和自定义属性栏的name
      }
    },

    verifyIsEvent(type) {  // 判断类型是不是event
      return type.includes('Event')
    },

    read_expansion_data() {  // 用于读取扩展的数据
      for (let key in this.DataFields_dict) {  // 清空DataFields
        delete this.DataFields_dict[key];
      }

      let DataFields_backup_dict = this.element.businessObject.$attrs;  // 取出当前元素的附加属性
      for (let key in DataFields_backup_dict) {
        this.DataFields_dict[key] = DataFields_backup_dict[key];
      }
    },

    verifyIsTask(type) {  // 判断类型是不是task
      if (type.includes('Task')) {
        this.read_expansion_data();
        return true;
      }
      return false;
    },
    verifyIsDataObjectReference(type) {  // 判断类型是不是bpmn:DataObjectReference
      if (type === "bpmn:DataObjectReference") {
        this.read_expansion_data();
        return true;
      }
      return false;
    },
    verifyIsDataStoreReference(type) {  // 判断类型是不是bpmn:DataStoreReference
      if (type === "bpmn:DataStoreReference") {
        this.read_expansion_data();
        return true;
      }
      return false;
    },

    add_data() {
      Vue.set(this.DataFields_dict, `Key${this.key_id}`, `Value${this.key_id}`);  // 响应式给对象增加数据，页面也会重新渲染
      console.log(this.DataFields_dict);

      let key = `Key${this.key_id}`;
      let value = `Value${this.key_id}`;
      console.log("增加的key:", key);
      console.log("增加的value", value);
      console.log("当前元素", this.element);

      this.element[key] = value;
      let properties = {}
      properties[key] = value;
      this.updateProperties(properties);  // 调用属性更新方法
      this.key_id++;
    },

    delete_data(key) {
      console.log(`删除键为${key}的这条数据:`);
      Vue.delete(this.DataFields_dict, key);
      Vue.delete(this.element, key);
      let properties = {}
      properties[key] = undefined;
      this.updateProperties(properties);  // 调用属性更新方法
    },

    /**
     * 改变控件触发的事件
     * @param { Object } input的Event
     * @param { String } 要修改的属性的名称
     */
    changeField(event, type) {
      console.log("改变输入框引发是事件", event);
      console.log("要修改的key:", type);
      console.log("要修改的value", event.target.value);
      const value = event.target.value;
      console.log("原本的value", this.element[type]);
      console.log("当前元素", this.element);
      this.element[type] = value
      let properties = {}
      properties[type] = value
      if (type === 'color') {
        this.onChangeColor(value)
      }
      this.updateProperties(properties);  // 调用属性更新方法
    },
    // 修改key的思路，将value保存下来，先将原old_key、value对删除，再增加一个new_key、value对
    changeField_key(event, old_key, value) {
      console.log("改变输入框引发是事件", event);
      console.log("旧key:", old_key);
      console.log("新key:", event.target.value);
      const new_key = event.target.value;
      console.log("原本的value:", this.element[old_key]);
      console.log("当前元素:", this.element);

      console.log(`删除键为${old_key}的这条数据:`);
      Vue.delete(this.DataFields_dict, old_key);
      Vue.delete(this.element, old_key);
      this.element[new_key] = value;
      let properties = {}
      properties[old_key] = undefined;
      properties[new_key] = value
      this.updateProperties(properties);  // 调用属性更新方法
    },
    updateName(name) {
      const { modeler, element } = this
      const modeling = modeler.get('modeling')
      modeling.updateLabel(element, name)
      // 等同于 modeling.updateProperties(element, { name })
    },
    onChangeColor(color) {
      console.log(color)
      const { modeler, element } = this
      const modeling = this.modeler.get('modeling')
      modeling.setColor(element, {
        fill: null,  // 节点的填充色
        stroke: color  // 节点边框的颜色和节点label的颜色
      })
    },
    changeEventType(event) {  // 改变下拉框
      console.log(event)
      const { modeler, element } = this
      const value = event.target.value;  // 当前下拉框选择的值
      const bpmnReplace = modeler.get('bpmnReplace')
      this.eventType = value
      bpmnReplace.replaceElement(element, {
        type: element.businessObject.$type,
        eventDefinitionType: value  // 修改type
      })
    },
    changeTaskType(event) {
      console.log(event)
      const { modeler, element } = this
      const value = event.target.value;  // 当前下拉框选择的值
      const bpmnReplace = modeler.get('bpmnReplace')
      bpmnReplace.replaceElement(element, {
        type: value  // 直接修改type就可以了
      })
    },

    /**
     * 更新元素属性
     * @param { Object } 要更新的属性, 例如 { name: '' }
     */
    updateProperties(properties) {  // 公用的属性更新方法
      const { modeler, element } = this;
      const modeling = modeler.get('modeling');  // modeling.updateProperties()用来修改e.element的内容
      modeling.updateProperties(element, properties)
    }
  },

  computed: {
    isEvent() {  // 判断当前点击的element是不是event
      const { element } = this;
      return this.verifyIsEvent(element.type)
    },
    isTask() {  // 判断当前点击的element是不是Task
      const { element } = this;
      return this.verifyIsTask(element.type)
    },
    isDataObjectReference() {  // 判断当前点击的element是不是DataObjectReference
      const { element } = this;
      return this.verifyIsDataObjectReference(element.type)
    },
    isDataStoreReference() {  // 判断当前点击的element是不是DataStoreReference
      const { element } = this;
      return this.verifyIsDataStoreReference(element.type)
    },
  }
}
</script>

<style scoped>
.custom-properties-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
  background-color: #F8F8F8;
  border-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 20px;
}

.empty {
  height: 200px;
  line-height: 200px;
  font-weight: 700;
}

.element-item {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid;
  border-color: #CECFD1;
  border-radius: 8px;
}

.element-item:first-child {
  margin-top: 0;
}


.custom-properties-panel label {
  font-weight: bold;
}

.custom-properties-panel label:after {
  content: ': ';
}
</style>
