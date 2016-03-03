$(function () {
    var focusedElement;
    $(document).on('focus', 'input', function () {
        if (focusedElement == $(this)) {
            return;
        }
        focusedElement = $(this);
        
        $(this).addClass("cw-sq-focused");
        
        setTimeout(function () { focusedElement.select(); }, 50);
    });
    
    $(document).on('blur', 'input', function () {
        focusedElement = null;
        
        $(this).removeClass("cw-sq-focused");
    });
});