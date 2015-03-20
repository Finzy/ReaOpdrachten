// we maken een simpel object aan. Dit is een 'property bag' waar we
// eenvoudig functies en properties onder kunnen laten vallen
var Controller = {};

/*
/ we geven het nieuwe object de method create()
/ hierdoor werken we met een soort van namespaces aangezien de rest van
/ de applicatie bij deze functie kan doormiddel van Controller.create()
/ dit maakt het heel leesbaar

/ wat doet deze functie? Het geeft je de mogelijkheid om eenvoudig Controller objecten aan te maken
/ waarbij je nieuwe Controller Object een aantal standaard controller functies meekrijgt en jij makkelijk
/ nieuwe 'eigen' properties kan meegeven
/ zo kan je een viewcontroller maken voor elke view in je applicatie
 */
Controller.create = function(includes){

    // hopelijk herkennen jullie dit al als een constructor zoals Question in Question.js
    // en Users in Users.js dit maakt het mogelijk om een nieuw result te maken
    // waarom noem ik het 'result'? Omdat dit de functie is die ik teruggeef als resultaat
    // als je Controller.create() aanroept
    var result = function(){
        // we roepen this.initializer() aan
        // we gebruiken .apply zodat we alle argumenten / parameters door kunnen geven
        // elke functie heeft een arguments object. Dit is een array waar alle parameters inzitten
        this.initializer.apply(this, arguments);
        // we doen hetzelfde bij de init functie. Deze functie kan per controller overschreven worden
        this.init.apply(this, arguments);
    }

    // we maken een shortcut aan naar result.prototype
    // als er nu ergens result.fn staat dan verwijst dit naar het result.prototype object
    // dit is leesbaarder
    result.fn = result.prototype;
    // we maken een standaard init functie aan op het prototype object
    // als we in de construtor init() aanroepen dan krijgen we geen undefined want er is sowieso
    // een init functie aanwezig in de prototype chain
    // per controller kunnen we init van een vulling voorzien
    result.fn.init = function(){};
    // het elements object kan verwijzingen bevatten naar HTML elementen
    // in MenuView.js staat hier een voorbeeld voor
    // de functie refreshElements (onderin dit bestand) maakt gebruik van dit object
    result.fn.elements = {};

    // we overschrijven de jquery functie
    // als je nu this.$(selector) gebruikt dan doe je eigenlijk $(selector, this.el)
    // hierdoor gaat deze functie alleen HTML elementen opzoeken binnen de 'view' die deze
    // controller beheerd
    result.fn.$ = function(selector){
        // stel je roept this.$("#menu"); aan, dan roep je nu eigenlijk $("#menu", this.el) aan
        // hiermee zorgen we ervoor dat deze controller alleen elementen binnen zijn 'view' mag
        // benaderen
        return $(selector, this.el);
    };

    // dit is de init functie die niet overschreven mag worden
    // deze functie roepen we al aan vanuit de constructor
    result.fn.initializer = function(options){
        // we slaan options op zodat we er later ook nog bij kunnen
        this.options = options;

        // daarnaast loop-en we over alle opties en nemen alle properties over
        // als eigen properties
        for (var key in this.options)
        {
            this[key] = this.options[key];
        }

        // heeft dit object een events object die gevuld is? roep dan refreshEvents aan
        if (this.events) this.refreshEvents();
        // zelfde voor elements
        if (this.elements) this.refreshElements();
    }

    // functie om eenvoudig jquery objecten aan te maken voor bepaalde HTML elementen
    // als je een nieuwe controller aanmaakt kun je aangeven van welke HTML elementen
    // je een jquery object wilt. Deze HTML elementen geef je aan in het 'elementen' object
    result.fn.refreshElements = function(){
        // in deze loop krijg je met key te zien welke properties er binnen dit object zitten
        // dus heeft this.elements een property startElement (this.elements.startElement)
        // dan komt startElement als een key voorbij
        for(var key in this.elements)
        {
            console.log('element: ' + key + " value: " + this.elements[key]);
            this[this.elements[key]] = this.$(key);
        }
    };

    // functie om eenvoudig HTML events te koppelen aan eigen methods
    // bijvoorbeeld: als er wordt geklikt op een knop, voer dan een bepaalde functie uit
    // dit kun je aanmaken door gebruik te maken van het 'events' object
    // in MenuView.js zie je een voorbeeld
    result.fn.refreshEvents = function(){
        // we loop-en over alle properties heen in het events object
        for(var key in this.events)
        {
            // de key is bijvoorbeeld "#startButton click"
            // eerst splitten we op de spatie zodat we "#startButton" en "click" los krijgen
            // split geeft een array terug
            var split = key.split(" ");

            // de selector / referentie naar het HTML element staat op plek 0 in de array
            var selector = split[0];
            // de event staat nu op plek 1 (aangezien de spatie precies tussen de selector en event staat)
            var event = split[1];
            // de method die wij willen uitvoeren als handler, is de value van this.events[key]
            // bijvoorbeeld: "#startButton click": "start"
            // hierin is #startButton click" de property en "start" de value van deze property
            var handler = this.events[key];

            // we halen een jquery object op voor deze selector zodat we listeners kunnen toevoegen
            var element = this.$(selector);
            // we maken de daadwerkelijke listener aan
            // in het voorbeeld "#startButton click": "start"
            // krijgen we nu dus element.on("click", start.bind(this));
            // waarom doe ik niet gewoon this[handler]; ?
            // omdat we dan de 'this' verkeerd laten verwijzen
            // met 'bind' kunnen we this 'vastzetten'
            element.on(event, this[handler].bind(this));
        }
    };

    // als we een nieuwe controller aanmaken met Controller.create()
    // dan kunnen we een object meegeven waarin we functies en properties
    // doorgeven die ook meegenomen mogen worden in de controller
    // zo wordt de controller een object waar de standaard functies op aanwezig zijn (bijvoorbeeld
    // refreshElements) en hij krijgt 'eigen' properties en functies
    if(includes)
    {
        for(var key in includes){
            console.log("key:" + key);
            // elke property kopieren we naar de prototype van result
            // maak je bijvoorbeeld een SocialMenuView.js aan voor social sharing
            // en maak je deze view op deze manier aan: var socialMenuView = new SocialMenuView({test: function(){console.log(5);}});
            // dan heeft socialMenuView een functie test socialMenuView.test();
            result.fn[key] = includes[key];
        }
    }

    // als deze functie klaar is dan returned hij een referentie naar de nieuwe constructor
    // oftewel: wat doet Controller.create() ?
    return result;

}