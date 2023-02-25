export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0suqdye" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="11.4.1">
  <bpmn:process id="Process_02z49kc" isExecutable="false">
    <bpmn:startEvent id="StartEvent_12yit9y" name="start">
      <bpmn:outgoing>Flow_1jd3j3f</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1m4bgmy" name="Task">
      <bpmn:incoming>Flow_1jd3j3f</bpmn:incoming>
      <bpmn:outgoing>Flow_06250rv</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1jd3j3f" sourceRef="StartEvent_12yit9y" targetRef="Activity_1m4bgmy" />
    <bpmn:exclusiveGateway id="Gateway_0b060eg" name="if what?">
      <bpmn:incoming>Flow_06250rv</bpmn:incoming>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_06250rv" sourceRef="Activity_1m4bgmy" targetRef="Gateway_0b060eg" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_02z49kc">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_12yit9y">
        <dc:Bounds x="156" y="82" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="163" y="125" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1m4bgmy_di" bpmnElement="Activity_1m4bgmy">
        <dc:Bounds x="250" y="60" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_0b060eg_di" bpmnElement="Gateway_0b060eg" isMarkerVisible="true">
        <dc:Bounds x="415" y="75" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="425" y="132" width="30" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1jd3j3f_di" bpmnElement="Flow_1jd3j3f">
        <di:waypoint x="192" y="100" />
        <di:waypoint x="250" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06250rv_di" bpmnElement="Flow_06250rv">
        <di:waypoint x="350" y="100" />
        <di:waypoint x="415" y="100" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
