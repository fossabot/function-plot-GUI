<template>
  <div id="graph" ref="shellRef">
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import SIconRefresh from "@/ui/icons/refresh.vue";
import SIconWarn from "@/ui/icons/warn.vue";

import { onMounted, onUnmounted, Ref, ref, watch, WatchHandle } from "vue";
import throttle from "lodash-es/throttle";
import type { FunctionPlotOptions } from "function-plot";

import { useProfile } from "@/states";
const profile = useProfile();

import emitter from "@/mitt";
const lastIsError = defineModel<boolean>({ required: true });

const plotRef = ref<HTMLDivElement>();
const errorMsg = ref<string | undefined>(undefined);

import { useElementSize } from "@vueuse/core";
const shellRef = ref<HTMLDivElement>();
const { width, height } = useElementSize(shellRef);

const emit = defineEmits(["require-post-update"]);
import functionPlot from "function-plot";

const waitForTruthy = (ref: Ref<any>) => {
  return new Promise((resolve) => {
    const revokeWatch = watch(
      ref,
      (newVal) => {
        if (newVal) {
          resolve(newVal);
          revokeWatch();
        }
      },
      { immediate: true }
    );
  });
};

const unwatchHandlers: WatchHandle[] = [];
onUnmounted(() => {
  unwatchHandlers.forEach((unwatch) => unwatch());
});

onMounted(async () => {
  while (!plotRef.value) await waitForTruthy(plotRef);
  while (!shellRef.value) await waitForTruthy(plotRef);
  const handleUpdate = throttle(() => {
    const target = plotRef.value;

    try {
      if (!target) throw new Error("plotRef is null");
      const data = profile.getPublicDatum();
      const annotations = profile.getPublicAnnotations();
      const options = profile.getPublicOptions();
      const fullOptions: FunctionPlotOptions = {
        target,
        data,
        annotations,
        width: width.value - 20,
        height: height.value - 20,
        ...options,
      };
      console.log("Call functionPlot", fullOptions);
      functionPlot(fullOptions);
      if (lastIsError.value) {
        lastIsError.value = false;
        emit("require-post-update", "once after error");
      } else errorMsg.value = undefined;
    } catch (e) {
      console.error(e);
      lastIsError.value = true;
      errorMsg.value = (e as Error).message;
    }
  }, 200);

  unwatchHandlers.push(watch(profile, handleUpdate, { immediate: true }));

  let lastWidth = shellRef.value.clientWidth,
    lastHeight = shellRef.value.clientHeight;
  const isClose = (num1: number, num2: number, threshold: number = 2) =>
    Math.abs(num1 - num2) < threshold;
  unwatchHandlers.push(
    watch([width, height], ([newWidth, newHeight]) => {
      if (!newWidth || !newHeight) return;
      newWidth = Math.round(newWidth);
      newHeight = Math.round(newHeight);
      if (isClose(newWidth, lastWidth) && isClose(newHeight, lastHeight))
        return;
      [lastWidth, lastHeight] = [newWidth, newHeight];
      handleUpdate();
    })
  );
});
</script>

<style>
#graphRender {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: fit-content;
  height: fit-content;
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
