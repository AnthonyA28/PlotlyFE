module.exports = {

    log10: function (y) {
      return Math.log(y) / Math.log(10);
    },

    transpose: function (a) {
      var w = a.length || 0;
      var h = a[0] instanceof Array ? a[0].length : 0;
      if(h === 0 || w === 0) { return []; }
      var i, j, t = [];
      for(i=0; i<h; i++) {
        t[i] = [];
        for(j=0; j<w; j++) {
          t[i][j] = a[j][i];
        }
      }
      return t;
    },

    removeOptions: function (selectElement) {
       var i, L = selectElement.options.length - 1;
       for(i = L; i >= 0; i--) {
          selectElement.remove(i);
       }
    }

};