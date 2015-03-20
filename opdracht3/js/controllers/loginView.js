var LoginView = Controller.create({

elements: {
    "#name": "$name",
    "#pass": "$pass",
    "#submit": "$submit",
    "#output": "$output"
},

events: {
    "#submit click": "go"
},

go: function(){
    this.user = this.$name.val();
    this.pass = this.$pass.val();
    console.log("Username: ", this.user);
    console.log("Password: ", this.pass);
}

});