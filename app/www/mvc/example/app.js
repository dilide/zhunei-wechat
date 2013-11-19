var app = new $.mvc.app();

app.loadModels("todo");
app.loadControllers("todo");
//Routing by hash change
//app.listenHashChange();

$.mvc.addRoute("/articles/vatican",function(d){
    console.log("Show articles",arguments,d);
});

//We wait until app.ready is available to fetch the data, then we wire up the existing data in the templates
app.ready(function(){
    $.mvc.route("/todo");//Load the default todo route
});