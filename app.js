$(document).ready(function () {
	var AppView =	Backbone.View.extend({
		  template: 'info',
		  el: $('#yield'),
		  events: {
		  	"click #show": 							 "renderCharts",
		  	"click #highlightAbnormals": "highlightAbnormals",
		  	"click #info": 							 "displayInfo"
		  },

		  initialize: function(){
		  		ChartApp.createData("session_history.csv");
		  		this.render();
		  },

		  renderCharts: function(){
		  	this.template = 'charts' ;
		  	this.render(function(){
		  		ChartApp.buildCharts('#container1','#container2');
		  	});  	
		  },

		  highlightAbnormals: function(){
		  	ChartApp.abnormals('#highlightAbnormals');
		  },

		  displayInfo: function(){
		  	this.template = 'info';
		  	this.render();
		  },

		  render: function(callBack){
		    var that = this;
		    $.get("templates/" + this.template + ".html", function(template){
		      var html = $(template);
		      that.$el.html(html);
		      if(typeof(callBack) !== "undefined" ){
		      	callBack();
		      }
		    });
		    return this;
		  }

		});
		var appView = new AppView();
} );