<template>
  <div id="graphRender" ref="plotRef"></div>
  <div class="buttons" id="topright">
    <s-tooltip align="right">
      <s-icon-button
        slot="trigger"
        @click="emitter.emit('require-full-update', 'manual')"
      >
        <SIconRefresh class="spin" />
      </s-icon-button>
      {{ t("buttons.reset") }}
    </s-tooltip>
    <s-tooltip align="right" v-if="errorMsg !== undefined">
      <s-icon-button slot="trigger" style="color: var(--s-color-warning)">
        <SIconWarn class="bouncein" />
      </s-icon-button>
      <pre class="tooltipMsgPre">{{ errorMsg }}</pre>
    </s-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import SIconRefresh from "@/ui/icons/refresh.vue";
import SIconWarn from "@/ui/icons/warn.vue";

import { onMounted, onUnmounted, ref, watch, WatchHandle } from "vue";
import throttle from "lodash-es/throttle";
import type { FunctionPlotDatum } from "function-plot";
import { getFnType } from "../consts";

import { useProfile } from "@/states";
const profile = useProfile();

import emitter from "@/mitt";
const fullUpdateState = defineModel<boolean>({ required: true });

const plotRef = ref<HTMLDivElement>();
const errorMsg = ref<string | undefined>(undefined);

function findError(graphData: FunctionPlotDatum[]) {
  for (const [index, dataItem] of graphData.entries()) {
    const fnType = getFnType(dataItem.fnType);
    for (const input of fnType.inputs) if (!dataItem[input.value]) return index;
    for (const coord of fnType.coord ?? [])
      if (!dataItem[coord.value] && !coord.optional) return index;
  }
  return 0;
}

import { useElementSize } from "@vueuse/core";
const { width, height } = useElementSize(plotRef);

let unwatchHandler: WatchHandle | null = null;
const emit = defineEmits(["require-post-update"]);
import functionPlot from "function-plot";
onMounted(() => {
  const handleUpdate = throttle(() => {
    if (import.meta.env.DEV) console.log("graph update");
    const graphData = profile.getOriginalData();
    const flag = findError(graphData);
    if (flag) {
      errorMsg.value = `Invalid input in function ${flag + 1}`;
      return;
    }
    try {
      if (!plotRef.value) throw new Error("plotRef is null");
      functionPlot({
        target: plotRef.value,
        data: graphData,
        width: width.value,
        height: height.value,
        annotations: profile.getOriginalAnnotaion(),
        ...profile.getOriginalOptions(),
      });
      if (fullUpdateState.value) {
        fullUpdateState.value = false;
        emit("require-post-update", "once after error");
      } else errorMsg.value = undefined;
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      if (!fullUpdateState.value) emitter.emit("require-full-update", "error");
      errorMsg.value = (e as Error).message;
    }
  }, 250);
  unwatchHandler = watch([width, height, profile], handleUpdate, {
    immediate: true,
  });
});

onUnmounted(() => {
  if (unwatchHandler) unwatchHandler();
});
</script>

<style>
#graphRender {
  position: absolute;
  top: 10px;
  right: 10px;
  left: 10px;
  bottom: 10px;
  margin: auto;
  color: black;
  user-select: none;
  transition: filter 1ms;
}

:root {
  --graph-filter: invert(100%) hue-rotate(180deg) contrast(0.8) brightness(1.3);
}

@media (prefers-color-scheme: dark) {
  s-page.auto #graphRender {
    filter: var(--graph-filter);
  }
}
s-page.dark #graphRender {
  filter: var(--graph-filter);
}

.onresize #graphRender {
  left: 50%;
  right: unset;
  width: fit-content;
  transform: translateX(-50%);
}
.top-right-legend {
  display: none;
}

#topright {
  position: absolute;
  top: 25px;
  right: 25px;
  display: flex;
  flex-direction: column;
}

.tooltipMsgPre {
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.inner-tip {
  font-size: 18px;
  font-family: var(--font-mono);
}
#graphRender .annotations,
#graphRender .fn-text,
#graphRender .axis-label {
  font-size: 20px;
}

#graphRender .title {
  font-weight: bold;
}

s-icon.spin {
  animation: rotate var(--s-motion-duration-medium4)
    var(--s-motion-easing-emphasized);
}

s-icon.bouncein {
  animation: bouncein var(--s-motion-duration-medium4)
    var(--s-motion-easing-emphasized);
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bouncein {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
