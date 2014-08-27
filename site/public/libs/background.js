//Slowly change the background gradient
window.onload = function(){
    var innerColor = "#F5E34C";
    var outerColor = "#F5964C";


    function addHexColor(c1, c2) {
        var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
        return hexStr;
    }

    function shadeColor(color, shade) {
        var colorInt = parseInt(color.substring(1),16);

        var R = (colorInt & 0xFF0000) >> 16;
        var G = (colorInt & 0x00FF00) >> 8;
        var B = (colorInt & 0x0000FF) >> 0;

        R = R + Math.floor((shade/255)*R);
        G = G + Math.floor((shade/255)*G);
        B = B + Math.floor((shade/255)*B);

        var newColorInt = (R<<16) + (G<<8) + (B);
        var newColorStr = "#"+newColorInt.toString(16);

        return newColorStr;
    }

    window.setInterval(function(){
        innerColor = addHexColor(innerColor, "000010");
        outerColor = addHexColor(outerColor, "000010");

        document.getElementsByTagName('html')[0].setAttribute('style', 'background-image: ' + 'url(images/noise.png)' + ', -webkit-radial-gradient(center center, ' + innerColor + ', ' + outerColor + ' 750px');
    }, 500);
};
