<script setup lang="ts">
import PrunLink from '@src/components/PrunLink.vue';
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>I want to...</th>
        <th>Command</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Change Refined PrUn settings.</td>
        <td>
          <PrunLink command="XIT SET" />
        </td>
      </tr>
      <tr>
        <td>Change the feature set to Basic/Full.</td>
        <td>
          <PrunLink command="XIT SET FEAT" />
        </td>
      </tr>
      <tr>
        <td>Disable some Refined PrUn feature.</td>
        <td>
          <PrunLink command="XIT SET FEAT" />
        </td>
      </tr>
      <tr>
        <td>Find out which XIT commands are available.</td>
        <td>
          <PrunLink command="XIT CMDS" />
        </td>
      </tr>
      <tr>
        <td>Import PMMG settings.</td>
        <td>
          <PrunLink command="XIT SET PMMG" />
        </td>
      </tr>
      <tr>
        <td>Get a random corgi gif.</td>
        <td>
          <PrunLink command="XIT GIF CORGI" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
