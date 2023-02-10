# bpmn-vue-sct ——Update Notes

> The latest update for bpmn-vue-sct

## Update Notes (Feb 4)

> 完成了需求2和需求3

### 需求2：

对于 **DataObjectReference 和 DataStoreReference**，提供**定义多个数据项（数量无限制）**的功能，点击“+”号可创建新的数据项，数据项名称由用户自定义（如 datafield1,datafield2…），保存模型时，所创建的数据项将被关联至对应的元素并同步保存.



### 需求3：

对于**消息收发任务**，需要提供与 2 类似的功能，点击“+”号可创建新的消息字段，消息字段名称由用户自定义（如 MField1, MField2…），，保存模型时，所创建的消息字段将被关联至对应的任务并同步保存。

## Update Notes (Feb 10)

> 完成了需求4

### 需求4：

对于消息收发任务，在 3 的基础上，再追加一个功能，与功能 2 类似。暂且将其称为“Add MessageRelation Field”，点击“+”号可增加新的数据域（名称由用户自定义，如 MRField1, MRField2,…）。各个 MRField 的内容,**可以从**拓展 2 中已创建的 **MField1~MFieldn 中选取其中若干个**（数量不限，即每个 MRField 可以包含多个数据项）,也可手动输入若干个数据项名称。保存要求同上。