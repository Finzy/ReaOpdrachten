var GalleryView = function()
{
    this.el = undefined;
}

GalleryView.prototype.next = function()
{

}

GalleryView.prototype.setElement = function(el)
{
    var self = this;
    this.el = document.querySelector(el);
    this.el.addEventListener('click', function(){ self.toggle() });
}