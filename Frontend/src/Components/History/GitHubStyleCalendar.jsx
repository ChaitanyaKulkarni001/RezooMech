import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";

import "react-calendar-heatmap/dist/styles.css";

export default function GitHubStyleCalendar({ theme }) {
  // Generate dummy activity data with only 10-12 green blocks
  const generateLimitedActivityData = () => {
    const data = [];
    const today = new Date();
    
    // Define the two active dates
    const activeDates = new Set(["2025-03-28", "2025-03-29"]);
  
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  
      data.push({
        date: formattedDate,
        count: activeDates.has(formattedDate) ? Math.floor(Math.random() * 2) + 1 : 0, // Activity only on 28-29 March 2025
      });
    }
    
    return data;
  };
  const activityData = generateLimitedActivityData();
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <h2
        style={{
          color: theme === "dim" ? "#000" : "#fff",
          marginBottom: "1rem",
        }}
      >
        Activity Heatmap
      </h2>

      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={activityData}
        rectSize={10}
        gutterSize={2}
        showWeekdayLabels
        weekdayLabels={["", "Mon", "", "Wed", "", "Fri", ""]}
        showMonthLabels
        monthLabels={[
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ]}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date || value.count === 0) {
            return { "data-tip": "No activity" };
          }
          return {
            "data-tip": `${value.count} activity${value.count > 1 ? "ies" : ""} on ${value.date}`,
          };
        }}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return "color-empty";
          } else if (value.count <= 3) {
            return "color-scale-1";
          } else if (value.count <= 6) {
            return "color-scale-2";
          } else {
            return "color-scale-3";
          }
        }}
      />

      <Tooltip effect="solid" place="top" />

      <style>
        {`
          .react-calendar-heatmap text {
            fill: #767676;
            font-size: 10px;
          }
          .color-empty {
            fill: #ebedf0;
          }
          .color-scale-1 {
            fill: #c6e48b;
          }
          .color-scale-2 {
            fill: #7bc96f;
          }
          .color-scale-3 {
            fill: #239a3b;
          }
          .react-calendar-heatmap rect {
            rx: 2px;
            ry: 2px;
            shape-rendering: geometricPrecision;
          }
        `}
      </style>
    </div>
  );
}
