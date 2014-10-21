var PasswordModalCtrl = function($scope, $modalInstance, passcode) {

    $scope.actualPasscode = passcode;

    $scope.attempEntry = function(){
        var attemptPasscode = $('#passcodeInput').val();

        if(attemptPasscode == $scope.actualPasscode){
            $modalInstance.close(true);
        } else {
            alert("incorrect passcode");
        }

    };

    $scope.ok = function () {
        $scope.attempEntry();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss(false);
    };
};
