<template>
  <div class="containers" ref="content" tabindex="0">
    <div class="canvas" ref="canvas"></div>
    <properties-view v-if="bpmnModeler" :modeler="bpmnModeler"></properties-view>
    <ul class="buttons">
      <li>
        <a href="javascript:" id="file-upload" title="open BPMN diagram from local file system" class="active">
          <img src="../assets/icon_upload.png" alt="" style="width:22px; height: 22px">
          <input type="file" id="file-input" style="display:none;">
        </a>

      </li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="Download as BPMN 2.0 file">
          <img src="../assets/icon_download.png" alt="" style="width:22px; height: 22px">
        </a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="Download as SVG image">
          <img src="../assets/icon_picture.jpg" alt="" style="width:22px; height: 22px">
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler';  // 这个用来建模
import PropertiesView from './custom-properties-panel/PropertiesView';  // 自定义的 右侧属性栏 (框+内容)

import MRfieldDescriptor from '../descriptors/mrfield';  // 自定义的右侧扩展属性描述json
import MultiInstanceDescriptor from '../descriptors/MultiInstance';

import { xmlStr } from '../mock/xmlStr';   // 引入一个本地的xml字符串
import $ from 'jquery';

export default {
  name: 'PropertiesPanel',
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
      canvas: null,
      xmlStr: xmlStr,
      xmlStatus_Undo: [],
      xmlStatus_Redo: [],
      selectedElements: [],  // 当前选择的元素集合
      element: null,  // 当前点击的元素
      pressed_keys: new Set(),  // 按键去重
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
          MultiInstance: MultiInstanceDescriptor
        }
      });
      this.createNewDiagram();
    },

    async createNewDiagram() {
      // 将字符串转换成图显示出来
      try {
        await this.bpmnModeler.importXML(this.xmlStr);
        this.success();
      } catch (err) {
        console.log(err.message, err.warnings);
      }
    },

    success() {
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.addBpmnListener();     // 保存图片、bpmn文件用
      this.addEventBusListener();  // 监听element并绑定事件
      this.uploadXML();  // 导入XML文件
      this.addkeyboardListener();  // 加入键盘监听
    },

    uploadXML() {
      const outer = this;
      document.getElementById('file-upload').addEventListener('click', () => {
        document.getElementById('file-input').click();
      });

      document.getElementById('file-input').addEventListener('change', () => {
        const input = document.getElementById('file-input');
        const file = input.files[0];

        // 如果用户在上传文件的时候点了取消，即文件为空时，或者上传的不是bpmn文件，则直接返回
        if (!file || file.name.split('.')[1] !== 'bpmn') {
          alert("上传文件格式有误, 请上传xml格式的bpmn文件");
          return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
          const xml = reader.result;
          await outer.bpmnModeler.importXML(xml);
          outer.xmlStr = xml;
        };
      });
    },

    addkeyboardListener() {
      const outer = this;
      document.addEventListener('keydown', e => {
        e.preventDefault();  // 禁用浏览器的默认快捷键行为
      })

      const $canvas = $('.containers');
      $canvas.keydown(function (e) {  // 键盘按住时（不松起）
        outer.pressed_keys.add(e.key);
        outer.KeyboardShortcuts();
      });

      $canvas.keyup(function (e) {  // 键盘松开时
        outer.pressed_keys.delete(e.key);
      });
    },

    async KeyboardShortcuts() {
      const modeling = this.bpmnModeler.get('modeling');
      // console.log(this.pressed_keys);
      if (this.pressed_keys.has('Control')) {
        if (this.pressed_keys.has('Shift')) {
          if (this.pressed_keys.has('z') || this.pressed_keys.has('Z')) {
            if (this.xmlStatus_Redo.length == 0) return;
            let xml = this.xmlStatus_Redo.pop();  // 从Redo中取出需要重做的xml的状态
            await this.bpmnModeler.importXML(xml);
            this.xmlStatus_Undo.push(this.xmlStr);
            this.xmlStr = xml;  // 更新当前xml状态
            // 防止大小字母卡键
            this.pressed_keys.delete('z');
            this.pressed_keys.delete('Z');
            return;
          }
        } else if (this.pressed_keys.has('z') || this.pressed_keys.has('Z')) {
          if (this.xmlStatus_Undo.length == 0) return;
          let xml = this.xmlStatus_Undo.pop();  // 从Undo取出上一次xml的状态
          await this.bpmnModeler.importXML(xml);
          this.xmlStatus_Redo.push(this.xmlStr);  // 加入Redo的栈中
          this.xmlStr = xml;  // 更新当前xml状态
          // 防止大小字母卡键
          this.pressed_keys.delete('z');
          this.pressed_keys.delete('Z');
          return;
        }
      } else if (this.pressed_keys.has('Delete')) {
        modeling.removeElements(this.selectedElements);
        return;
      }
    },

    // 监听选中的element
    addEventBusListener() {
      this.bpmnModeler.on('selection.changed', e => {
        this.selectedElements = e.newSelection;  // 数组，可能有多个（Windows下按住Ctrl可以选多个元素）
        this.element = e.newSelection[0];  // 默认取第一个
      });
    },

    // 添加绑定事件
    async addBpmnListener() {
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram;  // 保存为xml的按钮
      const downloadSvgLink = this.$refs.saveSvg;  // 保存为svg的按钮

      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', async () => {
        const newXml = await this.saveDiagram();
        this.xmlStatus_Undo.push(this.xmlStr);  // 将old的xml状态压入栈中
        this.xmlStr = newXml;  // 更新当前xml的状态
        // console.log(xml);  // 将最新的xml信息打印出来
        this.setEncoded(downloadLink, 'diagram.bpmn', newXml);
        const svg = await this.saveSVG();
        this.setEncoded(downloadSvgLink, 'diagram.svg', svg);
      });
    },

    // 在saveDiagram和saveSVG中使用Promise而不是回调
    async saveDiagram() {
      // 这里获取到的就是最新的xml信息
      const { xml } = await this.bpmnModeler.saveXML({ format: true });
      return xml;
    },
    async saveSVG() {
      // 这里获取到的就是最新的svg信息
      const { svg } = await this.bpmnModeler.saveSVG({});
      return svg;
    },

    /**
     * 当图发生改变的时候会调用这个函数
     * @param { HTMLElement } link - 点击的按钮
     * @param { string } name - 保存的文件名字
     * @param { string } data - 图的xml
     */
    setEncoded(link, name, data) {
      const encodedData = encodeURIComponent(data);  // 把xml、svg转换为URI，下载要用到的
      // 下载图的具体操作,改变link的属性
      if (data) {
        link.className = 'active';  // className令link标签可点击
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;  // href令能下载
        link.download = name;  // download是下载的文件的名字
      }
    },
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

/* 画布聚焦时隐藏外面的框框 */
.containers:focus {
  outline: none;
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

.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}


.buttons li {
  display: inline-block;
  margin: 5px;
}

.buttons li a {
  color: #999;
  background: #eee;
  cursor: not-allowed;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}

.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
</style>