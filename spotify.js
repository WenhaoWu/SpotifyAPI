var response = null ;
var link = null;

$(document).ready(function(){

  var playBox = $(".playBox");

  var screen = $.mobile.getScreenHeight();

  var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();

  var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();

  /* content div has padding of 1em = 16px (32px top+bottom). This step
   can be skipped by subtracting 32px from content var directly. */
   var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();

  var content = screen - header - footer - contentCurrent;

  $(".ui-content").height(content);

  var loadAudio = function(link){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.spotify.com/v1/tracks/"+link);
    //http://help.dottoro.com/ljhcrlbv.php
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = function(){
        if(this.readyState === 4){
          if(this.status === 200){
            response = JSON.parse(this.response);
            var audio = $("#audio");
            audio.attr('src', response.preview_url);

			      $("#song_title").text(response.name);
            $("#song_artist").text(response.artists[0].name);
            audio[0].pause();
			      audio[0].load();//suspends and restores all audio element
			      audio[0].play();
            $('#btn').removeClass('btn_stop disabled').addClass('btn_stop disabled playing') ;
        }
        }
    };
    xhr.send();
  };


  var loadSearch = function(link){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://api.spotify.com/v1/search/?q="+link);
    xhr.setRequestHeader('Accept','qpplication/json');
    xhr.onreadystatechange = function(){
        if(this.readyState === 4){
          if(this.status === 200){
            response = JSON.parse(this.response);
            console.log(response);
            ResultsList(response.tracks.items);
          }
        }
    };

    xhr.send();
  }

  var paraseSearch = function(query){
    var newValue = "";
    for(var i=0; i<query.length; i++){
      if(query[i]==" ")
        newValue+="%20";
      else
        newValue+=query[i];
    }
    return newValue;
  };

  $("#btn_search").click(function(event)
      {
        event.preventDefault();
        var words = $('#searcheName').val();
        words += "&type=track";
        //console.log(words);
		link= paraseSearch(words);
        loadSearch(link);
      }
  )

  var ResultsList=function(object){
	  var ul = $("#results");

	  //if ul has previous result...then clear the ul
	  if(ul.find("li").length>0)
	  {
		ul.empty();
	  }

	  for(var key in object)
	  {

		li = '<li><a id="'+object[key].id+'"><span class="song">'+object[key].name+'</span><br><span class="artists" style="padding: 0 40px">--'+object[key].artists[0].name+'</span></a></li><br>';

		console.log(li);
		ul.append(li);
	  }
  }

	//list item click function
	$(document).on('click', '#results li', function(evt) {
    event.preventDefault();
    var selected = event.target;
     //If the user click on the song name or author name we have to get the url from <a></a>
    if(evt.target.nodeName!=="A"){
      selected=evt.target.parentNode;}

    $('#btn').removeClass().addClass('btn_stop disabled');

    loadAudio(selected.id);
	});


  $("#btn").click(function(evt){
    if(evt.target.className === "btn_stop disabled"){
      audio.play();
      evt.target.classList.add("playing");
    }
    else if(evt.target.className === "btn_stop disabled playing"){
      audio.pause();
      evt.target.classList.remove("playing");
    }

  });

  //playing around with ajax to search photo

  /*var photoSearch = function(artistName) {
  	$.ajax({
  		url: "https://api.spotify.com/v1/search/",
  		data: {
  			q: artistName,
  			type: "artist"
  			},
  		success: function (data) {
  			var artistID = data.artists.items[0].id;
  			var selectedCountry = unitedState
  		},

  		error: function (error) {
  			alert("Sorry, but we coudn't find that artist!");

  		}
  	});

  };*/


})
