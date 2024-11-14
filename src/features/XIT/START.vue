<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
import PrunButton from '@src/components/PrunButton.vue';
</script>

<template>
  <div :class="$style.container">
    <h1 :class="$style.title">Thank you for using Refined PrUn!</h1>
    <p>
      You can find a list of all of the XIT commands using
      <PrunLink inline command="XIT CMDS" />
    </p>
    <p>
      You can change settings using
      <PrunLink inline command="XIT SET" />
    </p>
    <p>
      For additional help, check
      <PrunLink inline command="XIT HELP" />
    </p>
    <p>
      Please select a feature set (you can change it later using
      <PrunLink inline command="XIT SET FEAT" />)
    </p>
    <div :class="$style.features">
      <PrunButton primary :class="$style.feature">
        <div :class="$style.featureTitle">
          <div :class="$style.title">BASIC</div>
        </div>
        <div :class="$style.featureDescription">Includes features to enhance the APEX UI</div>
      </PrunButton>
      <PrunButton primary :class="$style.feature">
        <div :class="$style.featureTitle">
          <div :class="$style.title">FULL</div>
          <div>(requires restart)</div>
        </div>
        <div :class="$style.featureDescription">
          Includes all Basic features plus additional UI refinements for experienced players
        </div>
      </PrunButton>
    </div>
  </div>
</template>

<style module>
.container {
  font-size: 12px;
  padding-left: 4px;
}

.title {
  font-weight: bold;
  display: block;
  font-size: 16px;
}

.features {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.feature {
  width: 49%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  text-transform: none;
}

.featureTitle {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.featureDescription {
  padding-top: 4px;
}
</style>
