//Slowly change the background gradient
window.onload = function(){
    var innerColor;
    var outerColor;
    var frequency = .05;
    var i = 0;
    var j = 20;

    function RGB2Color(r,g,b){
        return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    function byte2Hex(n){
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
    }

    function generateColor(frequency, interval){
        red   = Math.sin(frequency * interval + 0) * 127 + 128;
        green = Math.sin(frequency * interval + 2) * 127 + 128;
        blue  = Math.sin(frequency * interval + 4) * 127 + 128;

        return RGB2Color(red, green, blue);
    }

    //Radial Gradient in the Center
    function setBackgroundRadialGradient(color1, color2){
        document.getElementsByTagName('body')[0].setAttribute('style', 'background-image: ' + 'url(images/noise.png)' + ', -webkit-radial-gradient(center center, ' + color1 + ', ' + color2 + ' 750px');
    }

    //Linear Gradient
    function setBackgroundLinearGradient(color1, color2, degree){
        document.body.style.backgroundImage = 'url(images/noise.png)' + ', -webkit-linear-gradient(' + degree + ', ' + color1 + ', ' + color2;
    }

    //Init BackgroundColor
    setBackgroundLinearGradient(generateColor(frequency, i), generateColor(frequency, j), "135deg");
    //setBackgroundRadialGradient(generateColor(frequency, i), generateColor(frequency, j));

    window.setInterval(function(){
        i++;
        j++;

        innerColor = generateColor(frequency, i);
        outerColor = generateColor(frequency, j);

//        setBackgroundRadialGradient(innerColor, outerColor);
        setBackgroundLinearGradient(outerColor, innerColor, "135deg");
  }, 200);


};
