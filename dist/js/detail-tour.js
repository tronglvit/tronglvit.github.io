$(document).ready(function () {
  $('#change-date').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: false,
      minYear: 1901,
      maxYear: parseInt(moment().format('YYYY'), 10),
      autoApply: true,
      locale: {
        format: 'DD-MM-YYYY',
      },
    },
    function (start, end, label) {
      var years = moment().diff(start, 'years')
      alert('You are ' + years + ' years old!')
    }
  )
  $('.other-tour__carousel').owlCarousel({
    autoplay: true,
    loop: true,
    nav: false,
    margin: 0,
    dots: false,
    freeDrag: false,
    autoplayTimeout: 5000,
    margin: 32,
    responsive: {
      0: {
        items: 1,
        stagePadding: 50,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  })
  $('.owl-carousel').on('mousedown touchstart', function (e) {
    const start = e.pageX || e.originalEvent.touches[0].pageX

    $(this).on('mousemove touchmove', function (e) {
      const end = e.pageX || e.originalEvent.touches[0].pageX
      if (start - end > 50) {
        // Threshold for dragging to next slide
        $(this).trigger('next.owl.carousel')
        $(this).off('mousemove touchmove') // Unbind after trigger
      }
    })

    // Unbind the move event if dragging doesn't reach the threshold
    $(this).on('mouseup touchend', function () {
      $(this).off('mousemove touchmove')
    })
  })

  $('.list-thumb__item').on('click', function () {
    $('#modalImages').modal('show')
  })
  $('.images__primary').on('click', function () {
    $('#modalImages').modal('show')
  })
  $('#close-modal').on('click', function () {
    $('#modalImages').modal('hide')
  })

  $('#toggle-menu').click(function () {
    $('.menu-mobile').addClass('active') // Hiển thị với hiệu ứng mờ dần
  })

  // Khi click vào #close-menu, ẩn .menu-mobile
  $('#close-menu').click(function () {
    $('.menu-mobile').removeClass('active') // Ẩn với hiệu ứng mờ dần
  })
  $('.menu-mobile').click(function (event) {
    // Kiểm tra nếu click không nằm trong .menu-mobile__content
    if (!$(event.target).closest('.menu-mobile__content').length) {
      $('.menu-mobile').removeClass('active')
    }
  })
})
