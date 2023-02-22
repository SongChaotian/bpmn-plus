# bpmn-vue-sct ——Update Notes

> The latest update for bpmn-vue-sct



## Update Notes (Feb 4)

> 完成了需求2和需求3

### 需求2：

对于 **DataObjectReference 和 DataStoreReference**，提供**定义多个数据项（数量无限制）**的功能，可参考如下右图。图中，点击“+”号可创建新的数据项，数据项名称由用户自定义（如 datafield1,datafield2…），保存模型时，所创建的数据项将被关联至对应的元素并同步保存。

![需求2](https://github.com/SongChaotian/bpmn-vue-sct/blob/main/screenshoot/需求2.png)

### 需求3：

对于**消息收发任务**，需要提供与 2 类似的功能，可参考如下右图。图中点击“+”号可创建新的消息字段，消息字段名称由用户自定义（如 MField1, MField2…），保存模型时，所创建的消息字段将被关联至对应的任务并同步保存。

![需求3](https://github.com/SongChaotian/bpmn-vue-sct/blob/main/screenshoot/需求3.png)

------



## Update Notes (Feb 10)

> 完成了需求4

### 需求4：

对于消息收发任务，在 3 的基础上，再追加一个功能，与功能 2 类似。暂且将其称为“Add MessageRelation Field”，点击“+”号可增加新的数据域（名称由用户自定义，如 MRField1, MRField2,…）。各个 MRField 的内容,**可以从**拓展 2 中已创建的 **MField1~MFieldn 中选取其中若干个**（数量不限，即每个 MRField 可以包含多个数据项）,也可手动输入若干个数据项名称。保存要求同上。

------



## Update Notes (Feb 16)

> 完成了需求5，并修改了之前原先设置颜色的代码，增加了提前获取颜色在右侧属性栏的功能

### 需求5：

对于带有多实例标志（三横杠或三竖杠）的元素（多实例池、多实例活动、多实例子流程等，如下图），**增加一个属性**，如 InstanceNumber，**标识该元素的多实例数量**。此属性的值可由用户填写，**提供一个默认值**（如 None），表示实例数无法确定。拓展的此属性最好能在图形上显示，保存要求同上。

![需求5](https://github.com/SongChaotian/bpmn-vue-sct/blob/main/screenshoot/需求5.png)

------



## Update Notes (Feb 22)

> 完成了需求6，并修改了之前存在的bug：在修改、删除datafields的时候会因为同步更新、同步删除等操作去访问mrfield_list，因为之前没有做mrfield_list的判断会导致当不存在mrfield_list时访问错误，修复的措施是在同步更新、删除之前判断是否存在mrfield_list

### 需求6：

对于（并行和串行）多实例接收任务，**增加一个属性**，如 EndCondition，**标识该任务结束的条件**，此属性提供三个选项：MessageNum(数量)、Time(时间)、Race(竞赛)：

[1] 用户选择 MessageNum 时，提供一个字段（如 **ConditionNum**，表示**接收到此数量的消息时任务结束**），该字段**默认值**与该接收任务的 **InstanceNumber** 相同，也**可由用户手动输入**。**ConditionNum 最好能显示在图形上。**

[2] 用户选择 Time 时，提供一个新的属性（如 **ConditionTime**，表示**在经过指定时间后结束此任务）。**该属性值的设定，由用户完成，但要提供类似时钟时间设定的基础选择页面。用户选择此选项时，最好能在对应元素图像上显示一个**计时器图标**。

[3] 用户选择 Race 时，允许用户同时设置 ConditionTime 和 ConditionNum。图形上最好能有一定的信息显示，并与[1],[2]区分。

模型保存时，用户对 EndCondition 的选择需要被显式记录，对应的具体的结束条件

（ConditionNum 和 ConditionTime）也需被显式记录。

![需求6](https://github.com/SongChaotian/bpmn-vue-sct/blob/main/screenshoot/需求6.png)

