<template lang="pug">
Sider#stepSider(hide-trigger :style="{background: '#fff', padding:'20px 20px', height: '100vh'}"  type="flex" justify="center" )
    Steps(:current='currentStep', direction='vertical'  style="-webkit-app-region: no-drag")
        Step(v-for="step in steps" v-bind:key="step.id" v-bind:title="step.title" v-bind:content="step.content")
</template>
<script>
export default {
    props: ['steps', 'currentStep'],
}
</script>
<style>
    #stepSider{
        border-right: 1px solid rgb(209, 209, 209);
        z-index: 4;
    }
</style>
