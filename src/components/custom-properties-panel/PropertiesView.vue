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
            <div class="btn btn-outline-primary btn-sm ms-2" @click="add_mrfield_group">+</div>
          </div>

          <div class="card-text">
            <div class="row mt-2" v-for="(MRField, groupName) in MRField_dict" :key="groupName">
              <div class="col-6">
                <input type="text" class="form-control" placeholder="MRField" :value="groupName"
                  @change="event => changeField_MRField_GroupName(event, groupName)" />
              </div>
              <div class="col-3">
                <div class="dropdown">
                  <button type="button" class="btn btn-outline-primary dropdown-toggle btn-sm"
                    data-bs-toggle="dropdown">
                    +
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#"
                        v-for="(DataFields_dict_value, DataFields_dict_key) in DataFields_dict"
                        :key="DataFields_dict_key"
                        @click="add_mrfield_item(groupName, DataFields_dict_key, DataFields_dict_value)">
                        {{ DataFields_dict_key }}：{{ DataFields_dict_value }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-2">
                <div class="btn btn-outline-danger btn-sm" @click="delete_mrfield_group(groupName)">×</div>
              </div>

              <div class="row" v-for="(MRField_item, MRField_item_key) in MRField" :key="MRField_item_key">
                <div class="col-10">
                  <p class="h6 small mark" style="float:left">{{ MRField_item_key }}：{{ MRField_item }}</p>
                </div>
                <div class="col-1">
                  <div class="btn btn-outline-danger btn-sm" style="float:left"
                    @click="delete_mrfield_item(groupName, MRField_item_key)">×
                  </div>
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
      // MRField_dict: {
      //   "group1": {
      //     "Team1": "阿根廷",
      //     "Team2": "法国",
      //   },
      //   "group2": {
      //     "Team3": "克罗地亚",
      //     "Team4": "摩洛哥",
      //   },
      //   "group3": {},
      // },
      MRField_dict: {},

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

    verifyIsEvent(type) {  // 判断类型是不是event
      return type.includes('Event')
    },

    verifyIsTask(type) {  // 判断类型是不是task
      if (type.includes('Task')) {
        this.read_expansion_data();  // 读取额外数据
        this.read_MessageRelation();  // 读取MessageRelation
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

    // 用于读取扩展的数据
    read_expansion_data() {
      for (let key in this.DataFields_dict) {  // 清空DataFields
        delete this.DataFields_dict[key];
      }

      let DataFields_backup_dict = this.element.businessObject.$attrs;  // 取出当前元素的附加属性
      for (let key in DataFields_backup_dict) {
        this.DataFields_dict[key] = DataFields_backup_dict[key];
      }
    },

    // 用于读取MessageRelation
    read_MessageRelation() {
      for (let key in this.MRField_dict) {  // 清空MRField_dict
        Vue.delete(this.MRField_dict, key);
      }

      const businessObject = this.element.businessObject;
      if (businessObject.mrfield_list) {  // 如果有mrfield_list附加属性的话
        let mrfield_list = businessObject.mrfield_list.$attrs;  // 获取mrfield_list，里面存放的扩展的MRField组
        let mrfield_list_item = businessObject.mrfield_list;

        for (let key_i in mrfield_list) {  // 枚举每一个MRField组拿到组名以及组里面的对象
          let mrfGropuName = mrfield_list[key_i];  // mrfGropuName用户看到的MRField组名
          let mrfield_Keyname = key_i.split("_")[0];  // mrfield_Keyname存储在businessObject的组名
          Vue.set(this.MRField_dict, mrfGropuName, {});  // 响应式给对象增加数据，页面也会重新渲染

          for (let key_j in mrfield_list_item[`${mrfield_Keyname}`].$attrs) {
            let item_val = mrfield_list_item[`${mrfield_Keyname}`].$attrs[key_j]
            this.MRField_dict[mrfGropuName][key_j] = item_val;
          }
        }
      }
    },

    // 增加额外数据field
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

    // 删除额外数据field
    delete_data(key) {
      console.log(`删除键为${key}的这条数据:`);
      Vue.delete(this.DataFields_dict, key);
      Vue.delete(this.element, key);
      let properties = {}
      properties[key] = undefined;
      this.updateProperties(properties);  // 调用属性更新方法

      // 如果是Task类型的数据还要更新一下MessageRelation
      if (this.verifyIsTask(this.element.type)) {
        this.synchronous_delete_mrfield_item(key);  // 同步更新下面的MessageRelation
      }
    },

    // 适用于Task，增加一个MessageRelation的Group
    add_mrfield_group() {
      let newGroupItem = 0;
      console.log("增加一个组");
      const { modeler, element } = this;
      const bpmnFactory = modeler.get('bpmnFactory');
      const businessObject = element.businessObject;

      if (!businessObject.mrfield_list) {  // 如果元素没有MessageRelation的话，给他开个新的
        let mrfield_list = bpmnFactory.create('mrfields:MRField_item_list', {});
        businessObject.mrfield_list = mrfield_list;
      }

      for (let i = 1; i <= 10; i++) {  // 从1-10中找一个数字作为组的num来增加
        let mrfield_list = businessObject.mrfield_list.$attrs;
        let sign = true;
        for (let GroupName_key in mrfield_list) {
          if (GroupName_key.search(i) != -1) {  // 如果mrfield_list已经有了这个num就枚举下一个数字
            sign = false;
            break;
          }
        }
        if (sign) {  // 找到了合适的num就使用
          newGroupItem = i;
          break;
        }
      }

      let NewMrfieldGroup = bpmnFactory.create('mrfields:MRField_item', {});  // 创建子元素
      businessObject.mrfield_list[`mrfield${newGroupItem}`] = NewMrfieldGroup;
      businessObject.mrfield_list.$attrs[`mrfield${newGroupItem}_name`] = `group${newGroupItem}`;

      this.read_MessageRelation();
    },

    // 适用于Task，删除一个MessageRelation的Group
    delete_mrfield_group(GroupName) {
      console.log("删除组的名为：", GroupName);

      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {

          let mrfield_Keyname = i.split("_")[0];
          console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          delete mrfield_list_item[mrfield_Keyname];
          delete mrfield_list[i];
          console.log("删除完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，向MessageRelation里的其中一个Group增加一项额外数据item
    add_mrfield_item(GroupName, newKey, newValue) {
      console.log("要增加item的组为：", GroupName);
      console.log("要增加的项目为：", newKey, newValue);

      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {
          let mrfield_Keyname = i.split("_")[0];
          console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          mrfield_list_item[mrfield_Keyname].$attrs[newKey] = newValue;
          console.log("增加完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，删除MessageRelation里的其中一个Group的一项额外数据item
    delete_mrfield_item(GroupName, GroupItem) {
      console.log("删除项目所在组为：", GroupName);
      console.log("删除项目的名为：", GroupItem);

      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === GroupName) {
          let mrfield_Keyname = i.split("_")[0];
          console.log("当前的mrfield_Keyname是:", mrfield_Keyname);
          delete mrfield_list_item[mrfield_Keyname].$attrs[GroupItem];
          console.log("删除完成");
        }
      }
      this.read_MessageRelation();
    },

    // 适用于Task，当上面的item更新后同步更新MessageRelation里Group里修改的item
    synchronous_update_mrfield_item(Key, newValue) {
      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === Key) {
            mrfield_list_item[mrfield_Keyname].$attrs[j] = newValue;
          }
        }
      }
    },

    // 适用于Task，当上面的item的Key更新后同步更新MessageRelation里Group里修改的item
    synchronous_updateKey_mrfield_item(oldKey, newKey, Value) {
      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === oldKey) {
            delete mrfield_list_item[mrfield_Keyname].$attrs[j];
            mrfield_list_item[mrfield_Keyname].$attrs[newKey] = Value;
          }
        }
      }
    },

    // 适用于Task，当上面的item删除后同步删除MessageRelation里Group里修改的item
    synchronous_delete_mrfield_item(Key) {
      const businessObject = this.element.businessObject;
      let mrfield_list = businessObject.mrfield_list.$attrs;
      let mrfield_list_item = businessObject.mrfield_list;

      for (let i in mrfield_list) {
        let mrfield_Keyname = i.split("_")[0];
        console.log("当前的mrfield_Keyname是:", mrfield_Keyname);

        for (let j in mrfield_list_item[mrfield_Keyname].$attrs) {
          if (j === Key) {
            delete mrfield_list_item[mrfield_Keyname].$attrs[j];
          }
        }
      }
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

      // 如果是Task类型的数据还要更新一下MessageRelation
      if (this.verifyIsTask(this.element.type)) {
        this.synchronous_update_mrfield_item(type, value);  // 同步更新下面的MessageRelation
      }
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

      this.synchronous_updateKey_mrfield_item(old_key, new_key, value);
    },

    // 修改MessageRelation里的组名
    changeField_MRField_GroupName(event, key) {
      console.log("原组名", key);
      console.log("新组名:", event.target.value);

      let newName = event.target.value;
      const businessObject = this.element.businessObject;
      const mrfield_list = businessObject.mrfield_list.$attrs;

      for (let i in mrfield_list) {
        if (mrfield_list[i] === key) {
          mrfield_list[i] = newName;
          console.log("当前的mrfield_Keyname是:", i);
        }
      }
      this.read_MessageRelation();  // 更新MessageRelation
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
