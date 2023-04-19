const customElements = [  // 自定义元素的类型
    'bpmn:Task',
]

const customConfig = { // 自定义元素的配置
    'bpmn:Task': {
        'ImageTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnUJJ.png',
        },
        'IndustrialRobotsTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnYoF.png',
        },
        'SensorTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9Fn0Q1.png',
        },
        'AudioTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnksP.png',
        },
        'CollectTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnlMq.png',
        },
        'PrivacyTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FndzR.png',
        },
        'IntelligentTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnJdU.png',
        },
        'TransportTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnBsx.png',
        },
        'DeliveryTask': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnNi4.png',
        },
        'DataGateWay': {
            'url': 'https://s1.ax1x.com/2023/04/19/p9FnaW9.png',
        },
        'attr': { x: 0, y: 0, width: 48, height: 48 }
    },
}

const hasLabelElements = [  // 一开始就有label标签的元素类型，不需要重新渲染
    'bpmn:StartEvent',
    'bpmn:EndEvent'
]

export {
    customElements,
    customConfig,
    hasLabelElements
}