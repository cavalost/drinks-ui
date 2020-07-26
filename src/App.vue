<template>
  <div id="app">
    <div id="nav">
      <img
        class="align-content-center"
        alt="Cocktail"
        src="./assets/cocktail-icon.png"
      />
      <img alt="Cofee" src="./assets/coffee-icon.png" />
      <img alt="Comment" src="./assets/comment-green.png" />
      <h1 class="vue-title mt-5">EVENTS</h1>
      <data-table
        :lines="lines"
        :start-date="startDate"
        :end-date="endDate"
        @changeDates="changeDates"
      />
    </div>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable";

export default {
  name: "app",
  components: {
    DataTable
  },
  data() {
    return {
      lines: [],
      startDate: "",
      endDate: ""
    };
  },
  async created() {
    const { data } = await this.axios.get(
      `${process.env.VUE_APP_DRINKS_API}/api/events`
    );
    this.lines = data;
  },
  methods: {
    changeDates({ startDate, endDate }) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.lines = [...this.lines];
    }
  }
};
</script>

<style>
#app {
  background: #e5cb90;
}
</style>
