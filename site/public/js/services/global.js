//Global Service
angular.module('globalService', [])
    .factory('GlobalService', function(){

        var GlobalService = {
            isMobile : function(){
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                    return true;
                } else {
                    return false;
                }
            }


        };

        return GlobalService;
    });
