sap.ui.define([], function () {
    "use strict";
  
    return {
      toLocaleNumber(value) {
        if (!value) {
          return "";
        }
  
        if (typeof value === "string") {
          value = Number(value);
        }
  
        return value.toLocaleString();
      },
      msToTime: function (ms) {
        var minutes = Math.floor((ms / (1000 * 60)) % 60),
          hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
  
        return hours + ":" + minutes;
      },
      formatDate(YYYYMMDDHHMM) {
        var year = YYYYMMDDHHMM.substring(0, 4);
        var month = YYYYMMDDHHMM.substring(4, 6);
        var day = YYYYMMDDHHMM.substring(6, 8);
        var hour = YYYYMMDDHHMM.substring(8, 10);
        var minute = YYYYMMDDHHMM.substring(10, 12);
        var date = `${year}-${month}-${day}`;
        if (hour !== "" || minute !== "") {
          date += ` ${hour}:${minute}`;
        }
  
        return date;
      },
    };
  });
  