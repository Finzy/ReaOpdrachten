var prev = new GalleryView();
var next = new GalleryView();

var preImg = document.querySelector("#imageGallery");

preImg.src = "http://placehold.it/350x150";

var imgs = ["http://placehold.it/350x250", "http://placehold.it/150x150", "http://placehold.it/450x200"];

var next = document.querySelector("#next");

next.addEventListener('onclick', function(){
    imgs = i++;
});

