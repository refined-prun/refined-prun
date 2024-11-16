<script setup lang="ts">
import { showBuffer } from '@src/infrastructure/prun-ui/buffers.js';
</script>

<template>
  <div :class="C.Window.window" style="left: 100px; top: 100px; z-index: 999">
    <div :class="C.Window.header" />
    <div
      :class="C.Window.body"
      style="
        position: relative;
        user-select: auto;
        width: 400px;
        height: 200px;
        box-sizing: border-box;
        flex-shrink: 0;
      ">
      <div :class="C.Tile.tile">
        <div :class="C.TileFrame.frame">
          <div
            :class="[C.TileFrame.header, C.fonts.fontRegular, C.type.typeRegular]"
            style="cursor: default">
            <div :class="[C.TileFrame.title, C.fonts.fontSmallHeaders]">
              REFINED PRUN MIGRATION GUIDE
            </div>
          </div>
          <div :class="[C.TileFrame.body, C.fonts.fontRegular, C.type.typeRegular]">
            <div :class="C.TileFrame.anchor">
              <div style="width: 100%; height: 100%; padding: 10px">
                <p>PMMG is currently running. Please follow the migration guide:</p>
                <ol style="padding-inline: 15px; line-height: 1.5">
                  <li>
                    Export all user data from
                    <span :class="C.Link.link" @click="showBuffer('XIT SET')">XIT SET</span>
                    (scroll to the very bottom).
                  </li>
                  <li>Open the Extensions page in your browser.</li>
                  <li>Disable the PMMG Extended extension.</li>
                  <li>
                    Reload the game, and, after selecting a preferred feature set, import PMMG files
                    using XIT SET PMMG.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
