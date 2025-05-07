<template>
  <s-text-field class="input monospace" label="颜色" v-model.trim="color">
    <s-popup slot="end" align="right" ref="popup" @show="pickerKey = Symbol()">
      <s-icon-button
        slot="trigger"
        class="colorpicker-button"
        :style="{ color }"
      >
        <SIconPalette />
      </s-icon-button>
      <ColorPicker
        :color="processedColor"
        sucker-hide
        @changeColor="changeColor"
        :key="pickerKey"
      />
    </s-popup>
  </s-text-field>
</template>

<script lang="ts" setup>
import { nameToHex } from "./coloUtils";
import SIconPalette from "@/ui/icons/palette.vue";
import { computed, ref } from "vue";
import { ColorPicker } from "vue-color-kit";

const color = defineModel<string>({ required: true });

interface ColorPickerArgs {
  rgba: { r: number; g: number; b: number; a: number };
  hex: string;
  hsv: { h: number; s: number; v: number };
}

const processedColor = computed(() => {
  const colorstr = color.value.trim() || "#4682B4";
  if (colorstr.startsWith("#") || colorstr.startsWith("rgb")) return colorstr;
  return nameToHex(colorstr) ?? colorstr;
});

function changeColor(newColor: ColorPickerArgs) {
  if (color.value.startsWith("rgb")) {
    const { r, g, b, a } = newColor.rgba;
    if (a < 1) color.value = `rgba(${r}, ${g}, ${b}, ${a})`;
    else color.value = `rgb(${r}, ${g}, ${b})`;
    return;
  }
  let { hex } = newColor;
  if (newColor.rgba.a < 1) {
    hex =
      hex +
      Math.round(newColor.rgba.a * 255)
        .toString(16)
        .toUpperCase()
        .padStart(2, "0");
  }
  color.value = hex;
}

const pickerKey = ref(Symbol());
</script>

<style lang="scss">
.colorpicker-button {
  margin-right: 4px;
  margin-left: calc(
    var(--text-field-border-radius) - var(--text-field-padding-right) + 4px
  );
}

.hu-color-picker {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  --border-radius: 3px;
  font-family: var(--font-base);
  canvas {
    vertical-align: top;
    border-radius: var(--border-radius);
  }
  .color-set {
    display: flex;
    justify-content: space-between;
  }
  .color-show {
    display: flex;
  }

  .saturation {
    position: relative;
    .slide {
      position: absolute;
      left: 100px;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid #fff;
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
  }

  .color-type {
    display: flex;
    font-size: 12px;
    .name {
      width: 60px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--s-color-on-surface-variant);
      background: var(--s-color-surface-container-highest);
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
    }
    .value {
      flex: 1;
      height: 30px;
      min-width: 100px;
      padding: 0 12px;
      border: 0;
      color: var(--s-color-on-surface);
      background: var(--s-color-surface-container-high);
      box-sizing: border-box;
      caret-color: var(--s-color-primary);
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
      transition: box-shadow 0.2s;
      &:focus {
        box-shadow: 0 0 0 1.5px var(--s-color-primary) inset;
      }
    }
  }

  .color-alpha,
  .hue {
    position: relative;
    .slide {
      position: absolute;
      left: 0;
      top: 100px;
      width: 100%;
      height: 4px;
      background: #fff;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
      pointer-events: none;
    }
  }

  .colors {
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 5px;
    .item {
      position: relative;
      width: 16px;
      height: 16px;
      border-radius: 3px;
      box-sizing: border-box;
      vertical-align: top;
      display: inline-block;
      transition: all 0.1s;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
      .alpha {
        height: 100%;
        border-radius: 4px;
      }
      .color {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
  }
}
</style>
