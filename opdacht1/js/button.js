var Button = function()
{
    this.el = undefined;
}

Button.prototype.toggle = function()
{
    this.clicked = !this.clicked
    this.el.className = (this.clicked) ? 'active' : '';
}

Button.prototype.setElement = function(el)
{
    var self = this;
    this.el = document.querySelector(el);
    this.el.addEventListener('click', function(){ self.toggle() });
}
