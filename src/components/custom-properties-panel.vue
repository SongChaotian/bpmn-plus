<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <properties-view v-if="bpmnModeler" :modeler="bpmnModeler"></properties-view>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler';  // 这个用来建模
import PropertiesView from './custom-properties-panel/PropertiesView';  // 自定义的 右侧属性栏 (框+内容)

import MRfieldDescriptor from '../descriptors/mrfield';  // 自定义的右侧扩展属性描述json
import InstanceNumberDescriptor from '../descriptors/InstanceNumber';

import { xmlStr } from '../mock/xmlStr';   // 引入一个本地的xml字符串


export default {
  name: '',
  components: {
    PropertiesView  // 自定义的 右侧属性栏
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() { },
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    this.init();
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null
    }
  },
  // 方法集合
  methods: {
    init() {
      this.container = this.$refs.content;  // 获取到属性ref为“content”的dom节点
      const canvas = this.$refs.canvas;  // 获取到属性ref为“canvas”的dom节点

      // 建模
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        moddleExtensions: {  // 自定义的维护属性面板中的属性
          MRfield: MRfieldDescriptor,
          InstanceNumber: InstanceNumberDescriptor
        }
      });
      this.createNewDiagram();
    },

    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(xmlStr, err => {
        if (err) {
          // console.error(err)
        } else {
          // 这里是成功之后的回调, 可以在这里做一系列事情
          this.success();
        }
      })
    },

    success() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.addBpmnListener();     // 保存图片、bpmn文件用
      this.addModelerListener();   // 监听modeler并绑定事件
    },

    // 添加绑定事件
    addBpmnListener() {
      const outer = this;
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        outer.saveDiagram(function (err, xml) {  // 这里获取到的就是最新的xml信息
          console.log(xml);  // 将最新的xml信息打印出来
        })
      })
    },

    addModelerListener() {
      // 监听 modeler
      const bpmnjs = this.bpmnModeler;
      const outer = this;

      // 'shape.removed', 'connect.end', 'connect.move'
      const events = [  // 事件类型
        'shape.added',      // 新增一个shape之后触发;
        'shape.move.end',   // 移动完一个shape之后触发;
        'shape.removed',    // 删除一个shape之后触发
      ];

      events.forEach(function (event) {  // 用forEach给modeler上添加要绑定的事件
        outer.bpmnModeler.on(event, e => {
          var elementRegistry = bpmnjs.get('elementRegistry');  // 获取Shape信息
          // 理论上 e.element === elementRegistry.get(e.element.id)
          // e.element 和 elementRegistry.get(e.element.id)得到的结果是同样的，但是官方是推荐使用elementRegistry的方式.
          var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;

          //-------------------------------------调试区---------------------------------------------------------------------
          // 将元素信息打印出来，便于调试
          // 常用属性：id， type， businessObject

          console.log("e.element的内容", shape);
          console.log("id:", shape.id);
          console.log("type:", shape.type);
          console.log("businessObject:", shape.businessObject);

          /*
          var diagram_element =    // 这个就是e.element
          {
            id: "StartEvent_1y45yut",
            type: "bpmn:StartEvent",
            businessObject: {
              $type: "bpmn:StartEvent",
              id: "StartEvent_1y45yut",
              name: "开始"
            }
          }
          var BPMN_element = `<startEvent id="StartEvent_1y45yut" name="开始"></startEvent>`  // 这个是bpmn文件的xml格式
          */
          // 将 diagram_element和 BPMN_element 的一些属性关联起来靠的是 businessObject属性，他是一个对象
          // 可以在这个对象中添加一些特殊的属性，并且这些属性是可以直接插到BPMN_element上的




          //-------------------------------------调试区---------------------------------------------------------------------------

          if (event === 'shape.added') {
            console.log('新增了shape')
          } else if (event === 'shape.move.end') {
            console.log('移动了shape')
          } else if (event === 'shape.removed') {
            console.log('删除了shape')
          }
        })
      })
    },

    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        done(err, xml);
      })
    }
  },
  // 计算属性
  computed: {}
}
</script>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}

.canvas {
  width: 100%;
  height: 100%;
}

.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>