<template>
<ElTable :data="trades">
  <ElTableColumn prop="tradeId" label="Trade ID"></ElTableColumn>
  <ElTableColumn prop="tradeName" label="Trade Name"></ElTableColumn>
  <ElTableColumn prop="tradeSymbol" label="Trade Symbol"></ElTableColumn>
  <ElTableColumn prop="currentPrice" label="Current Price"></ElTableColumn>
  <ElTableColumn prop="lastPrice" label="Last Price"></ElTableColumn>
  <ElTableColumn prop="traderName" label="Trader Name"></ElTableColumn>
  <ElTableColumn prop="trend" label="Trend"></ElTableColumn>
  <ElTableColumn prop="updateTime" label="Update Time"></ElTableColumn>
  <ElTableColumn prop="createTime" label="Create Time"></ElTableColumn>
  <ElTableColumn prop="tradeStatus" label="Trade Status"></ElTableColumn>
</ElTable>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, onMounted, Ref, computed } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { Trade } from '@/api/types';

export default defineComponent({
  components: {
    ElTable,
    ElTableColumn,
  },
  setup() {
    const trades:Ref<Trade[]> = ref([]);
    const ws = new WebSocket('ws://localhost:3000/mock/trades');

    onUnmounted(() => {
      ws.close();
    });

    ws.onmessage = (event) => {
      const data:Trade[] = JSON.parse(event.data);
      data.forEach((item) => {
        const existingIndex = trades.value.findIndex((d) => d.tradeId === item.tradeId);
        if (existingIndex > -1) {
          const lastPrice = trades.value[existingIndex].currentPrice
          let trend
          if (item.currentPrice > lastPrice) {
            trend = '↑';
          } else if (item.currentPrice < lastPrice) {
            trend = '↓';
          } else {
            trend = '–';
          }
          Object.assign(trades.value[existingIndex], { ...item, lastPrice, trend });
        } else {
          trades.value.push(item);
        }
      });
      console.log(trades.value.length)
    };
    const visibleData = computed(() => {
      const start = startIndex.value;
      const end = endIndex.value;
      const data = trades.value.slice(start, end);
      return data;
    });
    const rowSize = ref(36);

    const startIndex = ref(0);
    const endIndex = ref(0);

    const setIndex = () => {
      const container = document.querySelector('.el-table__body-wrapper');
      if (!container) return;

      const offset = container.scrollTop;
      const size = rowSize.value;
      const visibleHeight = container.clientHeight;

      startIndex.value = Math.floor(offset / size);
      endIndex.value = Math.ceil((offset + visibleHeight) / size);
    };
    onMounted(() => {
      trades.value = []; // your data source
      setIndex();
    });

    return {
      trades,
      visibleData,
      rowSize,
      startIndex,
      endIndex,
    };
  },
});
</script>
