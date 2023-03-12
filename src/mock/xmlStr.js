export var xmlStr = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:multi="http://multi" xmlns:mrfields="http://mrfields" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:color="http://www.omg.org/spec/BPMN/non-normative/color/1.0" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="11.5.0">
<process id="Process_1" isExecutable="false">
<startEvent id="Event_0ffkoli" name="Strat">
  <outgoing>Flow_07ynbka</outgoing>
  <messageEventDefinition id="MessageEventDefinition_171gaja" />
</startEvent>
<sequenceFlow id="Flow_07ynbka" sourceRef="Event_0ffkoli" targetRef="Activity_10kjkjd" />
<receiveTask id="Activity_10kjkjd" name="World Cup Final Four" multi:InstanceNumber="4" multi:EndCondition="Race" multi:ConditionNum="24" multi:ConditionTime="60" Team1="Argentina" Team2="France" Team3="Croatia" Team4="Morocco">
  <incoming>Flow_07ynbka</incoming>
  <outgoing>Flow_11q7bd5</outgoing>
  <multiInstanceLoopCharacteristics />
  <mrfields:mrfield_list mrfield1_name="Final" mrfield2_name="Third Place Match">
    <mrfields:mrfield1 Team1="Argentina" Team2="France" />
    <mrfields:mrfield2 Team3="Croatia" Team4="Morocco" />
  </mrfields:mrfield_list>
</receiveTask>
<sequenceFlow id="Flow_11q7bd5" sourceRef="Activity_10kjkjd" targetRef="Gateway_0d1qtlf" />
<exclusiveGateway id="Gateway_0d1qtlf">
  <incoming>Flow_11q7bd5</incoming>
</exclusiveGateway>
</process>
<bpmndi:BPMNDiagram id="BpmnDiagram_1">
<bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
  <bpmndi:BPMNShape id="Event_1sjis9j_di" bpmnElement="Event_0ffkoli">
    <omgdc:Bounds x="232" y="122" width="36" height="36" />
    <bpmndi:BPMNLabel>
      <omgdc:Bounds x="238" y="165" width="25" height="14" />
    </bpmndi:BPMNLabel>
  </bpmndi:BPMNShape>
  <bpmndi:BPMNShape id="Activity_131d1lf_di" bpmnElement="Activity_10kjkjd" bioc:stroke="#6b3c00" bioc:fill="#ffe2b6" color:background-color="#ffe2b6" color:border-color="#6b3c00">
    <omgdc:Bounds x="320" y="100" width="100" height="80" />
    <bpmndi:BPMNLabel />
  </bpmndi:BPMNShape>
  <bpmndi:BPMNShape id="Gateway_0qhkpme_di" bpmnElement="Gateway_0d1qtlf" isMarkerVisible="true">
    <omgdc:Bounds x="475" y="115" width="50" height="50" />
  </bpmndi:BPMNShape>
  <bpmndi:BPMNEdge id="Flow_07ynbka_di" bpmnElement="Flow_07ynbka">
    <omgdi:waypoint x="268" y="140" />
    <omgdi:waypoint x="320" y="140" />
  </bpmndi:BPMNEdge>
  <bpmndi:BPMNEdge id="Flow_11q7bd5_di" bpmnElement="Flow_11q7bd5">
    <omgdi:waypoint x="420" y="140" />
    <omgdi:waypoint x="475" y="140" />
  </bpmndi:BPMNEdge>
</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>
`
