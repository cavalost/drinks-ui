<template>
  <div class="container">
    <b-modal size="xl" centered hide-header hide-footer id="event-modal">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">
            <b-row class="mb-1 text-left"> Date: {{ event.time }} </b-row>
            <b-row class="mb-1 text-left">
              Location: {{ event.location.address }}
            </b-row>
            <b-row class="mb-1 text-left">
              Name: {{ event.location.name }}
            </b-row>
            <b-row class="mb-1 text-left">
              Creator:
              <b-img
                class="ml-2 mr-2"
                :src="event.creator.avatarUrl"
                :alt="event.creator.name"
                fluid
                rounded="circle"
                height="35px"
                width="35px"
                @error="imgUrlAlt"
              ></b-img
              >{{ event.creator.name }}
            </b-row>
            <b-row class="mb-1 text-left">
              Guests:
            </b-row>

            <b-row
              :key="guest.name"
              v-for="guest in event.guests"
              class="mb-1 text-left"
            >
              <b-img
                class="mr-2"
                :src="guest.avatarUrl"
                :alt="guest.name"
                fluid
                rounded="circle"
                height="35px"
                width="35px"
                @error="imgUrlAlt"
              ></b-img
              >{{ guest.name }}
            </b-row>
          </b-col>
          <b-col cols="">
            <GmapMap
              :center="{
                lat: event.location.latitude,
                lng: event.location.longitude
              }"
              :zoom="18"
              style="width: 500px; height: 300px"
            >
              <GmapMarker
                :position="{
                  lat: event.location.latitude,
                  lng: event.location.longitude
                }"
                :clickable="true"
                :draggable="true"
              />
            </GmapMap>
          </b-col>
        </b-row>

        <b-row class="mb-1 text-left">
          Comments:
        </b-row>

        <b-row
          :key="comment.timestamp"
          v-for="comment in event.comments"
          class="mb-1 text-left"
        >
          <b-img
            class="mr-2"
            :src="comment.user.avatarUrl"
            :alt="comment.user.name"
            fluid
            rounded="circle"
            height="35px"
            width="35px"
            @error="imgUrlAlt"
          ></b-img
          >{{ comment.user.name }} wrote at: {{ comment.timestamp }}
          <br />
          {{ comment.message }}
        </b-row>
      </b-container>
    </b-modal>
    <v-client-table
      :data="tableData"
      :columns="columns"
      :options="options"
      thead-class="greenColor"
      @row-click="onRowClick"
    >
      <template slot="date" slot-scope="{ row }">
        <span v-text="convertTime(row.time)"></span>
      </template>

      <template slot="image" slot-scope="{ row }">
        <b-img
          class="mr-2"
          :src="row.creator.avatarUrl"
          :alt="row.creator.name"
          fluid
          rounded="circle"
          height="35px"
          width="35px"
          @error="imgUrlAlt"
        ></b-img
        >{{ row.creator.name }}
      </template>

      <div slot="filter__date">
        <b-form-datepicker
          size="sm"
          v-model="startDate"
          placeholder="Start date"
          @input="filterDate()"
        />
      </div>
      <div slot="filter__image">
        <b-form-datepicker
          size="sm"
          v-model="endDate"
          placeholder="End date"
          @input="filterDate()"
        />
      </div>
    </v-client-table>
  </div>
</template>

<script>
import { Event } from "vue-tables-2";
import moment from "moment";
import defaultImage from "../assets/unknown.png";
export default {
  props: {
    lines: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      event: { location: {}, guests: [], comments: [], creator: {} },
      startDate: "",
      endDate: "",
      columns: ["title", "date", "image", "location.address"],
      tableData: [],
      options: {
        headings: {
          title: "Event name",
          date: "Date",
          image: "Creator",
          "location.address": "Address"
        },
        filterByColumn: true,
        sortable: ["title", "date", "location.address"],
        filterable: ["title", "location.address"],
        customFilters: [
          {
            name: "filter_date",
            callback(row, { startDate, endDate }) {
              console.log(row);
              if (!startDate.isValid() && !endDate.isValid()) {
                return true;
              } else {
                const rowDate = moment(row.time);
                if (startDate.isValid() && endDate.isValid()) {
                  return rowDate >= startDate && rowDate <= endDate;
                } else if (startDate.isValid() && !endDate.isValid()) {
                  return rowDate >= startDate;
                } else {
                  return rowDate <= endDate;
                }
              }
            }
          }
        ]
      }
    };
  },
  watch: {
    lines() {
      this.tableData = this.lines;
    }
  },
  methods: {
    async onRowClick(event) {
      const { data } = await this.axios.get(
        `${process.env.VUE_APP_DRINKS_API}/api/events/${event.row.id}`
      );
      this.event = data;
      this.$bvModal.show("event-modal");
    },
    filterDate() {
      const startDate = moment(this.startDate, "YYYY-MM-DD", true);
      const endDate = moment(this.endDate, "YYYY-MM-DD", true);
      if (
        (startDate.isValid() &&
          ((endDate.isValid() && endDate >= startDate) || !this.endDate)) ||
        (!this.startDate && (endDate.isValid() || !this.endDate))
      ) {
        Event.$emit("vue-tables.filter::filter_date", { startDate, endDate });
        this.$emit("changeDates", {
          startDate: this.startDate,
          endDate: this.endDate
        });
      }
    },
    imgUrlAlt(event) {
      event.target.src = defaultImage;
    },
    convertTime(date) {
      return moment(date).format("YYYY-MM-DD hh:mm");
    }
  }
};
</script>

<style>
.VuePagination {
  text-align: center;
}

.vue-title {
  text-align: center;
  margin-bottom: 10px;
}

.vue-pagination-ad {
  text-align: center;
}

.glyphicon.glyphicon-eye-open {
  width: 16px;
  display: block;
  margin: 0 auto;
}

th:nth-child(3) {
  text-align: center;
}

.VueTables__sortable {
  text-align: center;
  cursor: pointer;
}

.VueTables__sort-icon {
  margin-left: 10px;
}

.VueTables__child-row-toggler {
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: block;
  margin: auto;
  text-align: center;
}

.VueTables__date-filter {
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
}

.VueTables__filter-placeholder {
  color: #aaa;
}

.VueTables__list-filter {
  width: 120px;
}

.greenColor,
.table thead th {
  background-color: #d9b159;
}
</style>
