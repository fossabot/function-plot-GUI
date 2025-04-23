import { createI18n } from "vue-i18n";
export default createI18n({
  locale: "zh-CN",
  messages: {
    "zh-CN": {
      buttons: { add: "添加", import: "导入", raw: "原始数据" },
      graphType: { interval: "默认", polyline: "多段线", scatter: "散点" },
      fnType: {
        linear: "一般",
        implicit: "隐函数",
        parametric: "参数方程",
        polar: "极坐标",
        points: "点集",
        vector: "向量",
      },
      inputs: {
        fn: "函数",
        range: "范围",
        color: "颜色",
        colorPlaceholder: "RGB / HEX / 颜色名称",
        nSamples: "采样数",
        nSamplesPlaceholder: "默认值为宽度",
        closed: "闭合并填充",
        vector: "向量",
        vectorValue: "向量大小",
        vectorOffset: "起点坐标",
      },
    },
    "en-US": {},
  },
});
