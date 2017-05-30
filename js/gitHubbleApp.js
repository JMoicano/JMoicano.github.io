let dataView = {};
let dataDict = {};

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});

function showResult() {
    $('.modal').modal('open');
}

function functionTest(str) {
    $('input.search-bar').val(str);
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function initializeAutocomplete() {
    $('input.search-bar').autocomplete({
        data: dataView,
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
        onAutocomplete: function (val) {
            getUserDetails(val);
        },
        minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
    });
}

<!-- Funcao request -->
function getUser() {
    $.ajax({
        url: 'https://api.github.com/search/users?q=' + $('input.search-bar').val() + ' in:fullname',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Accept': 'application/vnd.github.v3.text-match+json'
        },
        success: function (result) {
            responseWrapper(result.items);
            initializeAutocomplete();
        }
    });
}

function getUserDetails(keyDict) {
    $.ajax({
        url: dataDict[keyDict],
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            showResult();
        }
    })
}

<!-- Inicia componente por JQuery -->
$(function () {
    initializeAutocomplete()
});

$('input.search-bar').on('keyup', debounce(function () {
    getUser();
}, 500));

function responseWrapper(objResponseItems) {
    dataView = {};
    dataDict = {};

    objResponseItems.forEach(function (elem) {
        dataView[elem.text_matches[0].fragment] = elem.avatar_url;
        dataDict[elem.text_matches[0].fragment] = elem.url;
    });
}