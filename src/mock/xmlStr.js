export var xmlStr = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="10.3.0">
  
<collaboration id="Collaboration_1bwzdtx">
    <participant id="Participant_0a5bbvl" name="多实例流程" processRef="Process_1">
      <participantMultiplicity />
    </participant>
</collaboration>

<process id="Process_1" isExecutable="false">

    <dataStoreReference id="sct20221219" name="世界杯十六强" Team1="法国" Team2="阿根廷" Team3="摩洛哥" Team4="克罗地亚" Team5="英格兰" Team6="葡萄牙" Team7="巴西" Team8="荷兰" Team9="美国" Team10="澳大利亚" Team11="日本" Team12="韩国" Team13="塞内加尔" Team14="波兰" Team15="西班牙" Team16="瑞士">
        <documentation>78</documentation>
    </dataStoreReference>

    <dataObjectReference id="sct20230203" name="物联网一班" boy1="宋超田" boy2="解一博" boy3="张荣林">
        <documentation>56</documentation>
    </dataObjectReference>

    <sendTask id="send20230204" name="世界杯八强" Team1="阿根廷" Team2="法国" Team3="克罗地亚" Team4="摩洛哥" Team5="荷兰" Team6="英格兰" Team7="巴西" Team8="葡萄牙">
        <mrfields:mrfield_list mrfield1_name="group1" mrfield2_name="group2" mrfield3_name="group3" mrfield4_name="group4">   
          <mrfields:mrfield1 Team1="阿根廷" Team2="法国" /> 
          <mrfields:mrfield2 Team3="克罗地亚" Team4="摩洛哥"/> 
          <mrfields:mrfield3 Team5="荷兰" Team6="英格兰"/> 
          <mrfields:mrfield4 Team7="巴西" Team8="葡萄牙"/> 
        </mrfields:mrfield_list>
    </sendTask>

    <receiveTask id="rec20230204" name="世界杯四强" Team1="阿根廷" Team2="法国" Team3="克罗地亚" Team4="摩洛哥">
      <mrfields:mrfield_list mrfield1_name="group1" mrfield2_name="group2" mrfield3_name="group3">   
        <mrfields:mrfield1 Team1="阿根廷" Team2="法国" /> 
        <mrfields:mrfield2 Team3="克罗地亚" Team4="摩洛哥"/> 
        <mrfields:mrfield3 Team2="法国" Team3="克罗地亚"/> 
      </mrfields:mrfield_list>
    </receiveTask>

    <sendTask id="MultiSend20230222" name="并行多实例" multi:InstanceNumber="5" multi:EndCondition="Race" multi:ConditionNum="3" multi:ConditionTime="60">
        <multiInstanceLoopCharacteristics />
    </sendTask>

    <receiveTask id="MultiRec20230222" name="串行多实例" multi:EndCondition="Time" multi:ConditionTime="30">
        <multiInstanceLoopCharacteristics isSequential="true" />
    </receiveTask>

   
    <subProcess id="Activity_0tutjxc" name="串行多实例子流程">
        <multiInstanceLoopCharacteristics isSequential="true" />
        <startEvent id="Event_0p76utx" /> 
    </subProcess>

    <startEvent id="StartEvent_1rzkxhm" name="开始节点">
        <outgoing>SequenceFlow_1gtr5rd</outgoing>
    </startEvent>
    
    <intermediateThrowEvent id="IntermediateThrowEvent_1hmq2vq">
        <incoming>SequenceFlow_1gtr5rd</incoming>
        <outgoing>SequenceFlow_071vzw4</outgoing>
    </intermediateThrowEvent>
    
    <sequenceFlow id="SequenceFlow_1gtr5rd" name="F00&#62;BAR?" sourceRef="StartEvent_1rzkxhm" targetRef="IntermediateThrowEvent_1hmq2vq" />
    
    <endEvent id="EndEvent_0ikieqn">
      <incoming>SequenceFlow_071vzw4</incoming>
    </endEvent>
    
    <sequenceFlow id="SequenceFlow_071vzw4" sourceRef="IntermediateThrowEvent_1hmq2vq" targetRef="EndEvent_0ikieqn" />

</process>

<bpmndi:BPMNDiagram id="BpmnDiagram_1">
<bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_1bwzdtx">
  
 <bpmndi:BPMNShape id="sct20221219_di" bpmnElement="sct20221219" bioc:stroke="#0000ff" bioc:fill="none">
      <omgdc:Bounds x="325" y="85" width="50" height="50" />
      <bpmndi:BPMNLabel>
          <omgdc:Bounds x="317" y="143" width="67" height="14" />
        </bpmndi:BPMNLabel>
  </bpmndi:BPMNShape>

<bpmndi:BPMNShape id="Participant_0a5bbvl_di" bpmnElement="Participant_0a5bbvl" isHorizontal="true" isExpanded="true">
    <omgdc:Bounds x="160" y="59" width="1270" height="739" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="sct20230203_di" bpmnElement="sct20230203" bioc:stroke="#ff0000" bioc:fill="none">
  <omgdc:Bounds x="332" y="195" width="36" height="50" />
    <bpmndi:BPMNLabel>
    <omgdc:Bounds x="322" y="253" width="56" height="14" />
    </bpmndi:BPMNLabel>
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="send20230204_di" bpmnElement="send20230204">
    <omgdc:Bounds x="540" y="80" width="100" height="80" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="rec20230204di" bpmnElement="rec20230204">
    <omgdc:Bounds x="540" y="190" width="100" height="80" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="BPMNShape_1muxk7q" bpmnElement="MultiSend20230222">
    <omgdc:Bounds x="700" y="180" width="100" height="80" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="BPMNShape_159v4bn" bpmnElement="MultiRec20230222">
    <omgdc:Bounds x="700" y="300" width="100" height="80" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="Activity_0tutjxc_di" bpmnElement="Activity_0tutjxc" isExpanded="true">
    <omgdc:Bounds x="560" y="450" width="350" height="200" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="Event_0p76utx_di" bpmnElement="Event_0p76utx">
    <omgdc:Bounds x="582" y="532" width="36" height="36" />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="StartEvent_1rzkxhm_di" bpmnElement="StartEvent_1rzkxhm">
    <omgdc:Bounds x="238" y="422" width="36" height="36" />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNShape id="IntermediateThrowEvent_1hmq2vq_di" bpmnElement="IntermediateThrowEvent_1hmq2vq">
    <omgdc:Bounds x="362" y="422" width="36" height="36" />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNEdge id="SequenceFlow_1gtr5rd_di" bpmnElement="SequenceFlow_1gtr5rd">
    <di:waypoint x="274" y="440" />
    <di:waypoint x="362" y="440" />
    <bpmndi:BPMNLabel>
      <omgdc:Bounds x="291" y="422" width="55" height="14" />
    </bpmndi:BPMNLabel>
  </bpmndi:BPMNEdge>

  <bpmndi:BPMNShape id="EndEvent_0ikieqn_di" bpmnElement="EndEvent_0ikieqn">
    <omgdc:Bounds x="362" y="522" width="36" height="36" />
  </bpmndi:BPMNShape>

  <bpmndi:BPMNEdge id="SequenceFlow_071vzw4_di" bpmnElement="SequenceFlow_071vzw4">
    <di:waypoint x="380" y="458" />
    <di:waypoint x="380" y="522" />
  </bpmndi:BPMNEdge>



</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>`
