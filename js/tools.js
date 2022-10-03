$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7\d{10}$/);
        },
        'Неправильно введен Телефон'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.nav-mobile-link').click(function(e) {
        $('html').addClass('mobile-menu-open');
        e.preventDefault();
    });

    $('.nav-mobile-close').click(function(e) {
        $('html').removeClass('mobile-menu-open');
        e.preventDefault();
    });

    $('.main-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#main-slider-prev"></use></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#main-slider-next"></use></svg></button>',
        dots: true,
        fade: true,
        speed: 0,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1269,
                settings: {
                    fade: false,
                    speed: 300,
                    adaptiveHeight: true
                }
            }
        ]
    }).on('setPosition', function(event, slick) {
        if ($('.main-slider .slick-dots').length == 1) {
            var curWidth = $('.main-slider .slick-dots').width();
            $('.main-slider .slick-prev').css({'margin-right': curWidth / 2 + 14});
            $('.main-slider .slick-next').css({'margin-right': -curWidth / 2 - 28});
            $('.main-slider-all').css({'top': $('.main-slider .slick-current').find('.main-slider-item-preview').height() + 20});
        }
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('.main-slider .slick-slide.prev').removeClass('prev');
        $('.main-slider .slick-slide').eq(currentSlide).addClass('prev');
    });

    $('.main-side-links-list').slick({
        infinite: false,
        slidesToShow: 8,
        slidesToScroll: 1,
        vertical: true,
        accessibility: false,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#main-side-links-list-prev"></use></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#main-side-links-list-next"></use></svg></button>',
        dots: false
    });

    $('.filters-group-list-more a').click(function(e) {
        $(this).parent().prev().toggleClass('open');
        e.preventDefault();
    });

    $('.profile-btn-edit a').click(function(e) {
        $('.profile').addClass('editable');
        $('.form-input input').prop('disabled', false);
        e.preventDefault();
    });

    $('.profile form').each(function() {
        var curForm = $(this);
        var validator = curForm.validate();
        if (validator) {
            validator.destroy();
        }
        curForm.validate({
            ignore: '',
            errorLabelContainer: '.profile-errors',
            submitHandler: function(form) {
                $('.profile-errors-server').html('');
                curForm.addClass('loading');
                var formData = new FormData(form);

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $('.profile-errors-server').html('<label class="error">Сервис временно недоступен, попробуйте позже.</label>');
                    curForm.removeClass('loading');
                }).done(function(data) {
                    if (data.status) {
                        $('.profile').removeClass('editable');
                        $('.form-input input').prop('disabled', true);
                    } else {
                        $('.profile-errors-server').html('<label class="error">' + data.message + '</label>');
                    }
                    curForm.removeClass('loading');
                });
            }
        });
    });

    $('.filter-mobile-link a').click(function(e) {
        $('.filter-mobile-link').toggleClass('open');
        $('.filters').toggleClass('open');
        e.preventDefault();
    });

    $('.news-filter-ctrl a').click(function(e) {
        $('.news-filter').toggleClass('open');
        e.preventDefault();
    });
    
    $('#news-filter-year').change(function() {
        $('#news-filter-month').prop('disabled', false);
    });

});


function initForm(curForm) {
    curForm.find('input.phoneRU').mask('+70000000000');

    curForm.find('input.searchID').mask('71 : 00 : 00000');

    curForm.find('.form-select select').each(function() {
        var curSelect = $(this);
        var options = {
            minimumResultsForSearch: 99
        }
        curSelect.select2(options);
    });

    curForm.validate({
        ignore: ''
    });
}

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
        });

    });
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
    }
}